"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ReportStatus } from "@prisma/client";

export async function submitIncidentReport(formData: FormData) {
  const session = await auth();

  const category = (formData.get("category") as string) || "Safety Concern";
  const description = formData.get("description") as string;
  const bookingId = (formData.get("bookingId") as string) || null;
  const reportedUserId = (formData.get("reportedUserId") as string) || null;

  if (!description || description.trim().length < 10) {
    throw new Error("Please provide a detailed description of the incident (at least 10 characters).");
  }

  await prisma.incidentReport.create({
    data: {
      reporterId: session?.user?.id || null,
      reportedUserId,
      bookingId,
      category,
      description: description.trim(),
      status: "PENDING",
    },
  });

  revalidatePath("/admin/reports");
  redirect("/safety?reported=true");
}

export async function updateReportStatus(formData: FormData) {
  const session = await auth();
  // @ts-ignore
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access required.");
  }

  const reportId = formData.get("reportId") as string;
  const status = formData.get("status") as ReportStatus;
  const adminNotes = (formData.get("adminNotes") as string) || "";
  const suspendTutorId = (formData.get("suspendTutorId") as string) || null;

  if (!reportId || !status) {
    throw new Error("Missing required fields.");
  }

  await prisma.incidentReport.update({
    where: { id: reportId },
    data: {
      status,
      adminNotes,
    },
  });

  // If admin chose to suspend tutor
  if (suspendTutorId) {
    await prisma.tutorProfile.update({
      where: { id: suspendTutorId },
      data: { status: "REJECTED" },
    });
  }

  revalidatePath("/admin/reports");
  revalidatePath("/admin/tutors");
}
