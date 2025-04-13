// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Log the DATABASE_URL for debugging (make sure this file is in your Next.js app root and that .env.local is present)
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Configure the PostgreSQL pool using the environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Check if an active account already exists for this email using the correct "isActive" field.
    const emailCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND "isActive" = TRUE',
      [email]
    );
    if (emailCheck.rowCount && emailCheck.rowCount > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Check if the username is already taken (again using the "isActive" field).
    const usernameCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND "isActive" = TRUE',
      [username]
    );
    if (usernameCheck.rowCount && usernameCheck.rowCount > 0) {
      return NextResponse.json(
        { error: 'Username is taken. Please choose another one.' },
        { status: 409 }
      );
    }

    // Hash the password with bcrypt.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user using the hashed password.
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
