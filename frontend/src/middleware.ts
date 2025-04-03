// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Token missing' }, { status: 401 });
  }

  try {
    // Verify the token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // Optionally attach the decoded user info to the request or response
    req.nextUrl.searchParams.set('user', JSON.stringify(decoded));
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

// Define which paths to protect
export const config = {
  matcher: ['/api/protected/:path*'], // adjust this to your protected routes
};
