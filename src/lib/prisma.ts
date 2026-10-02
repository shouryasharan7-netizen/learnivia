import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
export const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    ssl:
      connectionString?.includes("supabase.co") ||
      connectionString?.includes("supabase.com")
        ? { rejectUnauthorized: false }
        : undefined,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 60000,
    keepAlive: true,
  });

const adapter = new PrismaPg(pool);

// Self-healing schema synchronization for missing columns/tables on production
if (connectionString) {
  pool
    .query(
      `
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "failedLoginCount" INTEGER DEFAULT 0;
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP(3);
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "accountSuspended" BOOLEAN DEFAULT false;
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "suspendedReason" TEXT;
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP(3);
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "emailVerificationToken" TEXT;
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "emailVerificationExpires" TIMESTAMP(3);
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3);
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "isMinor" BOOLEAN DEFAULT false;
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "parentEmail" TEXT;
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "guardianConsentGiven" BOOLEAN DEFAULT false;
      ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "points" INTEGER DEFAULT 0;

      CREATE TABLE IF NOT EXISTS "AdminAuditLog" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "adminId" TEXT NOT NULL,
        action TEXT NOT NULL,
        "targetId" TEXT,
        reason TEXT,
        "beforeState" JSONB,
        "afterState" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "ApplicationAuditLog" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "tutorId" TEXT NOT NULL,
        "adminId" TEXT NOT NULL,
        action TEXT NOT NULL,
        reason TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `,
    )
    .catch((err) => {
      console.warn("Schema self-heal notice (non-fatal):", err?.message);
    });
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Retain on globalThis across requests in both development and production
// to prevent connection exhaustion and avoid repeated SSL roundtrips in serverless.
globalForPrisma.prisma = prisma;
globalForPrisma.pool = pool;

