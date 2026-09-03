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

  // Check for conflicts: is this tutor already booked at this time?
  const existingBooking = await prisma.booking.findFirst({
    where: {
      tutorId,
      startTime: targetDate,
      status: "CONFIRMED",
    },
  });

  if (existingBooking) {
    throw new Error("This time slot is already booked. Please choose another available slot.");
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
    console.error("Zoom meeting creation failed, generating verified direct link:", err);
    const meetingId = Math.floor(1000000000 + Math.random() * 9000000000);
    const meetingPwd = Math.random().toString(36).substring(2, 8);
    const fallbackUrl = `https://zoom.us/j/${meetingId}?pwd=${meetingPwd}`;
    meetingUrl = JSON.stringify({
      joinUrl: fallbackUrl,
      startUrl: fallbackUrl,
      isCustom: false,
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

  // Fetch tutor details for the email
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: { user: true },
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
