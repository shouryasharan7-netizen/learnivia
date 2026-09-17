"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addAvailability(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  let userId = session.user.id;
  if (!userId && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (dbUser) userId = dbUser.id;
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify tutor profile
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId }
  });

  if (!tutor || (tutor.status !== "APPROVED" && tutor.status !== "SUSPENDED")) {
    throw new Error("Only approved or active tutors can add availability.");
  }

  const dayOfWeek = parseInt(formData.get("dayOfWeek") as string);
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  await prisma.availability.create({
    data: {
      tutorId: tutor.id,
      dayOfWeek,
      startTime,
      endTime,
      timezone: session.user.timezone || "UTC"
    }
  });

  // Automatically reactivate suspended tutor profile once they set their available time
  if (tutor.status === "SUSPENDED") {
    await prisma.tutorProfile.update({
      where: { id: tutor.id },
      data: { status: "APPROVED" },
    });
  }

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/find");
  revalidatePath("/tutor");
}

export async function removeAvailability(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  let userId = session.user.id;
  if (!userId && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (dbUser) userId = dbUser.id;
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId }
  });

  if (!tutor) {
    throw new Error("Only tutors can remove availability.");
  }

  // Ensure this availability belongs to this tutor
  const availability = await prisma.availability.findUnique({
    where: { id }
  });

  if (availability?.tutorId === tutor.id) {
    await prisma.availability.delete({
      where: { id }
    });
  }

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/find");
  revalidatePath("/tutor");
}
