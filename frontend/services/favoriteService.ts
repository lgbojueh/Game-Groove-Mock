// favoriteService.ts
import prisma from '@/lib/prisma';

export async function getUserFavorites(userId: number) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });
    return favorites;
  } catch (error) {
    console.error("Error fetching favorites: ", error);
    throw error;
  }
}

export async function createFavorite(userId: number, favoriteData: { name: string /*, etc. */ }) {
  try {
    const newFavorite = await prisma.favorite.create({
      data: {
        name: favoriteData.name,
        user: { connect: { id: userId } },
      },
    });
    return newFavorite;
  } catch (error) {
    console.error("Error creating favorite: ", error);
    throw error;
  }
}
