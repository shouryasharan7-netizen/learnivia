import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * P1-15: Health check endpoint for Vercel / uptime monitors.
 * Returns platform version and DB reachability WITHOUT leaking any secrets,
 * connection strings, env var values, or user data.
 */
export async function GET() {
  const startMs = Date.now();

  // Minimal DB ping - no user data, no secrets
  let dbOk = false;
  let dbLatencyMs: number | null = null;
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbOk = true;
  } catch {
    // Intentionally swallowed - we only report ok/fail, not the error message
    dbOk = false;
  }

  const status = dbOk ? "ok" : "degraded";
  const httpStatus = dbOk ? 200 : 503;

  return NextResponse.json(
    {
      status,
      version: process.env.npm_package_version ?? "unknown",
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startMs,
      checks: {
        database: {
          status: dbOk ? "ok" : "fail",
          latencyMs: dbLatencyMs,
        },
      },
      // NOTE: Never add env var values, DB URLs, or secrets here.
    },
    {
      status: httpStatus,
      headers: {
        // Health checks should not be cached
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
