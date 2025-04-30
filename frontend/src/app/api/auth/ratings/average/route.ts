import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) {
    return NextResponse.json({ average: 0 });
  }

  // Compute the average across all string‐based userIds
  const agg = await prisma.rating.aggregate({
    where: { gameId },
    _avg: { rating: true },
  });

  return NextResponse.json({ average: agg._avg.rating ?? 0 });
}
