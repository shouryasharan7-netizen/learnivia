"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveTutor(tutorId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "APPROVED" },
  });

  const profile = await prisma.tutorProfile.findUnique({ where: { id: tutorId }});
  if (profile) {
    await prisma.user.update({
      where: { id: profile.userId },
      data: { role: "TUTOR" }
    });
  }

  revalidatePath("/admin");
}

export async function rejectTutor(tutorId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin");
}
