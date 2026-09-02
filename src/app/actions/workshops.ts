"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createZoomMeeting } from "@/lib/zoom";

export async function createWorkshop(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be logged in to host a workshop.");
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
    throw new Error("You must be logged in to host a workshop.");
  }

  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutor || tutor.status !== "APPROVED") {
    throw new Error("Only approved tutors can host group workshops.");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const subject = formData.get("subject") as string;
  const grade = formData.get("grade") as string || "All Levels";
  const dateStr = formData.get("date") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;
  const maxCapacity = parseInt((formData.get("maxCapacity") as string) || "10", 10);

  if (!title || !description || !subject || !dateStr || !startTimeStr || !endTimeStr) {
    throw new Error("Please fill in all required fields.");
  }

  const [startH, startM] = startTimeStr.split(":").map(Number);
  const [endH, endM] = endTimeStr.split(":").map(Number);

  const startDateTime = new Date(`${dateStr}T00:00:00`);
  startDateTime.setHours(startH, startM, 0, 0);

  const endDateTime = new Date(`${dateStr}T00:00:00`);
  endDateTime.setHours(endH, endM, 0, 0);

  if (startDateTime.getTime() <= Date.now()) {
    throw new Error("Workshops must be scheduled for a future time.");
  }

  if (endDateTime.getTime() <= startDateTime.getTime()) {
    throw new Error("End time must be after start time.");
  }

  const durationMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);

  let meetingUrl = "";
  try {
    const zoomMeeting = await createZoomMeeting(
      `Learnivia Workshop: ${title}`,
      startDateTime.toISOString(),
      durationMinutes
    );
    meetingUrl = zoomMeeting.join_url;
  } catch (err) {
    console.error("Zoom meeting creation failed, falling back to mock link:", err);
    meetingUrl = `https://zoom.us/j/${Math.floor(Math.random() * 10000000000)}`;
  }

  await prisma.workshop.create({
    data: {
      tutorId: tutor.id,
      title,
      description,
      subject,
      grade,
      startTime: startDateTime,
      endTime: endDateTime,
      maxCapacity,
      zoomLink: meetingUrl,
      status: "UPCOMING",
    },
  });

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
  revalidatePath("/learn");
  revalidatePath("/");
}

export async function enrollInWorkshop(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to enroll in a workshop.");
  }

  const workshopId = formData.get("workshopId") as string;
  if (!workshopId) {
    throw new Error("Workshop ID is required.");
  }

  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
    include: { enrollments: true },
  });

  if (!workshop) {
    throw new Error("Workshop not found.");
  }

  if (workshop.status !== "UPCOMING") {
    throw new Error("This workshop is no longer accepting registrations.");
  }

  if (workshop.enrollments.length >= workshop.maxCapacity) {
    throw new Error("This workshop has reached maximum student capacity.");
  }

  // Check if already enrolled
  const existingEnrollment = workshop.enrollments.find(
    (e) => e.studentId === session.user.id
  );

  if (existingEnrollment) {
    throw new Error("You are already enrolled in this workshop.");
  }

  await prisma.workshopEnrollment.create({
    data: {
      workshopId,
      studentId: session.user.id,
    },
  });

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
  revalidatePath("/learn");
}

export async function cancelWorkshopEnrollment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to cancel enrollment.");
  }

  const workshopId = formData.get("workshopId") as string;
  if (!workshopId) {
    throw new Error("Workshop ID is required.");
  }

  await prisma.workshopEnrollment.deleteMany({
    where: {
      workshopId,
      studentId: session.user.id,
    },
  });

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
  revalidatePath("/learn");
}

export async function completeWorkshop(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const workshopId = formData.get("workshopId") as string;

  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
    include: { tutor: true },
  });

  if (!workshop) {
    throw new Error("Workshop not found.");
  }

  const isTutor = workshop.tutor.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isTutor && !isAdmin) {
    throw new Error("Only the host tutor or admin can complete a workshop.");
  }

  const durationMs = workshop.endTime.getTime() - workshop.startTime.getTime();
  const durationHours = Math.max(0.5, Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10);

  await prisma.$transaction([
    prisma.workshop.update({
      where: { id: workshopId },
      data: { status: "COMPLETED" },
    }),
    prisma.tutorProfile.update({
      where: { id: workshop.tutorId },
      data: {
        volunteerHours: { increment: durationHours },
      },
    }),
  ]);

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
  revalidatePath("/learn");
}
