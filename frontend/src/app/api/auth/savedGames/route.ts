// src/app/api/auth/savedGames/route.ts
export const runtime = 'nodejs';

import { NextResponse, NextRequest }      from "next/server";
import { getServerSession }               from "next-auth/next";
import { authOptions }                    from "@/lib/auth";
import prisma                             from "@/lib/prisma";
import {
  createSavedGame,
  getUserSavedGames,
} from "@/services/savedGames";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const list = await getUserSavedGames(userId);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const { gameId, title, thumbnail } = (await req.json()) as {
    gameId?: string;
    title?:  string;
    thumbnail?: string;
  };

  try {
    const saved = await createSavedGame(userId, { gameId: gameId!, title: title!, thumbnail });
    return NextResponse.json(saved, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
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
  return NextResponse.json({
    id:        deleted.id,
    gameId:    deleted.gameId,
    title:     deleted.title,
    thumbnail: deleted.thumbnail,
  });
}
