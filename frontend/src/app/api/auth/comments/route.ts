// src/app/api/auth/comments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Filter } from "bad-words";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) {
    return NextResponse.json([], { status: 400 });
  }

  // Fetch only top-level comments + their replies
  const comments = await prisma.comment.findMany({
    where: { gameId, parentId: null },
    include: { replies: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  // Only signed-in users may post
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);
  const { gameId, text, parentId } = (await req.json()) as {
    gameId: string;
    text: string;
    parentId?: number | null;
  };

  if (!gameId || !text.trim()) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Profanity filter
  const filter = new Filter();
  if (filter.isProfane(text)) {
    return NextResponse.json(
      { error: "Please keep it civil." },
      { status: 400 }
    );
  }

  // Create comment or reply
  const comment = await prisma.comment.create({
    data: {
      gameId,
      userId: userId.toString(), // convert number to string
      text,
      parentId: parentId ?? null,
    },
  });

  return NextResponse.json(comment);
}
