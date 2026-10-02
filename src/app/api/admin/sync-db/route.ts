import { NextRequest, NextResponse } from "next/server";
import { prisma, pool } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const adminKeyHeader = request.headers.get("x-learnivia-admin-key");
    const searchParams = request.nextUrl.searchParams;
    const queryKey = searchParams.get("key");

    const secretKey = process.env.AUTH_SECRET;
    const isSecretAuthorized =
      secretKey &&
      (authHeader === `Bearer ${secretKey}` ||
        authHeader === secretKey ||
        adminKeyHeader === secretKey ||
        queryKey === secretKey);

    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.isAdmin || currentUser?.role === "ADMIN";

    if (!isAdmin && !isSecretAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator secret or session required." },
        { status: 401 }
      );
    }

    const migrationQueries = [
      // User table columns
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "failedLoginCount" INTEGER DEFAULT 0;`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP(3);`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "accountSuspended" BOOLEAN DEFAULT false;`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "suspendedReason" TEXT;`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP(3);`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "emailVerificationToken" TEXT;`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "emailVerificationExpires" TIMESTAMP(3);`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3);`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "isMinor" BOOLEAN DEFAULT false;`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "parentEmail" TEXT;`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "guardianConsentGiven" BOOLEAN DEFAULT false;`,
      `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "points" INTEGER DEFAULT 0;`,

      // Audit and support tables
      `CREATE TABLE IF NOT EXISTS "AdminAuditLog" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "adminId" TEXT NOT NULL,
        action TEXT NOT NULL,
        "targetId" TEXT,
        reason TEXT,
        "beforeState" JSONB,
        "afterState" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "ApplicationAuditLog" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "tutorId" TEXT NOT NULL,
        "adminId" TEXT NOT NULL,
        action TEXT NOT NULL,
        reason TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "ChildProfile" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "parentId" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastInitial" TEXT NOT NULL,
        grade TEXT NOT NULL,
        age INTEGER,
        "learningPreferences" TEXT,
        notes TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "TutorTraining" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "tutorId" TEXT NOT NULL,
        "moduleId" INTEGER NOT NULL,
        "moduleTitle" TEXT NOT NULL,
        "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "quizPassed" BOOLEAN NOT NULL DEFAULT false,
        UNIQUE("tutorId", "moduleId")
      );`,

      `CREATE TABLE IF NOT EXISTS "VolunteerHourAudit" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "tutorId" TEXT NOT NULL,
        "adjustedBy" TEXT NOT NULL,
        "oldHours" DOUBLE PRECISION NOT NULL,
        "newHours" DOUBLE PRECISION NOT NULL,
        reason TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
    ];

    const results: string[] = [];
    for (const q of migrationQueries) {
      try {
        if (pool) {
          await pool.query(q);
        } else {
          await prisma.$executeRawUnsafe(q);
        }
        results.push("OK");
      } catch (err: any) {
        results.push(`WARN: ${err?.message || "Unknown error"}`);
      }
    }

    // Sanitize any non-designated admin accounts in DB to role STUDENT
    let sanitizedNonAdminsCount = 0;
    try {
      const updateRes = await prisma.user.updateMany({
        where: {
          email: {
            notIn: ["shouryasharan7@gmail.com", "ahmedashfaqfarooqui@gmail.com"],
          },
          role: "ADMIN",
        },
        data: { role: "STUDENT" },
      });
      sanitizedNonAdminsCount = updateRes.count;
    } catch (e: any) {
      console.warn("Notice: admin sanitization error:", e);
    }

    // Ensure designated admins have role ADMIN
    for (const adminEmail of ["shouryasharan7@gmail.com", "ahmedashfaqfarooqui@gmail.com"]) {
      try {
        await prisma.user.updateMany({
          where: { email: adminEmail },
          data: { role: "ADMIN" },
        });
      } catch (e) {}
    }

    // Verify columns on User table
    let verifiedColumns: any[] = [];
    try {
      if (pool) {
        const queryRes = await pool.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'User'
          ORDER BY column_name;
        `);
        verifiedColumns = queryRes.rows.map((r: any) => r.column_name);
      }
    } catch (e: any) {
      verifiedColumns = [`Query failed: ${e?.message}`];
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      migrationCount: migrationQueries.length,
      sanitizedNonAdminsCount,
      userColumnsPresent: verifiedColumns,
    });
  } catch (error: any) {
    console.error("Database sync handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal database sync error" },
      { status: 500 }
    );
  }
}
