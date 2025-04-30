// src/app/api/auth/comments/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Filter } from "bad-words";

const filter = new Filter();

type ReplyDTO = {
  id: number;
  userId: string;
  text: string;
  createdAt: string;
  username: string;
  parentId: number;
};
type CommentDTO = {
  id: number;
  userId: string;
  text: string;
  createdAt: string;
  username: string;
  parentId: null;
  replies: ReplyDTO[];
};

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get("gameId");
  if (!gameId) return NextResponse.json<CommentDTO[]>([], { status: 200 });

  const [parents, replies] = await Promise.all([
    prisma.comment.findMany({
      where: { gameId, parentId: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.comment.findMany({
      where: { gameId, parentId: { not: null } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const allIds = Array.from(
    new Set([...parents, ...replies].map((c) => c.userId))
  );
  const numericIds = allIds.filter((id) => /^\d+$/.test(id)).map(Number);
  const users = await prisma.user.findMany({
    where: { id: { in: numericIds } },
    select: { id: true, username: true },
  });
  const nameById = Object.fromEntries(users.map((u) => [String(u.id), u.username]));

  const output: CommentDTO[] = parents.map((p) => ({
    id: p.id,
    userId: p.userId,
    text: p.text,
    createdAt: p.createdAt.toISOString(),
    username: nameById[p.userId] ?? "Guest",
    parentId: null,
    replies: [],
  }));

  for (const r of replies) {
    const parent = output.find((c) => c.id === r.parentId);
    if (parent) {
      parent.replies.push({
        id: r.id,
        userId: r.userId,
        text: r.text,
        createdAt: r.createdAt.toISOString(),
        username: nameById[r.userId] ?? "Guest",
        parentId: r.parentId!,
      });
    }
  }

  return NextResponse.json(output);
}

export async function POST(req: NextRequest) {
  const { gameId, text, parentId, userId: bodyUserId } = (await req.json()) as {
    gameId?: string;
    text?: string;
    parentId?: number | null;
    userId?: string;
  };

  if (!gameId || !text?.trim()) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (filter.isProfane(text)) {
    return NextResponse.json(
      { error: "Please keep it civil – no profanity allowed." },
      { status: 400 }
    );
  }

  // determine who is posting
  const session = await getServerSession(authOptions);
  const userId = session
    ? String(session.user.id)
    : typeof bodyUserId === "string"
    ? bodyUserId
    : null;

  if (!userId) {
    // if no session and no guest id provided
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const created = await prisma.comment.create({
    data: {
      gameId,
      text: text.trim(),
      parentId: parentId ?? null,
      userId,
    },
  });

  const username = session
    ? session.user.name || session.user.email || "User"
    : "Guest";

  return NextResponse.json(
    {
      id: created.id,
      userId,
      text: created.text,
      createdAt: created.createdAt.toISOString(),
      username,
      parentId: created.parentId,
    },
    { status: 201 }
  );
}
