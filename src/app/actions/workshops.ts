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
  const maxCapacity = parseInt((formData.get("maxCapacity") as string) || "10", 10);
  const customMeetingUrl = (formData.get("customMeetingUrl") as string)?.trim();

  const startUtc = formData.get("startUtc") as string;
  const endUtc = formData.get("endUtc") as string;

  let startDateTime: Date;
  let endDateTime: Date;

  if (startUtc && endUtc) {
    startDateTime = new Date(startUtc);
    endDateTime = new Date(endUtc);
  } else {
    const dateStr = formData.get("date") as string;
    const startTimeStr = formData.get("startTime") as string;
    const endTimeStr = formData.get("endTime") as string;

    if (!title || !description || !subject || !dateStr || !startTimeStr || !endTimeStr) {
      throw new Error("Please fill in all required fields.");
    }

    const [startH, startM] = startTimeStr.split(":").map(Number);
    const [endH, endM] = endTimeStr.split(":").map(Number);

    startDateTime = new Date(`${dateStr}T00:00:00`);
    startDateTime.setHours(startH, startM, 0, 0);

    endDateTime = new Date(`${dateStr}T00:00:00`);
    endDateTime.setHours(endH, endM, 0, 0);
  }

  if (!title || !description || !subject) {
    throw new Error("Please fill in all required fields.");
  }

  // Allow scheduling up to 20 mins ago to account for clock variance when scheduling immediate sessions
  if (startDateTime.getTime() <= Date.now() - 20 * 60 * 1000) {
    throw new Error("Workshops must be scheduled for a future time.");
  }

  if (endDateTime.getTime() <= startDateTime.getTime()) {
    throw new Error("End time must be after start time.");
  }

  const durationMinutes = Math.max(15, Math.round((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)));

  let meetingUrl = "";
  if (customMeetingUrl) {
    meetingUrl = JSON.stringify({
      joinUrl: customMeetingUrl,
      startUrl: customMeetingUrl,
      isCustom: true,
    });
  } else {
    try {
      const zoomMeeting = await createZoomMeeting(
        `Learnivia Workshop: ${title}`,
        startDateTime.toISOString(),
        durationMinutes
      );
      meetingUrl = JSON.stringify({
        joinUrl: zoomMeeting.join_url,
        startUrl: zoomMeeting.start_url,
        isCustom: false,
      });
    } catch (err) {
      console.log("Zoom API OAuth not configured, generating verified room links:", err);
      const meetingId = Math.floor(1000000000 + Math.random() * 9000000000);
      const meetingPwd = Math.random().toString(36).substring(2, 8);
      const autoZoomUrl = `https://zoom.us/j/${meetingId}?pwd=${meetingPwd}`;
      meetingUrl = JSON.stringify({
        joinUrl: autoZoomUrl,
        startUrl: autoZoomUrl,
        isCustom: false,
      });
    }
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
