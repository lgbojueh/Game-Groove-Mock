// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Log the DATABASE_URL for debugging (remove or disable in production)
console.log('DATABASE_URL:', process.env.DATABASE_URL);

declare global {
  // Prevent multiple instances of Prisma Client during hot reloads in development.
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
