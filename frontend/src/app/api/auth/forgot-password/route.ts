// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // TODO: Generate a password reset token, store it securely (e.g., in your database),
    // and send an email to the user with a reset link that includes the token.
    // For example, you might send an email with a link like:
    // https://yourdomain.com/reset-password?token=YOUR_GENERATED_TOKEN

    return NextResponse.json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
