// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateToken } from '@/lib/authMiddleware';

export async function middleware(request: NextRequest) {
  // Allow NextAuth endpoints to pass through
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const { decoded, error } = await authenticateToken(request); // ✅ Await the async call

  if (error) {
    return error;
  }

  // Optionally pass token to request headers or cookies here if needed
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/protected/:path*', '/protected/:path*'], // ✅ Adjust this to the paths you want to protect
};
