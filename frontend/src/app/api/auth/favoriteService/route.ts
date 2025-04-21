// src/app/api/auth/favoriteService/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  // 1) Check NextAuth session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Fetch only this user's favorites
  const userId = Number(session.user.id);
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, thumbnail } = body as { name?: string; thumbnail?: string };

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const userId = Number(session.user.id);

  const newFav = await prisma.favorite.create({
    data: {
      name,
      thumbnail: thumbnail ?? null,
      user: { connect: { id: userId } },
    },
  });

  return NextResponse.json(newFav, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idParam = req.nextUrl.searchParams.get("id");
  if (!idParam) {
    return NextResponse.json(
      { error: "Favorite ID is required" },
      { status: 400 }
    );
  }

  const deleted = await prisma.favorite.delete({
    where: { id: Number(idParam) },
  });

  return NextResponse.json(deleted);
}
