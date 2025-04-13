// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'A valid email is required' },
        { status: 400 }
      );
    }

    // Look up the user by email, only active accounts (isActive = true)
    const user = await prisma.user.findFirst({
      where: { email, isActive: true },
    });

    // Always return a generic success message to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If the email exists, a reset link will be sent.'
      });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update the user record with reset token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry: tokenExpiry },
    });

    // Validate environment variables for SMTP configuration
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.error('SMTP configuration is missing in environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Configure the transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
    });

    // Create a reset URL (adjust the domain as needed)
    const resetUrl = `https://yourdomain.com/reset-password?token=${resetToken}`;

    // Email message options
    const message = {
      from: `Game Grove <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset Your Password',
      text: `Please use the following link to reset your password: ${resetUrl}`,
      html: `<p>Please use the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log('Email sent. Preview URL:', nodemailer.getTestMessageUrl(info));

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
