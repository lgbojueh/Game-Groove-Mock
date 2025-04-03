// src/app/api/auth/signup/route.ts

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Adjust the path if necessary // Ensure env vars are loaded
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Log the DATABASE_URL to verify it’s loaded
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Configure the PostgreSQL pool using the environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Check if an active account already exists for this email
    const emailCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deactivated = FALSE',
      [email]
    );
    if (emailCheck.rowCount! > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    // Check if the username is taken
    const usernameCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND deactivated = FALSE',
      [username]
    );
    if (usernameCheck.rowCount! > 0) {
      return NextResponse.json(
        { error: 'This username is taken. Please choose a different one.' },
        { status: 400 }
      );
    }

    // Hash the password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database using the hashed password
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
