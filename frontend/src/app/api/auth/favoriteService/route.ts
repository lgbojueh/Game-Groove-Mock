// src/app/api/auth/favoriteService/route.ts
export const runtime = 'nodejs';

import { NextResponse, NextRequest }     from "next/server";
import { getServerSession }              from "next-auth/next";
import { authOptions }                   from "@/lib/auth";
import prisma                            from "@/lib/prisma";
import {
  createFavorite,
  getUserFavorites,
} from "@/services/favoriteService";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const list = await getUserFavorites(Number(session.user.id));
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const { gameId, name, thumbnail } = (await req.json()) as {
    gameId?: string;
    name?:   string;
    thumbnail?: string;
  };

  try {
    const fav = await createFavorite(userId, {
      gameId: gameId!,
      name:   name!,
      thumbnail,
    });
    return NextResponse.json(fav, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const idParam = req.nextUrl.searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Favorite ID is required" }, { status: 400 });
  }
  const deleted = await prisma.favorite.delete({ where: { id: Number(idParam) } });
  return NextResponse.json({
    id:        deleted.id,
    gameId:    deleted.gameId,
    title:     deleted.name,
    thumbnail: deleted.thumbnail,
  });
}
