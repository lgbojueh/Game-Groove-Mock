import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const favorites = await prisma.favorite.findMany({
      where: { userId: Number(userId) },
    });
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites: ', error);
    return NextResponse.json({ error: 'Error fetching favorites' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name } = body; // Add other fields as needed
    if (!userId || !name) {
      return NextResponse.json({ error: 'User ID and name are required' }, { status: 400 });
    }
    const newFavorite = await prisma.favorite.create({
      data: {
        name,
        user: { connect: { id: Number(userId) } },
      },
    });
    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error('Error creating favorite: ', error);
    return NextResponse.json({ error: 'Error creating favorite' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Favorite ID is required' }, { status: 400 });
    }
    const deletedFavorite = await prisma.favorite.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(deletedFavorite);
  } catch (error) {
    console.error('Error deleting favorite: ', error);
    return NextResponse.json({ error: 'Error deleting favorite' }, { status: 500 });
  }
}