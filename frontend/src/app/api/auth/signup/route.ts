// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Configure the PostgreSQL pool using the environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export a named function for the POST method (required by Next.js App Router)
export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Hash the password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(typeof hashedPassword, hashedPassword);

    // Insert the new user using the hashed password
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    return NextResponse.json({ message: 'Signup successful', user: result.rows[0] });
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
