import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate environment variables
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in the environment variables.");
    }

    // Look up the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create a JWT payload
    const payload = {
      userId: user.id,
      email: user.email,
    };

    // Sign the token with your secret key
    const secret: jwt.Secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRATION || '1h', // Default to 1 hour
    } as jwt.SignOptions);

    // Return the token along with user info (omit sensitive fields)
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