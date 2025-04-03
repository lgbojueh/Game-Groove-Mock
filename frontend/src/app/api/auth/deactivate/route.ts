import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Option 1: Delete the user (deactivates the account)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Option 2: Alternatively, you could update an `isActive` field:
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { isActive: false },
    // });

    return NextResponse.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Error in deactivate account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
