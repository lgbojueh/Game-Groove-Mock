// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // This prevents multiple instances of Prisma Client during hot reloads in development.
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
