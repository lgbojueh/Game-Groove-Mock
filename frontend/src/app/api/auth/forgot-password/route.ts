// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const { email } = await request.json();

    // Look up the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Update the user record with the reset token and its expiry
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry: tokenExpiry },
    });

    // Optional: Debug logs to verify env variables are loaded
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS);

    // Configure the transporter using environment variables.
    // Make sure these variables are set (in .env.local if using Next.js)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true if port is 465 (SSL)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Create a reset URL (update the domain as needed)
    const resetUrl = `https://yourdomain.com/reset-password?token=${resetToken}`;

    // Set up the email options
    const message = {
      from: `Game Grove <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset Your Password',
      text: `Please use the following link to reset your password: ${resetUrl}`,
      html: `<p>Please use the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    // Send the email and get a preview URL (if available)
    const info = await transporter.sendMail(message);
    console.log('Email sent, preview URL:', nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      message: 'Reset email sent successfully',
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
