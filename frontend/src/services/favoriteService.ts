// src/services/favoriteService.ts
import prisma from '@/lib/prisma';

export interface Favorite {
  id: number;
  gameId: string;
  name: string;
  thumbnail: string | null;
  userId: number;
}

export interface FavoriteData {
  gameId: string;
  name:   string;
  thumbnail?: string;
}

export async function getUserFavorites(userId: number): Promise<Favorite[]> {
  const rows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map((f) => ({
    id:        f.id,
    gameId:    f.gameId,
    name:      f.name,
    thumbnail: f.thumbnail,
    userId:    f.userId,
  }));
}

export async function createFavorite(
  userId: number,
  data:   FavoriteData
): Promise<Favorite> {
  const { gameId, name, thumbnail } = data;
  if (!gameId) throw new Error("gameId is required");
  if (!name)   throw new Error("name is required");

  const f = await prisma.favorite.create({
    data: {
      gameId,
      name,
      thumbnail: thumbnail ?? null,
      user: { connect: { id: userId } },
    },
  });

  return {
    id:        f.id,
    gameId:    f.gameId,
    name:      f.name,
    thumbnail: f.thumbnail,
    userId:    f.userId,
  };
}
