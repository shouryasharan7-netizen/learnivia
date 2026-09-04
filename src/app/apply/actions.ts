"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendApplicationReceived } from "@/lib/email";

export async function submitApplication(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to apply.");
  }

  const bio = formData.get("bio") as string;
  const timezone = formData.get("timezone") as string;
  const school = (formData.get("school") as string) || null;
  const experience = (formData.get("experience") as string) || null;
  const subjectsInput = (formData.get("subjects") as string) || "";
  const grades = formData.getAll("grades") as string[];

  // Report Card & Academic Scores
  const academicScores = ((formData.get("academicScores") as string) || "").trim() || null;
  const reportCardLink = ((formData.get("reportCardLink") as string) || "").trim() || null;
  const reportCardFile = formData.get("reportCardFile") as File | null;

  let reportCardUrl: string | null = reportCardLink;
  let reportCardName: string | null = reportCardLink ? "Academic Report Card Document" : null;

  if (reportCardFile && reportCardFile.size > 0) {
    const buffer = Buffer.from(await reportCardFile.arrayBuffer());
    reportCardUrl = `data:${reportCardFile.type || "application/pdf"};base64,${buffer.toString("base64")}`;
    reportCardName = reportCardFile.name;
  }

  // 1. Update User timezone
  if (timezone) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { timezone },
    });
  }

  // 2. Prepare subjects & grades
  const GRADE_LABELS: Record<string, string> = {
    primary: "Primary (Years 1–6)",
    "lower-secondary": "Lower Secondary (Years 7–9)",
    gcse: "GCSE / O-Level",
    alevel: "A-Level / AP",
    university: "University (intro courses)",
  };

  const subjectNames = subjectsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const gradeNames = grades.map((g) => GRADE_LABELS[g] || g);

  // 3. Create or update Tutor Profile (Status defaults to PENDING)
  await prisma.tutorProfile.upsert({
    where: { userId: session.user.id },
    update: {
      bio,
      school,
      experience,
      status: "PENDING",
      ...(academicScores ? { academicScores } : {}),
      ...(reportCardUrl ? { reportCardUrl, reportCardName } : {}),
      subjects: {
        set: [], // reset existing and reconnect
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
    await sendApplicationReceived(
      session.user.email,
      session.user.name || "Tutor"
    );
  }

  revalidatePath("/apply");
  revalidatePath("/admin/applications");
  revalidatePath("/admin/tutors");
  revalidatePath("/dashboard");

  redirect("/dashboard");
}

export async function updateReportCard(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update your report card.");
  }

  const academicScores = ((formData.get("academicScores") as string) || "").trim() || null;
  const reportCardLink = ((formData.get("reportCardLink") as string) || "").trim() || null;
  const reportCardFile = formData.get("reportCardFile") as File | null;

  let reportCardUrl: string | null = reportCardLink;
  let reportCardName: string | null = reportCardLink ? "Academic Report Card Document" : null;

  if (reportCardFile && reportCardFile.size > 0) {
    const buffer = Buffer.from(await reportCardFile.arrayBuffer());
    reportCardUrl = `data:${reportCardFile.type || "application/pdf"};base64,${buffer.toString("base64")}`;
    reportCardName = reportCardFile.name;
  }

  const updateData: Record<string, unknown> = {};
  if (academicScores !== null && academicScores !== "") {
    updateData.academicScores = academicScores;
  }
  if (reportCardUrl) {
    updateData.reportCardUrl = reportCardUrl;
    updateData.reportCardName = reportCardName;
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
  revalidatePath("/dashboard");
}
