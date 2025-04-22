// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 1) Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'A valid email is required' },
        { status: 400 }
      );
    }

    // 2) Find active user
    const user = await prisma.user.findFirst({
      where: { email, isActive: true },
    });

    // Always return success to avoid account enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If the email exists, a reset link will be sent.'
      });
    }

    // 3) Generate token & expiry
    const resetToken   = crypto.randomBytes(32).toString('hex');
    const tokenExpiry  = new Date(Date.now() + 3600_000); // 1h

    // 4) Persist token on user record
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry: tokenExpiry },
    });

    // 5) Ensure SMTP env vars are set
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NEXTAUTH_URL } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !NEXTAUTH_URL) {
      console.error('Missing SMTP or NEXTAUTH_URL env config');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // 6) Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host:     SMTP_HOST,
      port:     Number(SMTP_PORT),
      secure:   Number(SMTP_PORT) === 465,
      auth:     { user: SMTP_USER, pass: SMTP_PASS },
      // optional timeouts, etc.
    });

    // 7) Build the reset link
    const resetUrl = `${NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // 8) Send the mail
    const info = await transporter.sendMail({
      from:    `Game Groove <${SMTP_USER}>`,
      to:      user.email,
      subject: 'Reset Your Password',
      text:    `Click to reset: ${resetUrl}`,
      html:    `<p>Click to reset:</p><a href="${resetUrl}">${resetUrl}</a>`,
    });

    console.log('Forgot‑password email sent. Preview URL:', nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      message: 'If the email exists, a reset link will be sent.',
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    return NextResponse.json(
      { error: 'Error sending reset link. Please try again.' },
      { status: 500 }
    );
  }
}
