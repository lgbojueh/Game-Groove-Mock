// src/app/api/auth/comments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Filter } from "bad-words";

const filter = new Filter();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) {
    return NextResponse.json([], { status: 400 });
  }

  // fetch top‐level + replies, then assemble same as before...
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

  // gather userIds, look up usernames, fall back to “Guest”
  const allIds = Array.from(
    new Set([...parents, ...replies].map((c) => c.userId))
  );
  const numericIds = allIds.filter((id) => /^\d+$/.test(id)).map(Number);
  const users = await prisma.user.findMany({
    where: { id: { in: numericIds } },
    select: { id: true, username: true },
  });
  const nameById = Object.fromEntries(users.map((u) => [String(u.id), u.username]));

  // build comment tree
  const output = parents.map((p) => ({
    id: p.id,
    text: p.text,
    createdAt: p.createdAt.toISOString(),
    username: nameById[p.userId] ?? "Guest",
    replies: [] as Array<{
      id: number;
      text: string;
      createdAt: string;
      username: string;
      parentId: number;
    }>,
  }));

  for (const r of replies) {
    const parent = output.find((o) => o.id === r.parentId);
    if (parent) {
      parent.replies.push({
        id: r.id,
        text: r.text,
        createdAt: r.createdAt.toISOString(),
        username: nameById[r.userId] ?? "Guest",
        parentId: r.parentId!,
      });
    }
  }

  return NextResponse.json(output);
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    gameId: string;
    text: string;
    parentId?: number | null;
    userId: string;
  };

  // basic validation
  if (!body.gameId || !body.text?.trim() || !body.userId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // profanity check (applies to guests too)
  if (filter.isProfane(body.text)) {
    return NextResponse.json(
      { error: "Please keep it civil – no profanity allowed." },
      { status: 400 }
    );
  }

  // create
  const created = await prisma.comment.create({
    data: {
      gameId: body.gameId,
      text: body.text,
      parentId: body.parentId ?? null,
      userId: body.userId,
    },
  });

  // return minimal record (component will re-fetch full list)
  return NextResponse.json({
    id: created.id,
    text: created.text,
    createdAt: created.createdAt.toISOString(),
    username: /^\d+$/.test(body.userId)
      ? (await prisma.user.findUnique({ where: { id: Number(body.userId) }, select: { username: true } }))?.username ?? "Guest"
      : "Guest",
    parentId: created.parentId,
  });
}
