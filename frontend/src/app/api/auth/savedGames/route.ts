import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const savedGames = await prisma.savedGame.findMany({
      where: { userId: Number(userId) },
    });
    return NextResponse.json(savedGames);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching saved games: ', error.message, error.stack);
    } else {
      console.error('Error fetching saved games: ', error);
    }
    return NextResponse.json({ error: 'Error fetching saved games' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title } = body; // Add other fields as needed
    if (!userId || !title) {
      return NextResponse.json({ error: 'User ID and title are required' }, { status: 400 });
    }
    const newSavedGame = await prisma.savedGame.create({
      data: {
        title,
        user: { connect: { id: Number(userId) } },
      },
    });
    return NextResponse.json(newSavedGame, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating saved game: ', error.message, error.stack);
    } else {
      console.error('Error creating saved game: ', error);
    }
    return NextResponse.json({ error: 'Error creating saved game' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Valid Game ID is required' }, { status: 400 });
    }
    const deletedSavedGame = await prisma.savedGame.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(deletedSavedGame);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting saved game: ', error.message, error.stack);
    } else {
      console.error('Error deleting saved game: ', error);
    }
    return NextResponse.json({ error: 'Error deleting saved game' }, { status: 500 });
  }
}