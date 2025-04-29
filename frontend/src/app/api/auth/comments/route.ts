// src/app/api/auth/comments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) return NextResponse.json([], { status: 400 });

  // 1) fetch all top-level & reply comments
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

  // 2) build set of all userIds we need names for
  const allIds = Array.from(
    new Set([...parents, ...replies].map((c) => c.userId))
  );
  const numericIds = allIds.filter((id) => !isNaN(Number(id))).map(Number);
  const users = await prisma.user.findMany({
    where: { id: { in: numericIds } },
    select: { id: true, username: true },
  });
  const nameLookup = Object.fromEntries(
    users.map((u) => [String(u.id), u.username])
  );

  // 3) map parents → output objects
  const output = parents.map((p) => ({
    id: p.id,
    text: p.text,
    createdAt: p.createdAt.toISOString(),
    username: nameLookup[p.userId] ?? "Guest",
    replies: [] as Array<{
      id: number;
      text: string;
      createdAt: string;
      username: string;
      parentId: number;
    }>,
  }));

  // 4) attach replies under their parent
  for (const r of replies) {
    const parent = output.find((o) => o.id === r.parentId);
    if (!parent) continue;
    parent.replies.push({
      id: r.id,
      text: r.text,
      createdAt: r.createdAt.toISOString(),
      username: nameLookup[r.userId] ?? "Guest",
      parentId: r.parentId!,
    });
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
  if (!body.gameId || !body.text.trim()) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const created = await prisma.comment.create({
    data: {
      gameId: body.gameId,
      text: body.text,
      parentId: body.parentId ?? null,
      userId: body.userId,
    },
  });

  // return a minimal record; consumer will re-fetch via GET
  return NextResponse.json({
    id: created.id,
    text: created.text,
    createdAt: created.createdAt.toISOString(),
    username: isNaN(Number(body.userId))
      ? "Guest"
      : (
          await prisma.user.findUnique({
            where: { id: Number(body.userId) },
            select: { username: true },
          })
        )?.username ?? "Guest",
    parentId: created.parentId,
  });
}
