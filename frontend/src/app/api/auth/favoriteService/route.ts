// /src/app/api/auth/favoriteService/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      try {
        // Expecting a userId in the query string
        const { userId } = req.query;
        const favorites = await prisma.favorite.findMany({
          where: { userId: Number(userId) },
        });
        res.status(200).json(favorites);
      } catch (error) {
        console.error('Error fetching favorites: ', error);
        res.status(500).json({ error: 'Error fetching favorites' });
      }
      break;
    }
    case 'POST': {
      try {
        // Expecting userId and favorite data in the request body
        const { userId, name } = req.body; // add other fields as needed
        const newFavorite = await prisma.favorite.create({
          data: {
            name,
            user: { connect: { id: Number(userId) } },
          },
        });
        res.status(201).json(newFavorite);
      } catch (error) {
        console.error('Error creating favorite: ', error);
        res.status(500).json({ error: 'Error creating favorite' });
      }
      break;
    }
    case 'DELETE': {
      try {
        // Expecting an id in the query string or the request body
        // Here, we're assuming you pass the favorite id in the query string
        const { id } = req.query;
        const deletedFavorite = await prisma.favorite.delete({
          where: { id: Number(id) },
        });
        res.status(200).json(deletedFavorite);
      } catch (error) {
        console.error('Error deleting favorite: ', error);
        res.status(500).json({ error: 'Error deleting favorite' });
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
