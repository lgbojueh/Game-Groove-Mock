// src/app/api/auth/ratings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  // Only signed-in users have a stored rating
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ rating: 0 });
  }

  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) {
    return NextResponse.json({ rating: 0 }, { status: 400 });
  }

  // Parse the user ID (string → number)
  const userId = parseInt(session.user.id, 10);

  const rec = await prisma.rating.findUnique({
    where: { gameId_userId: { gameId, userId } },
  });

  return NextResponse.json({ rating: rec?.rating ?? 0 });
}

export async function POST(req: Request) {
  // Must be signed in to rate
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameId, rating } = (await req.json()) as {
    gameId: string;
    rating: number;
  };

  // Parse the user ID (string → number)
  const userId = parseInt(session.user.id, 10);

  // Validate inputs
  const r = Math.floor(rating);
  if (!gameId || r < 1 || r > 5) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Upsert the rating
  await prisma.rating.upsert({
    where: { gameId_userId: { gameId, userId } },
    create: { gameId, userId, rating: r },
    update: { rating: r },
  });

  return NextResponse.json({ success: true });
}
