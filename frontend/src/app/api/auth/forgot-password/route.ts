// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Look up the user by email, only active accounts (deactivated = false)
    const user = await prisma.user.findFirst({
      where: { email, deactivated: false },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update the user record with reset token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry: tokenExpiry },
    });

    // Debug: Log the SMTP settings
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS);

    // Configure the transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Optional: Set a connection timeout (in milliseconds)
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
      message: 'Reset email sent successfully',
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    return NextResponse.json({ error: 'Error sending reset link. Please try again.' }, { status: 500 });
  }
}
