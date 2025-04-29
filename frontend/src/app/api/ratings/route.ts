// src/app/api/ratings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  // 1) Only a signed-in user can have a stored rating
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ rating: 0 });
  }

  // 2) Extract & parse parameters
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) {
    return NextResponse.json({ rating: 0 }, { status: 400 });
  }
  const userId = parseInt(session.user.id, 10);

  // 3) Lookup
  const rec = await prisma.rating.findUnique({
    where: { gameId_userId: { gameId, userId } },
  });

  return NextResponse.json({ rating: rec?.rating ?? 0 });
}

export async function POST(req: Request) {
  // 1) Must be signed in
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse input
  const { gameId, rating } = await req.json() as {
    gameId: string;
    rating: number;
  };
  const userId = parseInt(session.user.id, 10);

  // 3) Validate
  if (typeof gameId !== "string" || !gameId) {
    return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });
  }
  const r = Math.floor(rating);
  if (r < 1 || r > 5) {
    return NextResponse.json(
      { error: "Rating must be an integer between 1 and 5" },
      { status: 400 }
    );
  }

  // 4) Upsert into Prisma (userId is a number now)
  await prisma.rating.upsert({
    where: { gameId_userId: { gameId, userId } },
    create: { gameId, userId, rating: r },
    update: { rating: r },
  });

  return NextResponse.json({ success: true });
}
