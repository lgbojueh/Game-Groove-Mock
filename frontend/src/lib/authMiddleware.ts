// src/lib/authMiddleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Extracts and verifies a JWT from the request's Authorization header.
 * Returns the decoded token if valid, or a NextResponse error if validation fails.
 */
export function authenticateToken(request: NextRequest) {
  // Check for the Authorization header.
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header missing' },
      { status: 401 }
    );
  }

  // Expecting the header format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return NextResponse.json(
      { error: 'Invalid authorization header format' },
      { status: 401 }
    );
  }
  
  const token = parts[1];
  try {
    // Verify the token with the secret from environment variables.
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded; // Returns the decoded token information.
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
