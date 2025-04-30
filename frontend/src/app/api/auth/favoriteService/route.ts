// src/app/api/auth/favoriteService/route.ts
export const runtime = 'nodejs';

import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

  const raw = await prisma.favorite.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
  });

  // Map to the shape your client expects
  const favorites: FavoriteItem[] = raw.map((f) => ({
    id: f.id,
    gameId: f.gameId,
    title: f.name,
    thumbnail: f.thumbnail,
  }));

  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    gameId?: string;
    name?: string;
    thumbnail?: string;
  };

  const { gameId, name, thumbnail } = body;
  if (!gameId) {
    return NextResponse.json({ error: "gameId is required" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const created = await prisma.favorite.create({
    data: {
      gameId,
      name,
      thumbnail: thumbnail ?? null,
      user: { connect: { id: Number(session.user.id) } },
    },
  });

  // Return in the same shape as GET
  const result: FavoriteItem = {
    id: created.id,
    gameId: created.gameId,
    title: created.name,
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
    return NextResponse.json({ error: "Favorite ID is required" }, { status: 400 });
  }

  const deleted = await prisma.favorite.delete({
    where: { id: Number(idParam) },
  });

  // Map to client shape
  const result: FavoriteItem = {
    id: deleted.id,
    gameId: deleted.gameId,
    title: deleted.name,
    thumbnail: deleted.thumbnail,
  };

  return NextResponse.json(result);
}
