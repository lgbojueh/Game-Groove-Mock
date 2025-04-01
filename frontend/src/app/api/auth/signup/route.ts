// src/app/api/auth/signup/route.ts
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Configure the pool using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // set this in your .env.local
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  try {
    // Hash the plain text password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database using the hashed password
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(200).json({ message: 'Signup successful', user: result.rows[0] });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
