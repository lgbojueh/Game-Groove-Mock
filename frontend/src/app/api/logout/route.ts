// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Ensure that you have the correct auth options in this file

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "No active session" }, { status: 400 });
    }

    // You can handle additional cleanup here if needed

    // Sign out the user
    await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout`, {
      method: "POST",
    });

    // Return a success response
    return NextResponse.json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 });
  }
}
