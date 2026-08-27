"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendApplicationApproved } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function approveApplication(tutorId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "APPROVED" },
    include: { user: true }
  });

  // Update user role to TUTOR if they were a STUDENT
  if (profile.user.role === "STUDENT") {
    await prisma.user.update({
      where: { id: profile.user.id },
      data: { role: "TUTOR" }
    });
  }

  if (profile.user.email) {
    await sendApplicationApproved(profile.user.email, profile.user.name || "Tutor");
  }

  revalidatePath("/admin/applications");
}

export async function rejectApplication(tutorId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/applications");
}
