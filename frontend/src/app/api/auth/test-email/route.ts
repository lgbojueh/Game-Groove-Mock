// Example: app/api/test-email/route.ts (or .js)
// For TypeScript, you can add types as needed

import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Create a test account. In production, you might use your own SMTP provider.
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter object using the test account's SMTP details.
    let transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Parse the incoming JSON request (expects a "to" field).
    const { to } = await request.json();

    // Define your message options.
    let message = {
      from: 'Game Grove <no-reply@gamegrove.test>',
      to: to, // recipient address from the request
      subject: 'Test Email from Game Grove',
      text: 'Hello from Game Grove!',
      html: '<p><b>Hello</b> from Game Grove!</p>',
    };

    // Send the email.
    let info = await transporter.sendMail(message);

    // Optionally, log the preview URL for Ethereal.
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', previewUrl);

    return new Response(JSON.stringify({ message: 'Email sent', previewUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in test-email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
