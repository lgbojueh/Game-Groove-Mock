// src/lib/savedGames.ts
import prisma from '@/lib/prisma';

interface SavedGame {
  id: number;
  title: string;
  userId: number;
}

interface GameData {
  title: string;
}

/**
 * Retrieve all saved games for a given user.
 *
 * @param userId - The numeric ID of the user.
 * @returns A promise that resolves to an array of SavedGame records.
 */
export async function getUserSavedGames(userId: number): Promise<SavedGame[]> {
  try {
    const savedGames = await prisma.savedGame.findMany({
      where: { userId },
    });
    return savedGames;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching saved games:", error.message, error.stack);
    } else {
      console.error("Error fetching saved games:", error);
    }
    throw new Error("Failed to fetch saved games");
  }
}

/**
 * Create a new saved game record for a specific user.
 *
 * @param userId - The numeric ID of the user.
 * @param gameData - An object containing the title of the game.
 * @returns A promise that resolves to the newly created SavedGame record.
 */
export async function createSavedGame(userId: number, gameData: GameData): Promise<SavedGame> {
  try {
    if (!gameData.title) {
      throw new Error("Game title is required");
    }
    const newSavedGame = await prisma.savedGame.create({
      data: {
        title: gameData.title,
        user: { connect: { id: userId } },
      },
    });
    return newSavedGame;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating saved game:", error.message, error.stack);
    } else {
      console.error("Error creating saved game:", error);
    }
    throw new Error("Failed to create saved game");
  }
}
