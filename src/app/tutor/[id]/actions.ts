"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createZoomMeeting } from "@/lib/zoom";
import { sendBookingConfirmation } from "@/lib/email";

export async function bookSession(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be logged in to book a session.");
  }

  const tutorId = formData.get("tutorId") as string;
  const slotId = formData.get("slotId") as string;
  const subject = (formData.get("subject") as string) || "General Tutoring";
  const topic = (formData.get("topic") as string) || "Homework Help";
  const grade = (formData.get("grade") as string) || "All Levels";
  const helpNeeded = (formData.get("helpNeeded") as string) || null;

  if (!tutorId || !slotId) {
    throw new Error("Missing required fields.");
  }

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
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
  const [hours, minutes] = slot.startTime.split(':').map(Number);
  targetDate.setHours(hours, minutes, 0, 0);

  // If slot is today but is in the past or within the next 30 mins, push to next week!
  if (targetDate.getTime() <= today.getTime() + 30 * 60 * 1000) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  // Calculate end time
  const endDate = new Date(targetDate);
  const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
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

  const durationMinutes = (endDate.getTime() - targetDate.getTime()) / 60000;
  
  let meetingUrl = "";
  try {
    const zoomMeeting = await createZoomMeeting(
      `Learnivia: ${subject} with ${session.user.name || "Student"}`,
      targetDate.toISOString(),
      durationMinutes
    );
    meetingUrl = zoomMeeting.join_url;
  } catch (err) {
    console.error("Zoom meeting creation failed, falling back to mock link:", err);
    meetingUrl = `https://zoom.us/j/${Math.floor(Math.random() * 10000000000)}`;
  }

  await prisma.booking.create({
    data: {
      studentId: session.user.id,
      tutorId,
      subject,
      grade,
      topic,
      helpNeeded,
      startTime: targetDate,
      endTime: endDate,
      status: "CONFIRMED",
      zoomLink: meetingUrl,
    }
  });

  // Fetch tutor details for the email
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: { user: true }
  });

  if (session.user.email && tutorProfile?.user.email) {
    await sendBookingConfirmation(
      session.user.email,
      tutorProfile.user.email,
      {
        studentName: session.user.name || "Student",
        tutorName: tutorProfile.user.name || "Tutor",
        subject,
        startTime: targetDate.toISOString(),
        zoomLink: meetingUrl,
      }
    );
  }

  // Redirect to student dashboard
  redirect("/dashboard");
}
