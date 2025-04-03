// src/lib/authMiddleware.ts
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function authenticateToken(request: NextRequest) {
  // Access cookies from NextRequest
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
