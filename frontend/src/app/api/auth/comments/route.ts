// src/app/api/comments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Filter } from "bad-words";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getGuestId } from "@/utils/guest";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId")!;
  const comments = await prisma.comment.findMany({
    where: { gameId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { gameId, text } = await req.json();
  const userId = typeof session?.user?.id === "number" ? session.user.id : Number(getGuestId());

  const filter = new Filter();
  if (filter.isProfane(text)) {
    return NextResponse.json({ error: "Please keep it civil." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { gameId, userId, text },
  });
  return NextResponse.json(comment);
}
