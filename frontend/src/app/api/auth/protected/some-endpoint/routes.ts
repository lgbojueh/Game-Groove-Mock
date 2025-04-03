// src/app/api/protected/some-endpoint/route.ts
import { NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/authMiddleware';

export async function GET(request: Request) {
  const authResult = authenticateToken(request);
  if (authResult instanceof NextResponse) {
    // If authentication fails, this returns a response with an error
    return authResult;
  }

  // Continue handling the request knowing that the token is valid.
  return NextResponse.json({ message: 'This is protected data.' });
}
