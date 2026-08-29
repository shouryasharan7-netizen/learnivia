"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { sendApplicationReceived } from "@/lib/email";

export async function submitApplication(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to apply.");
  }

  const bio = formData.get("bio") as string;
  const timezone = formData.get("timezone") as string;
  const school = formData.get("school") as string || null;
  const experience = formData.get("experience") as string || null;
  const subjectsInput = formData.get("subjects") as string || "";
  const grades = formData.getAll("grades") as string[];

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

  // Redirect to success page or dashboard
  redirect("/dashboard");
}
