import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // Use false for port 587 (TLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Game Groove" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      text: 'Please click the following link to reset your password: https://your-domain.com/reset-password?token=YOUR_TOKEN_HERE',
      html: `<p>Please click the following link to reset your password:</p>
             <p><a href="https://your-domain.com/reset-password?token=YOUR_TOKEN_HERE">Reset Password</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
