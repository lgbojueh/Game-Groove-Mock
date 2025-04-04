// /services/favoriteService.ts
import prisma from '@/lib/prisma'; // Adjust the path based on your project structure

export async function createFavorite(userId: number, favoriteData: { name: string /*, other fields... */ }) {
  try {
    const newFavorite = await prisma.favorite.create({
      data: {
        ...favoriteData,
        user: { connect: { id: userId } }
      },
    });
    return newFavorite;
  } catch (error) {
    console.error("Error creating favorite: ", error);
    throw error;
  }
}
