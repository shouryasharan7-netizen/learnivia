import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { getReportCardSignedUrl } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tutorId: string }> },
) {
  try {
    // 1. Strict admin authentication gate
    await requireAdmin();

    const { tutorId } = await params;
    if (!tutorId) {
      return NextResponse.json({ error: "Missing tutor ID" }, { status: 400 });
    }

    // 2. Fetch tutor profile document fields
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      select: {
        id: true,
        reportCardStorageKey: true,
        reportCardMimeType: true,
        reportCardUrl: true,
        reportCardName: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor profile not found" },
        { status: 404 },
      );
    }

    // 3. If stored in private object storage, redirect to signed URL
    if (tutor.reportCardStorageKey) {
      const { signedUrl, error } = await getReportCardSignedUrl(
        tutor.reportCardStorageKey,
        3600, // 1 hour validity
      );

      if (signedUrl) {
        return NextResponse.redirect(signedUrl);
      }
      console.warn("Could not generate signed URL for storage key:", error);
    }

    // 4. If an external URL was saved (e.g. Google Drive link)
    if (
      tutor.reportCardUrl?.startsWith("http://") ||
      tutor.reportCardUrl?.startsWith("https://")
    ) {
      return NextResponse.redirect(tutor.reportCardUrl);
    }

    // 5. If legacy base64 data URI was stored, decode and stream securely
    if (tutor.reportCardUrl?.startsWith("data:")) {
      const match = tutor.reportCardUrl.match(/^data:([^;]+);base64,(.*)$/);
      if (match) {
        const contentType =
          match[1] || tutor.reportCardMimeType || "application/pdf";
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");

        const filename = (tutor.reportCardName || "report-card").replace(
          /[^a-zA-Z0-9._-]/g,
          "_",
        );

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${filename}"`,
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
          },
        });
      }
    }

    return NextResponse.json(
      { error: "No report card document available for this tutor." },
      { status: 404 },
    );
  } catch (err: any) {
    console.error("Error in admin report card proxy:", err);
    if (
      err.message?.includes("Forbidden") ||
      err.message?.includes("Unauthorized")
    ) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
