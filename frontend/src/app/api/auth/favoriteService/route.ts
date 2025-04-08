// app/api/favoriteService/route.ts
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
        const { userId } = req.query; // expected in query ?userId=...
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
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
