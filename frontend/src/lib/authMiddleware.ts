// src/lib/authMiddleware.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function authenticateToken(request: Request) {
  // Get token from cookies. If using Next.js 13 app router, you can use request.cookies.get('token')
  const token = request.cookies.get('token')?.value || '';

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}
