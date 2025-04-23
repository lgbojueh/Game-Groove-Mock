// src/app/api/protected/some-endpoint/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  // 1. Grab the Bearer token from the Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header missing or malformed' },
      { status: 401 }
    );
  }
  const token = authHeader.replace(/^Bearer\s+/, '');

  // 2. Verify the token
  interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
  }

  let payload: JwtPayload;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  try {
    payload = jwt.verify(token, secret) as JwtPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // 3. If you need the decoded user info:
  //    (payload will contain whatever you signed, e.g. { userId, email, iat, exp })
  //    You can cast it explicitly if you have a TypeScript type.
  //    const { userId, email } = payload as { userId: string; email: string };

  // 4. Return your protected data
  return NextResponse.json({
    message: 'This is protected data.',
    // optionally echo back some user info:
    user: payload,
  });
}
