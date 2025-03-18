// app/api/auth/forgot-password/route.ts
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request. We expect a field "email".
    const { email } = await request.json();
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a transporter using Ethereal SMTP settings from .env.local
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // use false for port 587; set to true if using port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Define the email message options
    const message = {
      from: `"Game Grove" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request",
      text: "Please click the link to reset your password",
      html: `<p>Please click <a href="https://your-app.com/reset-password?email=${encodeURIComponent(email)}">here</a> to reset your password.</p>`,
    };

    // Send the email
    const info = await transporter.sendMail(message);

    // For Ethereal you can log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);

    return new Response(
      JSON.stringify({ message: "Password reset email sent", previewUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in forgot-password:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
