// app/api/auth/forgot-password/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create a Nodemailer transporter using Gmail SMTP settings from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // smtp.gmail.com
      port: Number(process.env.SMTP_PORT), // 587 for TLS
      secure: Number(process.env.SMTP_PORT) === 465, // false for 587, true for 465
      auth: {
        user: process.env.SMTP_USER, // your Gmail address
        pass: process.env.SMTP_PASS, // your app password
      },
    });

    // Define the email message options
    const mailOptions = {
      from: `"Game Grove" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      text: 'You requested a password reset. Please use the link provided to reset your password.',
      html: `<p>You requested a password reset.</p>
             <p>Please click <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?email=${encodeURIComponent(email)}">here</a> to reset your password.</p>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return NextResponse.json(
      { message: 'Password reset email sent' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in forgot-password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
