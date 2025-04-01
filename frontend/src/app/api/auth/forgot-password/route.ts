// File: frontend/src/app/api/auth/forgot-password/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create transporter with Ethereal for testing.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for others
      auth: {
        user: process.env.SMTP_USER || "raina26@ethereal.email",
        pass: process.env.SMTP_PASS || "hR23Uk9MYfbcFWpC97",
      },
    });

    // Here, generate a reset token or link (omitted for brevity)
    const resetLink = `https://yourdomain.com/reset-password?token=your-generated-token`;

    const message = {
      from: `"Game Grove" <${process.env.SMTP_USER || "raina26@ethereal.email"}>`,
      to: email,
      subject: "Reset Your Password",
      text: `Please reset your password using this link: ${resetLink}`,
      html: `<p>Please reset your password by clicking <a href="${resetLink}">here</a>.</p>`,
    };

    const info = await transporter.sendMail(message);
    console.log("Reset password email sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      message: "Reset email sent successfully",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
