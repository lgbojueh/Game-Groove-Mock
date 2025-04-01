// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Configure the pool using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure this is set in your .env.local
});

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const { username, email, password } = await request.json();

    // Hash the plain text password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database using the hashed password
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    return NextResponse.json({
      message: 'Signup successful',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
