import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  const userId = searchParams.get("userId");
  if (!gameId || !userId) {
    return NextResponse.json({ rating: 0 });
  }

  // Fetch this user's rating (or return 0)
  const rec = await prisma.rating.findUnique({
    where: {
      gameId_userId: {
        gameId,
        userId,      // string
      },
    },
  });

  return NextResponse.json({ rating: rec?.rating ?? 0 });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    gameId: string;
    userId: string;
    rating: number;
  };

  // Validate
  if (
    !body.gameId ||
    !body.userId ||
    typeof body.rating !== "number" ||
    body.rating < 1 ||
    body.rating > 5
  ) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  // Upsert the rating (create new or update existing)
  await prisma.rating.upsert({
    where: {
      gameId_userId: {
        gameId: body.gameId,
        userId: body.userId,
      },
    },
    create: {
      gameId: body.gameId,
      userId: body.userId,
      rating: body.rating,
    },
    update: {
      rating: body.rating,
    },
  });

  return NextResponse.json({ success: true });
}
