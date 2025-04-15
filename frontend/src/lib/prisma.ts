// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global Prisma instance reuse in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Reuse the client in development or create a new one in production
const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
  console.log('🔌 Connected to database:', process.env.DATABASE_URL);
}

export default prisma;
