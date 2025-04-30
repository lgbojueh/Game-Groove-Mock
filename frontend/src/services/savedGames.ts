// src/services/savedGames.ts
import prisma from '@/lib/prisma';

export interface SavedGame {
  id:        number;
  gameId:    string;
  title:     string;
  thumbnail: string | null;
  userId:    number;
}

export interface GameData {
  gameId:    string;
  title:     string;
  thumbnail?: string;
}

export async function getUserSavedGames(userId: number): Promise<SavedGame[]> {
  const rows = await prisma.savedGame.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map((s) => ({
    id:        s.id,
    gameId:    s.gameId,
    title:     s.title,
    thumbnail: s.thumbnail,
    userId:    s.userId,
  }));
}

export async function createSavedGame(
  userId:   number,
  data:     GameData
): Promise<SavedGame> {
  const { gameId, title, thumbnail } = data;
  if (!gameId) throw new Error("gameId is required");
  if (!title)  throw new Error("title is required");

  const s = await prisma.savedGame.create({
    data: {
      gameId,
      title,
      thumbnail: thumbnail ?? null,
      user: { connect: { id: userId } },
    },
  });

  return {
    id:        s.id,
    gameId:    s.gameId,
    title:     s.title,
    thumbnail: s.thumbnail,
    userId:    s.userId,
  };
}
