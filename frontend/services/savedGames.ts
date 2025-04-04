// /lib/savedGames.ts
import prisma from '@/lib/prisma';

export async function createSavedGame(userId: number, savedGameData: { title: string; score: number; /* other fields */ }) {
  try {
    const newSavedGame = await prisma.savedGame.create({
      data: {
        ...savedGameData,
        user: { connect: { id: userId } }
      },
    });
    return newSavedGame;
  } catch (error) {
    console.error("Error creating saved game: ", error);
    throw error;
  }
}

export async function getUserSavedGames(userId: number) {
  try {
    const savedGames = await prisma.savedGame.findMany({
      where: { userId },
    });
    return savedGames;
  } catch (error) {
    console.error("Error fetching saved games: ", error);
    throw error;
  }
}
