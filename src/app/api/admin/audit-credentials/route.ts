import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-user";
import { auditTutorCredentials } from "@/lib/ai-credential-verifier";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await request.json();
    const { tutorId } = body;

    if (!tutorId || typeof tutorId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing tutorId" },
        { status: 400 },
      );
    }

    const auditResult = await auditTutorCredentials(tutorId);

    return NextResponse.json({
      success: true,
      audit: auditResult,
      auditedBy: admin.name || "Administrator",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("AI Credential Audit Error:", err);
    return NextResponse.json(
      {
        error: err?.message || "Failed to audit tutor credentials",
      },
      { status: 500 },
    );
  }
}
