// app/api/test-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    // 1. Generate a test account
    const testAccount = await nodemailer.createTestAccount();

    // 2. Create a transporter using Ethereal Email
    //    The createTestAccount() call gives you random credentials
    //    (host, port, secure, user, pass).
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure, // true if port is 465, false otherwise
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 3. Read JSON data from the request if needed
    const body = await req.json().catch(() => ({}));
    const { to } = body; // e.g. { "to": "someone@example.com" }

    // 4. Define the email message
    //    You can pass any valid fields like 'subject', 'text', 'html', etc.
    const mailOptions = {
      from: `"Game Groove Test" <${testAccount.user}>`,
      to: to || "test@example.com",
      subject: "Hello from Ethereal!",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    };

    // 5. Send the email
    const info = await transporter.sendMail(mailOptions);

    // 6. Return the test info and preview URL in the response
    //    Ethereal provides a preview URL you can open in your browser
    //    to see the “sent” message. It’s only valid for a short time.
    console.log("Message sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
      usedAccount: {
        user: testAccount.user,
        pass: testAccount.pass,
        smtp: testAccount.smtp,
      },
    });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
