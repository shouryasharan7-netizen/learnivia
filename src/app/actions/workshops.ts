"use server";

import { requireAuth, requireTutor } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createZoomMeeting } from "@/lib/zoom";
import { validateMeetingUrl } from "@/lib/meetingUrl";

export async function createWorkshop(formData: FormData) {
  const { tutor } = await requireTutor();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const grade = ((formData.get("grade") as string) || "All Levels").trim();
  const maxCapacity = Math.max(1, parseInt((formData.get("maxCapacity") as string) || "10", 10));
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
    // P1-10: Validate meeting URL is from an approved domain before storing
    const urlCheck = validateMeetingUrl(customMeetingUrl);
    if (!urlCheck.valid) {
      throw new Error(urlCheck.reason ?? "Invalid meeting URL.");
    }
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
      console.error("Zoom API unavailable during workshop creation:", err);
      // Do NOT generate a fake Zoom URL — a fabricated zoom.us/j/RANDOMID
      // would give students a non-functional link.
      // Leave meetingUrl empty; admin can add the link after Zoom is configured.
      meetingUrl = "";
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
  const user = await requireAuth();

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
    (e) => e.studentId === user.id
  );

  if (existingEnrollment) {
    throw new Error("You are already enrolled in this workshop.");
  }

  await prisma.workshopEnrollment.create({
    data: {
      workshopId,
      studentId: user.id,
    },
  });

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
  revalidatePath("/learn");
}

export async function cancelWorkshopEnrollment(formData: FormData) {
  const user = await requireAuth();

  const workshopId = formData.get("workshopId") as string;
  if (!workshopId) {
    throw new Error("Workshop ID is required.");
  }

  await prisma.workshopEnrollment.deleteMany({
    where: {
      workshopId,
      studentId: user.id,
    },
  });

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
  revalidatePath("/learn");
}

export async function completeWorkshop(formData: FormData) {
  const user = await requireAuth();

  const workshopId = formData.get("workshopId") as string;

  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
    include: { tutor: true },
  });

  if (!workshop) {
    throw new Error("Workshop not found.");
  }

  const isHostTutor = workshop.tutor.userId === user.id;
  const isAdmin = user.isAdmin;

  if (!isHostTutor && !isAdmin) {
    throw new Error("Only the host tutor or admin can complete a workshop.");
  }

  if (workshop.status === "COMPLETED") {
    return; // already completed
  }

  if (new Date() < workshop.startTime) {
    throw new Error("A workshop cannot be marked completed before its scheduled start time.");
  }

  const durationMs = workshop.endTime.getTime() - workshop.startTime.getTime();
  const durationHours = Math.max(0.5, Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10);

  // Atomically transition from UPCOMING -> COMPLETED to prevent duplicate volunteer hour credits
  const updateResult = await prisma.workshop.updateMany({
    where: { id: workshopId, status: "UPCOMING" },
    data: { status: "COMPLETED" },
  });

  if (updateResult.count > 0) {
    await prisma.tutorProfile.update({
      where: { id: workshop.tutorId },
      data: {
        volunteerHours: { increment: durationHours },
      },
    });
  }

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
  revalidatePath("/learn");
}
