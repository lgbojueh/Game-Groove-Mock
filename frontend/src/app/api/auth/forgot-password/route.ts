// app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create the transporter using Gmail settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // false for TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email message options
    const mailOptions = {
      from: `"Game Grove" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset your password",
      text: "Please click on the link to reset your password: <reset-link>",
      html: "<p>Please click on the link to reset your password: <a href='https://your-app/reset-password'>Reset Password</a></p>",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);
    return NextResponse.json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
