// src/app/api/auth/favoriteService/route.ts
export const runtime = 'nodejs';

import { NextResponse, NextRequest } from "next/server";
import { getServerSession }          from "next-auth/next";
import { authOptions }               from "@/lib/auth";
import prisma                        from "@/lib/prisma";
import {
  createFavorite,
  getUserFavorites,
} from "@/services/favoriteService";

interface FavoriteItem {
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

  // fetch raw favorites via service
  const raw = await getUserFavorites(Number(session.user.id));

  // map to client shape
  const list: FavoriteItem[] = raw.map(f => ({
    id:        f.id,
    gameId:    f.gameId,
    title:     f.name,
    thumbnail: f.thumbnail,
  }));

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

  if (!gameId || !name) {
    return NextResponse.json(
      { error: "Both gameId and name are required" },
      { status: 400 }
    );
  }

  try {
    // use your service to create
    const created = await createFavorite(userId, {
      gameId,
      name,
      thumbnail,
    });

    // return in the same FavoriteItem shape
    const result: FavoriteItem = {
      id:        created.id,
      gameId:    created.gameId,
      title:     created.name,
      thumbnail: created.thumbnail,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
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
    return NextResponse.json(
      { error: "Favorite ID is required" },
      { status: 400 }
    );
  }

  const deleted = await prisma.favorite.delete({
    where: { id: Number(idParam) },
  });

  // map to client shape
  const result: FavoriteItem = {
    id:        deleted.id,
    gameId:    deleted.gameId,
    title:     deleted.name,
    thumbnail: deleted.thumbnail,
  };

  return NextResponse.json(result);
}
