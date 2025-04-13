// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateToken } from '@/lib/authMiddleware';

/**
 * Global middleware for protected routes.
 * It bypasses any routes starting with "/api/auth" to avoid interfering with public auth endpoints.
 * For all protected routes (matched by the config below), it calls authenticateToken to validate the JWT.
 */
export function middleware(request: NextRequest) {
  // Exclude NextAuth or public authentication endpoints.
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  
  // Validate the token using our helper.
  const authResult = authenticateToken(request);
  
  // If the helper returns a NextResponse, it means an error occurred.
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  // Token is valid; allow the request to proceed.
  return NextResponse.next();
}

/**
 * Configuration: Only run this middleware for routes that need protection.
 * Adjust the matcher below to fit your application's routing.
 */
export const config = {
  matcher: ['/api/protected/:path*', '/protected/:path*'],
};
