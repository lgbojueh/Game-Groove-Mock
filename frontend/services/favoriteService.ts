// favoriteService.ts
import prisma from '@/lib/prisma';

interface Favorite {
  id: number;
  name: string;
  userId: number;
}

interface FavoriteData {
  name: string;
}

export async function getUserFavorites(userId: number): Promise<Favorite[]> {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });
    return favorites;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching favorites: ", error.message, error.stack);
    } else {
      console.error("Error fetching favorites: ", error);
    }
    throw new Error("Failed to fetch favorites");
  }
}

export async function createFavorite(userId: number, favoriteData: FavoriteData): Promise<Favorite> {
  try {
    if (!favoriteData.name) {
      throw new Error("Favorite name is required");
    }
    const newFavorite = await prisma.favorite.create({
      data: {
        name: favoriteData.name,
        user: { connect: { id: userId } },
      },
    });
    return newFavorite;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating favorite: ", error.message, error.stack);
    } else {
      console.error("Error creating favorite: ", error);
    }
    throw new Error("Failed to create favorite");
  }
}