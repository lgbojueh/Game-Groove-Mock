// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// For demonstration purposes only; in production use a proper database.
let users: { id: number; username: string; email: string; password: string }[] = [];

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if a user with the same email or username already exists
    const existingUser = users.find(
      (user) => user.email === email || user.username === username
    );
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(), // In production use an auto-generated ID from your DB.
      username,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    return NextResponse.json({
      message: 'Signup successful',
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
