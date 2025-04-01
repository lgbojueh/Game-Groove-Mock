// app/api/auth/deactivate-account/route.ts
import { NextResponse } from 'next/server';

// Use the same in‑memory users array (for demonstration)
let users: { id: number; username: string; email: string; password: string }[] = [];

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // In a real app you might mark the account as deactivated instead of deleting.
    users.splice(index, 1);
    return NextResponse.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
