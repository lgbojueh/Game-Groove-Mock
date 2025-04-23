// src/app/api/auth/reset-password/route.ts

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Parse the JSON body to get the token and the new password.
    const { token, newPassword } = await request.json();

    // Validate that token and newPassword exist and are of the expected type
    if (!token || typeof token !== 'string' || !newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: 'A valid token and new password are required.' },
        { status: 400 }
      );
    }

    // Attempt to find a user where the resetToken matches and the expiry date is in the future.
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    // If no user is found, the token may be invalid or expired.
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Hash the new password using bcrypt with 10 salt rounds.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user: set the new password and clear the reset token and its expiry.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Return a successful JSON response.
    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in reset-password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
