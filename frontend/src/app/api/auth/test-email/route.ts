import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const { to } = await request.json();

    // Create a Nodemailer transporter using Ethereal credentials from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Set up the email message details
    const message = {
      from: `"Game Grove" <${process.env.SMTP_USER}>`, // sender address
      to, // recipient address from the request body
      subject: "Test Email from Game Grove",
      text: "This is a test email sent from the Game Grove API.",
      html: "<p><strong>This is a test email sent from the Game Grove API.</strong></p>",
    };

    // Send the email
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      message: "Email sent successfully",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error in test-email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
