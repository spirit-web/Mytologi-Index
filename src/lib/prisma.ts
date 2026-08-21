import { PrismaClient } from "@prisma/client";

// Standard Next.js-mönster: återanvänd samma klient mellan hot reloads i dev
// så vi inte öppnar en ny SQLite-anslutning per filändring.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
