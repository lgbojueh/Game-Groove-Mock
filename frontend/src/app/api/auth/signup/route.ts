// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Configure the PostgreSQL pool using the environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export a named function for the POST method
export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Check if an active account already exists for this email
    const emailCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deactivated = FALSE',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with that email already exists.' },
        { status: 400 }
      );
    }

    // Check if username is already taken by an active account
    const usernameCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND deactivated = FALSE',
      [username]
    );
    if (usernameCheck.rows.length > 0) {
      // Optionally, you could add logic here to suggest similar usernames.
      return NextResponse.json(
        { error: 'Username is taken. Please choose a different username.' },
        { status: 400 }
      );
    }

    // Hash the password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user using the hashed password.
    // Assume there is a boolean column "deactivated" to track active accounts.
    const result = await pool.query(
      `INSERT INTO users (username, email, password, deactivated)
       VALUES ($1, $2, $3, FALSE) RETURNING *`,
      [username, email, hashedPassword]
    );

    return NextResponse.json(
      { message: 'Signup successful', user: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
