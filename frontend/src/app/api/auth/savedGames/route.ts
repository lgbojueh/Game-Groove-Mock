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
        // Expecting userId and saved game data in the request body
        const { userId, title } = req.body; // add other fields as needed
        const newSavedGame = await prisma.savedGame.create({
          data: {
            title,
            // score field removed
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
