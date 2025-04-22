// src/app/api/auth/savedGames/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const savedGames = await prisma.savedGame.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(savedGames);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, thumbnail } = (await req.json()) as {
    title?: string;
    thumbnail?: string;
  };

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const userId = Number(session.user.id);
  const newSaved = await prisma.savedGame.create({
    data: { title, thumbnail: thumbnail ?? null, user: { connect: { id: userId } } },
  });
  return NextResponse.json(newSaved, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const idParam = req.nextUrl.searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
  }
  const deleted = await prisma.savedGame.delete({
    where: { id: Number(idParam) },
  });
  return NextResponse.json(deleted);
}
