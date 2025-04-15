// lib/authMiddleware.ts
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function authenticateToken(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return {
      error: new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or missing token' }),
        { status: 401 }
      ),
    };
  }

  return { decoded: token };
}
