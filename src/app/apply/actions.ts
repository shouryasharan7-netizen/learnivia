"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendApplicationReceived } from "@/lib/email";
import { validateDocumentFile, uploadReportCardToStorage } from "@/lib/storage";

const GRADE_MAP: Record<string, string> = {
  kindergarten: "Kindergarten",
  "grade-1-2": "Early Elementary (K–Grade 2)",
  "grade-3-5": "Elementary (Grades 3–5)",
  "grade-6-8": "Middle School (Grades 6–8)",
  "grade-9-10": "Early High School (Grades 9–10)",
};

export async function submitApplication(formData: FormData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to submit a volunteer application." };
    }

    const bio = (formData.get("bio") as string || "").trim();
    const timezone = (formData.get("timezone") as string || "").trim();
    const school = (formData.get("school") as string || "").trim() || null;
    const experience = (formData.get("experience") as string || "").trim() || null;
    const subjectsInput = (formData.get("subjects") as string || "").trim();
    const grades = formData.getAll("grades") as string[];

    if (!bio || bio.length < 20) {
      return { success: false, error: "Please write a brief bio (at least 20 characters) describing yourself." };
    }

    if (!subjectsInput) {
      return { success: false, error: "Please list at least one subject you can teach." };
    }

    if (grades.length === 0) {
      return { success: false, error: "Please select at least one grade level you can support." };
    }

    // Report Card & Academic Scores
    const academicScores = (formData.get("academicScores") as string || "").trim() || null;
    const reportCardLink = (formData.get("reportCardLink") as string || "").trim() || null;
    const reportCardFile = formData.get("reportCardFile") as File | null;

    let reportCardUrl: string | null = reportCardLink;
    let reportCardName: string | null = reportCardLink ? "Academic Report Card Document" : null;
    let reportCardStorageKey: string | null = null;
    let reportCardMimeType: string | null = null;

    if (reportCardFile && reportCardFile.size > 0) {
      const validation = validateDocumentFile(reportCardFile);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const mimeType = reportCardFile.type || "application/pdf";
      const buffer = Buffer.from(await reportCardFile.arrayBuffer());
      const uploadRes = await uploadReportCardToStorage({
        buffer,
        fileName: reportCardFile.name,
        mimeType,
        userId: session.user.id,
      });

      if (uploadRes.storageKey) {
        reportCardStorageKey = uploadRes.storageKey;
        reportCardMimeType = mimeType;
        reportCardName = reportCardFile.name;
        reportCardUrl = null;
      } else {
        // Safe fallback if bucket not yet ready
        reportCardUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
        reportCardName = reportCardFile.name;
        reportCardMimeType = mimeType;
      }
    }

    // 1. Update User timezone and ensure role is TUTOR
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        timezone: timezone || undefined,
        role: "TUTOR",
        onboardingCompleted: true,
      },
    });

    // 2. Prepare deduplicated subjects & grades
    const subjectNames = Array.from(new Set(
      subjectsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ));

    const gradeNames = Array.from(new Set(
      grades.map((g) => GRADE_MAP[g] || g)
    ));

    // 3. Upsert Tutor Profile (Status is PENDING awaiting review)
    await prisma.tutorProfile.upsert({
      where: { userId: session.user.id },
      update: {
        bio,
        school,
        experience,
        status: "PENDING",
        ...(academicScores ? { academicScores } : {}),
        reportCardName,
        reportCardUrl,
        reportCardStorageKey,
        reportCardMimeType,
        subjects: {
          set: [],
          connectOrCreate: subjectNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        gradeLevels: {
          set: [],
          connectOrCreate: gradeNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      create: {
        userId: session.user.id,
        bio,
        school,
        experience,
        status: "PENDING",
        academicScores,
        reportCardUrl,
        reportCardName,
        reportCardStorageKey,
        reportCardMimeType,
        subjects: {
          connectOrCreate: subjectNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        gradeLevels: {
          connectOrCreate: gradeNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    if (session.user.email) {
      try {
        await sendApplicationReceived(
          session.user.email,
          session.user.name || "Tutor"
        );
      } catch (err) {
        console.error("Non-blocking email error in submitApplication:", err);
      }
    }

    revalidatePath("/apply");
    revalidatePath("/tutor");
    revalidatePath("/admin/applications");
    revalidatePath("/admin/tutors");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Error in submitApplication:", error);
    return { success: false, error: error.message || "An unexpected error occurred while saving your application." };
  }
}

export async function updateReportCard(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to update your report card." };
    }

    const academicScores = (formData.get("academicScores") as string || "").trim() || null;
    const reportCardLink = (formData.get("reportCardLink") as string || "").trim() || null;
    const reportCardFile = formData.get("reportCardFile") as File | null;

    let reportCardUrl: string | null = reportCardLink;
    let reportCardName: string | null = reportCardLink ? "Academic Report Card Document" : null;
    let reportCardStorageKey: string | null = null;
    let reportCardMimeType: string | null = null;

    if (reportCardFile && reportCardFile.size > 0) {
      const validation = validateDocumentFile(reportCardFile);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const mimeType = reportCardFile.type || "application/pdf";
      const buffer = Buffer.from(await reportCardFile.arrayBuffer());
      const uploadRes = await uploadReportCardToStorage({
        buffer,
        fileName: reportCardFile.name,
        mimeType,
        userId: session.user.id,
      });

      if (uploadRes.storageKey) {
        reportCardStorageKey = uploadRes.storageKey;
        reportCardMimeType = mimeType;
        reportCardName = reportCardFile.name;
        reportCardUrl = null;
      } else {
        reportCardUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
        reportCardName = reportCardFile.name;
        reportCardMimeType = mimeType;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (academicScores !== null && academicScores !== "") {
      updateData.academicScores = academicScores;
    }
    if (reportCardStorageKey) {
      updateData.reportCardStorageKey = reportCardStorageKey;
      updateData.reportCardMimeType = reportCardMimeType;
      updateData.reportCardName = reportCardName;
      updateData.reportCardUrl = null;
    } else if (reportCardUrl) {
      updateData.reportCardUrl = reportCardUrl;
      updateData.reportCardName = reportCardName;
      updateData.reportCardMimeType = reportCardMimeType;
      updateData.reportCardStorageKey = null;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.tutorProfile.update({
        where: { userId: session.user.id },
        data: updateData,
      });
    }

    revalidatePath("/apply");
    revalidatePath("/admin/applications");
    revalidatePath("/admin/tutors");

    return { success: true };
  } catch (error: any) {
    console.error("Error in updateReportCard:", error);
    return { success: false, error: error.message || "Failed to update report card." };
  }
}
