// src/app/api/auth/savedGames/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');
    if (!userIdParam) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userId = Number(userIdParam);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const savedGames = await prisma.savedGame.findMany({
      where: { userId },
    });
    return NextResponse.json(savedGames);
  } catch (error) {
    console.error('Error fetching saved games:', error);
    return NextResponse.json({ error: 'Error fetching saved games' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId: userIdParam, title, thumbnail } = body;

    if (userIdParam == null || !title) {
      return NextResponse.json({ error: 'User ID and title are required' }, { status: 400 });
    }

    const userId = Number(userIdParam);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const newSavedGame = await prisma.savedGame.create({
      data: {
        title,
        thumbnail,
        user: { connect: { id: userId } },
      },
    });
    return NextResponse.json(newSavedGame, { status: 201 });
  } catch (error) {
    console.error('Error creating saved game:', error);
    return NextResponse.json({ error: 'Error creating saved game' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');
    if (!idParam) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Valid Game ID is required' }, { status: 400 });
    }

    const deletedSavedGame = await prisma.savedGame.delete({
      where: { id },
    });
    return NextResponse.json(deletedSavedGame);
  } catch (error) {
    console.error('Error deleting saved game:', error);
    return NextResponse.json({ error: 'Error deleting saved game' }, { status: 500 });
  }
}
