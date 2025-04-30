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
  if (!gameId) {
    // nothing to fetch!
    return NextResponse.json<CommentDTO[]>([], { status: 200 });
  }

  // 1) fetch root comments + replies
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

  // 2) lookup all userIds so we can map them to usernames
  const allIds = Array.from(new Set([...parents, ...replies].map((c) => c.userId)));
  const numericIds = allIds.filter((id) => /^\d+$/.test(id)).map(Number);
  const users = await prisma.user.findMany({
    where: { id: { in: numericIds } },
    select: { id: true, username: true },
  });
  const nameById = Object.fromEntries(users.map((u) => [String(u.id), u.username]));

  // 3) build the tree
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
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameId, text, parentId } = (await req.json()) as {
    gameId?: string;
    text?: string;
    parentId?: number | null;
  };

  // basic validation
  if (!gameId || !text?.trim()) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (filter.isProfane(text)) {
    return NextResponse.json(
      { error: "Please keep it civil – no profanity allowed." },
      { status: 400 }
    );
  }

  // create it, stamping on the logged-in user
  const created = await prisma.comment.create({
    data: {
      gameId,
      text: text.trim(),
      parentId: parentId ?? null,
      userId: String(session.user.id),
    },
  });

  // pick a friendly display name from session
  const username =
    typeof session.user.name === "string" && session.user.name
      ? session.user.name
      : session.user.email ?? "Guest";

  // return minimal record (your front-end typically re-fetches the full tree)
  return NextResponse.json(
    {
      id: created.id,
      userId: String(session.user.id),
      text: created.text,
      createdAt: created.createdAt.toISOString(),
      username,
      parentId: created.parentId,
    },
    { status: 201 }
  );
}
