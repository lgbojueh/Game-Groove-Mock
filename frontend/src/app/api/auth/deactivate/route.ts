// src/app/api/auth/deactivate/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  // 1) Only signed-in users may deactivate
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id, 10);

  try {
    // 2) Hard-delete the user (cascades favorites & savedGames)
    await prisma.user.delete({
      where: { id: userId },
    });

    // 3) Sign them out on the client
    return NextResponse.json(
      { message: "Account deleted successfully" }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
