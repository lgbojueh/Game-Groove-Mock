// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
 // adjust path to your Prisma client

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Look up the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // You can create and return a JWT or session here if needed.
    return NextResponse.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
