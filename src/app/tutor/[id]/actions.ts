"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function bookSession(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be logged in to book a session.");
  }

  const tutorId = formData.get("tutorId") as string;
  const slotId = formData.get("slotId") as string;

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

  // Calculate end time
  const endDate = new Date(targetDate);
  const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
  endDate.setHours(endHours, endMinutes, 0, 0);

  // In a real app, we would call Zoom API here to generate a meeting link.
  // For MVP without API keys, we generate a mock Zoom link.
  const meetingUrl = `https://zoom.us/j/${Math.floor(Math.random() * 10000000000)}`;

  await prisma.booking.create({
    data: {
      studentId: session.user.id,
      tutorId,
      subject: "General Tutoring", // Hardcoded for MVP since form doesn't capture it yet
      grade: "High School",
      topic: "Homework Help",
      startTime: targetDate,
      endTime: endDate,
      status: "CONFIRMED",
      zoomLink: meetingUrl,
    }
  });

  // Redirect to success page or student dashboard
  redirect("/dashboard");
}
