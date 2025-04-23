// src/app/api/auth/favoriteService/route.ts

export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favorites = await prisma.favorite.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, thumbnail } = (await req.json()) as { name?: string; thumbnail?: string };
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const newFav = await prisma.favorite.create({
    data: {
      name,
      thumbnail: thumbnail ?? null,
      user: { connect: { id: Number(session.user.id) } },
    },
  });
  return NextResponse.json(newFav, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const idParam = req.nextUrl.searchParams.get("id");
  if (!idParam) return NextResponse.json({ error: "Favorite ID is required" }, { status: 400 });

  const deleted = await prisma.favorite.delete({ where: { id: Number(idParam) } });
  return NextResponse.json(deleted);
}
