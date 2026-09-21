import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAdminEmails } from "@/auth.config";

async function assertAdmin(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return null;
  const email = session.user.email.trim().toLowerCase();
  // P0-5: Admin check via env var only - no hardcoded email list
  const adminEmails = getAdminEmails();
  const isAdmin = session.user.role === "ADMIN" || adminEmails.has(email);
  if (!isAdmin) return null;
  return session.user;
}

// POST /api/admin/hours - Adjust tutor volunteer hours with audit trail
export async function POST(req: NextRequest) {
  const admin = await assertAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { tutorProfileId, newHours, reason } = body;

  if (!tutorProfileId || newHours === undefined || !reason?.trim()) {
    return NextResponse.json(
      { error: "tutorProfileId, newHours, and reason are required." },
      { status: 400 }
    );
  }

  const parsed = parseFloat(newHours);
  if (isNaN(parsed) || parsed < 0) {
    return NextResponse.json({ error: "newHours must be a non-negative number." }, { status: 400 });
  }

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    select: { id: true, volunteerHours: true },
  });

  if (!tutor) {
    return NextResponse.json({ error: "Tutor profile not found." }, { status: 404 });
  }

  // Run both updates in a transaction - audit record + actual hours update
  const [audit] = await prisma.$transaction([
    prisma.volunteerHourAudit.create({
      data: {
        tutorId: tutorProfileId,
        adjustedBy: admin.id || admin.email || "admin",
        oldHours: tutor.volunteerHours,
        newHours: parsed,
        reason: reason.trim(),
      },
    }),
    prisma.tutorProfile.update({
      where: { id: tutorProfileId },
      data: { volunteerHours: parsed },
    }),
  ]);

  return NextResponse.json({
    success: true,
    auditId: audit.id,
    oldHours: tutor.volunteerHours,
    newHours: parsed,
  });
}

// GET /api/admin/hours?tutorId=xxx - Get audit log for a tutor
export async function GET(req: NextRequest) {
  const admin = await assertAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const tutorId = req.nextUrl.searchParams.get("tutorId");
  if (!tutorId) {
    return NextResponse.json({ error: "tutorId query param required." }, { status: 400 });
  }

  const audits = await prisma.volunteerHourAudit.findMany({
    where: { tutorId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ audits });
}
