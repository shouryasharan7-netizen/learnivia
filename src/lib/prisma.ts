import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    ssl: connectionString?.includes("supabase.com") ? { rejectUnauthorized: false } : undefined,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    keepAlive: true,
  })

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

// Retain on globalThis across requests in both development and production
// to prevent connection exhaustion and avoid repeated SSL roundtrips in serverless.
globalForPrisma.prisma = prisma
globalForPrisma.pool = pool
