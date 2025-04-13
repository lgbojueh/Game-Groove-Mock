// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate that the JWT secret is set
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set in the environment variables.");
    }

    // Look up the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Return error if no user is found
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create a JWT payload
    const payload = {
      userId: user.id,
      email: user.email,
    };

    // Sign the token with your secret key and set an expiration time (default 1 hour)
    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    } as jwt.SignOptions);

    // Return the token along with non-sensitive user information
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
