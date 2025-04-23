// src/app/api/auth/verify-token/route.ts

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface VerifyRequestBody {
  token: string;
}

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export async function POST(req: NextRequest) {
  // 1. Parse and validate the incoming JSON
  let body: VerifyRequestBody;
  try {
    body = (await req.json()) as VerifyRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
  const { token } = body;
  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 400 }
    );
  }

  // 2. Verify the JWT
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not set");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    // 3. Return the decoded payload on success
    return NextResponse.json({ decoded });
  } catch (err) {
    console.error("Token verification failed:", err);
    const message =
      err instanceof Error ? err.message : "Could not verify token";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
