// app/api/auth/forgot-password/route.ts

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// This POST handler is invoked when you send a POST request to /api/auth/forgot-password
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Create a transporter using Gmail SMTP settings.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT), // 587
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER, // your Gmail address
        pass: process.env.SMTP_PASS, // your Gmail app password
      },
    });

    // Define the email options.
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password",
      text: `Click the link below to reset your password:\n\nhttp://localhost:3000/reset-password?token=YOUR_TOKEN_HERE`,
      // Optionally add HTML content:
      // html: `<p>Click <a href="http://localhost:3000/reset-password?token=YOUR_TOKEN_HERE">here</a> to reset your password.</p>`
    };

    // Send the email.
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);

    return NextResponse.json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
