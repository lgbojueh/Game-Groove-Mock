// src/app/api/auth/favoriteService/route.ts
export const runtime = 'nodejs';

import { NextResponse, NextRequest }     from "next/server";
import { getServerSession }              from "next-auth/next";
import { authOptions }                   from "@/lib/auth";
import {
  createFavorite,
  getUserFavorites,
} from "@/services/favoriteService";

export async function GET(req: NextRequest) {
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
  const { gameId, name, thumbnail } = (await req.json()) as {
    gameId?: string;
    name?:   string;
    thumbnail?: string;
  };

  try {
    const fav = await createFavorite(Number(session.user.id), { gameId: gameId!, name: name!, thumbnail });
    return NextResponse.json(fav, { status: 201 });
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
    return NextResponse.json({ error: "Favorite ID is required" }, { status: 400 });
  }
  // still using Prisma directly for delete
  const deleted = await prisma.favorite.delete({ where: { id: Number(idParam) } });
  return NextResponse.json({
    id:        deleted.id,
    gameId:    deleted.gameId,
    title:     deleted.name,
    thumbnail: deleted.thumbnail,
  });
}
