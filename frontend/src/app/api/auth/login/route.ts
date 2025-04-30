// src/app/api/auth/login/route.ts

// force this API route to run in Node.js (so we can import `jsonwebtoken`)
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Normalize and trim the email
    const normalizedEmail = email.trim();

    // Look up the user case-insensitively
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      // Delay to mitigate timing attacks
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set in the environment variables.");
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const token = jwt.sign(
      payload,
      secret,
      {
        expiresIn: process.env.JWT_EXPIRATION
          ? parseInt(process.env.JWT_EXPIRATION, 10)
          : "1h",
      }
    );

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
