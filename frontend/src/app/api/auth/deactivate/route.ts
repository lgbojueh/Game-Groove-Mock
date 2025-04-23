// src/app/api/auth/deactivate/route.ts

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST() {
  // 1) Only signed‑in users may deactivate
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 2) Grab their own user ID from the session
  const userId = parseInt(session.user.id, 10);

  try {
    // 3) Soft‑delete their account
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return NextResponse.json(
      { message: 'Account deactivated successfully' }
    );
  } catch (error) {
    console.error('Error deactivating account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
