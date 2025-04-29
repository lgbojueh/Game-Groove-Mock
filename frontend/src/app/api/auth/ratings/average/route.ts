import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) {
    return NextResponse.json({ average: 0 }, { status: 400 });
  }

  const agg = await prisma.rating.aggregate({
    where: { gameId },
    _avg: { rating: true },
  });

  // round to one decimal place
  const average = agg._avg.rating
    ? Math.round(agg._avg.rating * 10) / 10
    : 0;

  return NextResponse.json({ average });
}
