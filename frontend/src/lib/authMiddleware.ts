// lib/authMiddleware.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return { error: new Response(JSON.stringify({ error: 'Authorization header missing' }), { status: 401 }) };
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return { error: new Response(JSON.stringify({ error: 'Invalid authorization header format' }), { status: 401 }) };
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return { decoded };
  } catch (error) {
    return { error: new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 401 }) };
  }
}
