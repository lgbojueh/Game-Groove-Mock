// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// Use the same in‑memory users array (for demonstration)
let users: { id: number; username: string; email: string; password: string }[] = [];

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Missing token or new password' }, { status: 400 });
    }

    // For demonstration, we assume the token is the user id in string form.
    const userId = Number(token);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
