// pages/api/saved-games/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { AuthOptions } from 'next-auth'; // adjust path as needed
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = Number(session.user.id);

  switch (req.method) {
    case 'GET': {
      try {
        const savedGames = await prisma.savedGame.findMany({
          where: { userId },
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
        const { title } = req.body;
        const newSavedGame = await prisma.savedGame.create({
          data: {
            title,
            user: { connect: { id: userId } },
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
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
