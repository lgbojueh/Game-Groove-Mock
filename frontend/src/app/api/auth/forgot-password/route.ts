// File: /src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Create a transporter using Gmail settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // should be smtp.gmail.com
      port: Number(process.env.SMTP_PORT), // 587
      secure: false, // false for STARTTLS on port 587
      auth: {
        user: process.env.SMTP_USER, // your Gmail address
        pass: process.env.SMTP_PASS, // your Gmail app password
      },
    });

    // Set up email options
    const mailOptions = {
      from: `"Game Grove" <${process.env.SMTP_USER}>`, // sender address
      to: email, // receiver address
      subject: 'Password Reset Request',
      text: 'Please click on the following link to reset your password.',
      html: `<p>Please click <a href="https://your-domain/reset-password?token=YOUR_TOKEN">here</a> to reset your password.</p>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ message: 'Password reset email sent.' }, { status: 200 });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
