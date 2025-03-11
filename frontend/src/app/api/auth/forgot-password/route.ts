// app/api/auth/forgot-password/route.ts

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Debug: log the SMTP host and port
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Should be "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT), // 587 for Gmail
      secure: false, // false for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password",
      text: `Click the link below to reset your password:\n\nhttp://localhost:3000/reset-password?token=YOUR_TOKEN_HERE`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);

    return NextResponse.json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
