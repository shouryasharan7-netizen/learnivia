import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.AUTH_SECRET;
    const isSecretAuthorized =
      secretKey &&
      authHeader &&
      (authHeader === `Bearer ${secretKey}` || authHeader === secretKey);

    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.isAdmin || currentUser?.role === "ADMIN";

    if (!isAdmin && !isSecretAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator credentials or secret required." },
        { status: 401 }
      );
    }

    // 1. Enable RLS on all tables in public schema
    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
        END LOOP;
      END $$;
    `);

    // 2. Revoke PostgREST public access from anon and authenticated roles
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
          REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
          REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
          REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
          REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
          REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
          REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM authenticated;
        END IF;
      END $$;
    `);

    // 3. Grant full permissions to postgres & service_role
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
          GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
          GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
          GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;
        END IF;

        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'postgres') THEN
          GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
          GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
          GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres;
        END IF;
      END $$;
    `);

    // 4. Query and return status of all public tables
    const tableStatus: Array<{ tablename: string; rowsecurity: boolean }> =
      await prisma.$queryRawUnsafe(`
        SELECT tablename, rowsecurity
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename;
      `);

    return NextResponse.json({
      success: true,
      message: "Row Level Security enabled across all public schema tables in Supabase.",
      securedTablesCount: tableStatus.length,
      tables: tableStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Failed to secure Supabase RLS:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error securing RLS." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
