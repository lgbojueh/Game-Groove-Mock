// src/app/api/auth/favoriteService/route.ts
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

    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });
    return NextResponse.json(favorites);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching favorites:', error.message, error.stack);
    } else {
      console.error('Error fetching favorites:', error);
    }
    return NextResponse.json({ error: 'Error fetching favorites' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId: userIdParam, name } = body;
    if (userIdParam == null || !name) {
      return NextResponse.json({ error: 'User ID and name are required' }, { status: 400 });
    }

    const userId = Number(userIdParam);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const newFavorite = await prisma.favorite.create({
      data: {
        name,
        user: { connect: { id: userId } },
      },
    });
    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating favorite:', error.message, error.stack);
    } else {
      console.error('Error creating favorite:', error);
    }
    return NextResponse.json({ error: 'Error creating favorite' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');
    if (!idParam) {
      return NextResponse.json({ error: 'Favorite ID is required' }, { status: 400 });
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Valid Favorite ID is required' }, { status: 400 });
    }

    const deletedFavorite = await prisma.favorite.delete({
      where: { id },
    });
    return NextResponse.json(deletedFavorite);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting favorite:', error.message, error.stack);
    } else {
      console.error('Error deleting favorite:', error);
    }
    return NextResponse.json({ error: 'Error deleting favorite' }, { status: 500 });
  }
}