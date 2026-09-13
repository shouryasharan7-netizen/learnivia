"use server";

import { requireAuth } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendBookingCancellation } from "@/lib/email";

export async function cancelBooking(formData: FormData) {
  const user = await requireAuth();

  const bookingId = formData.get("bookingId") as string;
  const cancelReason = (formData.get("cancelReason") as string) || "No reason specified";

  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: true,
      tutor: { include: { user: true } },
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  // User must be the student, the tutor, or an admin
  const isStudent = booking.studentId === user.id;
  const isTutor = booking.tutor.userId === user.id;
  const isAdmin = user.isAdmin;

  if (!isStudent && !isTutor && !isAdmin) {
    throw new Error("You do not have permission to cancel this booking.");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELED",
      cancelReason,
    },
  });

  // Send cancellation emails
  if (booking.student.email) {
    await sendBookingCancellation(booking.student.email, {
      recipientName: booking.student.name || "Student",
      otherPartyName: booking.tutor.user.name || "Tutor",
      subject: booking.subject,
      startTime: booking.startTime.toISOString(),
      reason: cancelReason,
    });
  }

  if (booking.tutor.user.email) {
    await sendBookingCancellation(booking.tutor.user.email, {
      recipientName: booking.tutor.user.name || "Tutor",
      otherPartyName: booking.student.name || "Student",
      subject: booking.subject,
      startTime: booking.startTime.toISOString(),
      reason: cancelReason,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/tutor");
}

export async function completeSession(formData: FormData) {
  const user = await requireAuth();

  const bookingId = formData.get("bookingId") as string;

  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  // Must be the tutor or an admin
  const isTutor = booking.tutor.userId === user.id;
  const isAdmin = user.isAdmin;

  if (!isTutor && !isAdmin) {
    throw new Error("Only the tutor or an admin can mark a session as completed.");
  }

  if (booking.status === "CANCELED") {
    throw new Error("Cannot mark a cancelled session as completed.");
  }

  if (booking.status === "COMPLETED") {
    return; // already completed
  }

  // Integrity check: session cannot be completed before it begins
  if (new Date() < booking.startTime) {
    throw new Error("A session cannot be marked as completed before its scheduled start time.");
  }

  // Transition CONFIRMED → COMPLETED.
  // Volunteer hours are not credited until the student confirms attendance.
  await prisma.booking.updateMany({
    where: { id: bookingId, status: "CONFIRMED" },
    data: { status: "COMPLETED" },
  });

  revalidatePath("/tutor");
  revalidatePath("/dashboard");
  revalidatePath(`/sessions/${bookingId}`);
}

export async function confirmStudentAttendance(bookingId: string, attended: boolean) {
  const user = await requireAuth();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true },
  });

  if (!booking) {
    throw new Error("Session booking not found.");
  }

  const isStudent = booking.studentId === user.id;
  const isAdmin = Boolean(user.role === "ADMIN" || user.isAdmin);

  if (!isStudent && !isAdmin) {
    throw new Error("Only the student who attended this session (or an admin) can confirm attendance.");
  }

  if (booking.hoursCredited) {
    return { success: true, message: "Attendance and volunteer hours already confirmed." };
  }

  if (!attended) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        studentAttended: false,
        studentConfirmedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
    revalidatePath(`/sessions/${bookingId}`);
    return { success: true, message: "Marked as not attended." };
  }

  // Calculate duration in hours (minimum 0.5 hours)
  const durationMs = booking.endTime.getTime() - booking.startTime.getTime();
  const durationHours = Math.max(0.5, Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10);

  // Atomically mark attended and credit volunteer hours to tutor
  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED",
        studentAttended: true,
        studentConfirmedAt: new Date(),
        hoursCredited: true,
      },
    });

    await tx.tutorProfile.update({
      where: { id: booking.tutorId },
      data: {
        volunteerHours: { increment: durationHours },
      },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/tutor");
  revalidatePath("/admin/tutors");
  revalidatePath(`/sessions/${bookingId}`);
  return { success: true, message: "Attendance confirmed and volunteer hours accredited!" };
}

export async function submitReview(formData: FormData) {
  const user = await requireAuth();

  const bookingId = formData.get("bookingId") as string;
  const ratingStr = formData.get("rating") as string;
  const comment = (formData.get("comment") as string) || "";

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Please select a rating between 1 and 5 stars.");
  }

  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.studentId !== user.id) {
    throw new Error("You can only review sessions you attended.");
  }

  // Check if already reviewed
  const existingReview = await prisma.review.findFirst({
    where: { bookingId },
  });

  if (existingReview) {
    await prisma.review.update({
      where: { id: existingReview.id },
      data: { rating, comment },
    });
  } else {
    await prisma.review.create({
      data: {
        bookingId,
        tutorId: booking.tutorId,
        studentId: user.id,
        rating,
        comment,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/tutor/${booking.tutorId}`);
}
