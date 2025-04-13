// src/app/api/protected/some-endpoint/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { authenticateToken } from '@/lib/authMiddleware';

export async function GET(request: NextRequest) {
  // Run our authentication helper to verify the token.
  const authResult = authenticateToken(request);
  
  // If the helper returns a NextResponse, it indicates an authentication error.
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // At this point, the token is verified; proceed with the protected action.
  return NextResponse.json({ message: 'This is protected data.' });
}
