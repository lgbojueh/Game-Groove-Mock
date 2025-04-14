// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent TypeScript error on globalThis
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
}

export default prisma;
