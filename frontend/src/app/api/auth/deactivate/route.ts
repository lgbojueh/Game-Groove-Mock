import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId: userIdString } = await request.json();
    const userId = parseInt(userIdString, 10);

    if (!userIdString || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Option 1: Soft delete (recommended)
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }, // Assuming you have an `isActive` field
    });

    // Option 2: Hard delete (if you want to permanently delete the user)
    // await prisma.user.delete({
    //   where: { id: userId },
    // });

    return NextResponse.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Error in deactivate account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}