// app/api/savedGames/route.ts
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
        const { userId } = req.query;
        const savedGames = await prisma.savedGame.findMany({
          where: { userId: Number(userId) },
        });
        res.status(200).json(savedGames);
      } catch (error) {
        console.error('Error fetching saved games: ', error);
        res.status(500).json({ error: 'Error fetching saved games' });
      }
      break;
    }
    case 'POST': {
      try {
        const { userId, title } = req.body;
        const newSavedGame = await prisma.savedGame.create({
          data: {
            title,
            user: { connect: { id: Number(userId) } },
          },
        });
        res.status(201).json(newSavedGame);
      } catch (error) {
        console.error('Error creating saved game: ', error);
        res.status(500).json({ error: 'Error creating saved game' });
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
