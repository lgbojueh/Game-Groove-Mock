// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateToken } from '@/lib/authMiddleware';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const { decoded, error } = authenticateToken(request);

  if (error) {
    return error;
  }

  // Optionally, you can add token info to request headers or cookies here if needed

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/protected/:path*', '/protected/:path*'],
};
