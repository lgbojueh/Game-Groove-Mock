// src/app/api/auth/signup/route.ts

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Basic validation
    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
    }

    // Check if the email is already in use
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Check if the username is already taken
    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        isActive: true,
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is taken. Please choose another one.' },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isActive: true, // Optional if handled by default
      },
    });

    return NextResponse.json({
      message: 'Signup successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
