"use server";

import { requireAuth } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createZoomMeeting } from "@/lib/zoom";
import { sendBookingConfirmation } from "@/lib/email";
import { getMeetingUrls } from "@/lib/meetingUrl";

export async function bookSession(formData: FormData) {
  const user = await requireAuth();

  const tutorId = formData.get("tutorId") as string;
  const slotId = formData.get("slotId") as string;
  const subject = (formData.get("subject") as string) || "General Tutoring";
  const topic = (formData.get("topic") as string) || "Homework Help";
  const grade = (formData.get("grade") as string) || "All Levels";
  const helpNeeded = (formData.get("helpNeeded") as string) || null;

  if (!tutorId || !slotId) {
    throw new Error("Missing required booking fields.");
  }

  // Find slot
  const slot = await prisma.availability.findUnique({
    where: { id: slotId },
  });

  if (!slot) {
    throw new Error("Time slot not found");
  }

  // 1. Fetch & validate tutor profile
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: { user: true },
  });

  if (!tutorProfile || tutorProfile.status !== "APPROVED") {
    throw new Error("This tutor is not currently accepting bookings.");
  }

  // 2. Prevent self-booking (tutors cannot book themselves)
  if (tutorProfile.userId === user.id) {
    throw new Error("You cannot book a tutoring session with yourself.");
  }

  // 3. Slot verification: slot must belong to this tutor
  if (slot.tutorId !== tutorId) {
    throw new Error("Invalid slot selection for this tutor.");
  }

  // Calculate the target booking date based on day of week
  const today = new Date();
  const currentDay = today.getDay();
  const targetDay = slot.dayOfWeek;
  const daysUntil = (targetDay + 7 - currentDay) % 7;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntil);

  // Set start time
  const [hours, minutes] = slot.startTime.split(":").map(Number);
  targetDate.setHours(hours, minutes, 0, 0);

  // If slot is today but is in the past or within the next 30 mins, push to next week!
  if (targetDate.getTime() <= today.getTime() + 30 * 60 * 1000) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  // Calculate end time
  const endDate = new Date(targetDate);
  const [endHours, endMinutes] = slot.endTime.split(":").map(Number);
  endDate.setHours(endHours, endMinutes, 0, 0);

  // 4. Overlap conflict protection: verify no overlapping bookings for tutor
  const tutorConflict = await prisma.booking.findFirst({
    where: {
      tutorId,
      status: "CONFIRMED",
      startTime: { lt: endDate },
      endTime: { gt: targetDate },
    },
  });

  if (tutorConflict) {
    throw new Error("This time slot is already booked. Please choose another available slot.");
  }

  // 5. Overlap conflict protection: verify student has no overlapping bookings
  const studentConflict = await prisma.booking.findFirst({
    where: {
      studentId: user.id,
      status: "CONFIRMED",
      startTime: { lt: endDate },
      endTime: { gt: targetDate },
    },
  });

  if (studentConflict) {
    throw new Error("You already have another confirmed tutoring session during this time window.");
  }

  const durationMinutes = Math.max(30, Math.round((endDate.getTime() - targetDate.getTime()) / 60000));

  let meetingUrl = "";
  try {
    const zoomMeeting = await createZoomMeeting(
      `Learnivia: ${subject} with ${user.name || "Student"}`,
      targetDate.toISOString(),
      durationMinutes
    );
    meetingUrl = JSON.stringify({
      joinUrl: zoomMeeting.join_url,
      startUrl: zoomMeeting.start_url,
      isCustom: false,
    });
  } catch (err) {
    console.log("Zoom API unavailable or unconfigured, assigning Learnivia session room link:", err);
    // Honest session link rather than a fabricated random Zoom meeting ID and password
    const sessionRoomUrl = `https://learnivia-green.vercel.app/learn?session=lv-${Date.now().toString(36)}`;
    meetingUrl = JSON.stringify({
      joinUrl: sessionRoomUrl,
      startUrl: sessionRoomUrl,
      isCustom: true,
    });
  }

  await prisma.booking.create({
    data: {
      studentId: user.id,
      tutorId,
      subject,
      grade,
      topic,
      helpNeeded,
      startTime: targetDate,
      endTime: endDate,
      status: "CONFIRMED",
      zoomLink: meetingUrl,
    },
  });

  if (user.email && tutorProfile?.user.email) {
    const cleanJoinLink = getMeetingUrls(meetingUrl).joinUrl || "";
    await sendBookingConfirmation(user.email, tutorProfile.user.email, {
      studentName: user.name || "Student",
      tutorName: tutorProfile.user.name || "Tutor",
      subject,
      startTime: targetDate.toISOString(),
      zoomLink: cleanJoinLink,
    });
  }

  // Redirect to student dashboard
  redirect("/dashboard");
}
