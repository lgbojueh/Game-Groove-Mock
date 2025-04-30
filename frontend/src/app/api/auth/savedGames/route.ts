// src/app/api/auth/savedGames/route.ts
export const runtime = 'nodejs';

import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface SavedItem {
  id: number;
  gameId: string;
  title: string;
  thumbnail: string | null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const raw = await prisma.savedGame.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const saved: SavedItem[] = raw.map((s) => ({
    id: s.id,
    gameId: s.gameId,
    title: s.title,
    thumbnail: s.thumbnail,
  }));

  return NextResponse.json(saved);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    gameId?: string;
    title?: string;
    thumbnail?: string;
  };
  const { gameId, title, thumbnail } = body;

  if (!gameId) {
    return NextResponse.json({ error: "gameId is required" }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const created = await prisma.savedGame.create({
    data: {
      gameId,
      title,
      thumbnail: thumbnail ?? null,
      user: { connect: { id: Number(session.user.id) } },
    },
  });

  const result: SavedItem = {
    id: created.id,
    gameId: created.gameId,
    title: created.title,
    thumbnail: created.thumbnail,
  };

  return NextResponse.json(result, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idParam = req.nextUrl.searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const deleted = await prisma.savedGame.delete({
    where: { id: Number(idParam) },
  });

  const result: SavedItem = {
    id: deleted.id,
    gameId: deleted.gameId,
    title: deleted.title,
    thumbnail: deleted.thumbnail,
  };

  return NextResponse.json(result);
}
