// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateToken } from '@/lib/authMiddleware';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const { error } = await authenticateToken(request);

  if (error) {
    return error;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/protected/:path*', '/protected/:path*'],
};
