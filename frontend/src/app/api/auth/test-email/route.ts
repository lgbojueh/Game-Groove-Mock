// File: frontend/src/app/api/auth/test-email/route.ts

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // Log the environment variables for debugging
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS);

    // Parse the request body
    const { to } = await request.json();

    // Create the transporter using Ethereal credentials with fallback defaults
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for others
      auth: {
        user: process.env.SMTP_USER || "raina26@ethereal.email",
        pass: process.env.SMTP_PASS || "hR23Uk9MYfbcFWpC97",
      },
    });

    const message = {
      from: `"Game Grove" <${process.env.SMTP_USER || "raina26@ethereal.email"}>`,
      to,
      subject: "Test Email from Game Grove",
      text: "This is a test email sent from the Game Grove API.",
      html: "<p><strong>This is a test email sent from the Game Grove API.</strong></p>",
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      message: "Email sent successfully",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error in test-email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
