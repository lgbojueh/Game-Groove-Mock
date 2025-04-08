// pages/api/favorites/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]'; // adjust path as needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the session for authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Assume session.user has an id property
  const userId = Number(session.user.id);

  switch (req.method) {
    case 'GET': {
      try {
        // Now we query favorites for the authenticated user
        const favorites = await prisma.favorite.findMany({
          where: { userId },
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
        // Expect favorite data (e.g., name) in the request body.
        const { name } = req.body;
        const newFavorite = await prisma.favorite.create({
          data: {
            name,
            user: { connect: { id: userId } },
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
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
