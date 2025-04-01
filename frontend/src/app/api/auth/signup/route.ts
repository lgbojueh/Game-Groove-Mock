// Example: pages/api/auth/signup.js (or under app/api if using the app directory)
import { Pool } from 'pg';

// Configure the pool using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // set this in your .env.local
});

// Example API handler
export default async function handler(req: { method: string; body: { username: any; email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; user?: any; }): void; new(): any; }; }; }) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  try {
    // Insert user into the database
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.status(200).json({ message: 'Signup successful', user: result.rows[0] });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
