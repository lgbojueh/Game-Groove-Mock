// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

// In-memory store for tokens (for demonstration only—use a persistent store in production)
const resetTokens: { [email: string]: { token: string; expires: number } } = {};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate a secure token (64 hex characters)
    const token = crypto.randomBytes(32).toString("hex");
    // Set token expiration to 1 hour from now
    const expires = Date.now() + 3600000; // 3600000 ms = 1 hour

    // Store the token and expiration time in the in-memory store
    resetTokens[email] = { token, expires };

    // Construct the reset link.
    // In production, use your actual domain (or environment variable).
    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Create a Nodemailer transporter.
    // Replace the host, port, and auth details with your email service's settings.
    const transporter = nodemailer.createTransport({
      host: "smtp.example.com", // e.g., smtp.gmail.com
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "youruser@example.com",
        pass: "yourpassword",
      },
    });

    // Send the email with the reset link
    const info = await transporter.sendMail({
      from: '"Game Grove" <no-reply@gamegrove.com>',
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset. Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
