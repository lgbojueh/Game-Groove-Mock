// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { createEmailTransporter } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, provider } = body; // provider might be 'gmail', 'outlook', or 'yahoo'
    
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Use the selected provider or default to Gmail.
    const transporter = createEmailTransporter(provider || "gmail");

    const mailOptions = {
      from: process.env.SMTP_GMAIL_USER, // or you can dynamically choose based on the provider
      to: email,
      subject: "Password Reset Request",
      text: "Click the link to reset your password.",
      html: "<p>Click the link to reset your password.</p>",
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Reset link sent." });
  } catch (error: any) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
