"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-user";
import { sendApplicationApproved } from "@/lib/email";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";

export async function approveApplication(tutorId: string) {
  await requireAdmin();

  const profile = await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "APPROVED" },
    include: { user: true }
  });

  // Update user role to TUTOR if they were a STUDENT
  if (profile.user.role === "STUDENT") {
    await prisma.user.update({
      where: { id: profile.user.id },
      data: { role: "TUTOR" }
    });
  }

  if (profile.user.email) {
    await sendApplicationApproved(profile.user.email, profile.user.name || "Tutor");
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin/tutors");
  revalidatePath("/admin");
}

export async function rejectApplication(tutorId: string) {
  await requireAdmin();

  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/tutors");
  revalidatePath("/admin");
}

export async function suspendTutor(tutorId: string) {
  await requireAdmin();

  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/tutors");
  revalidatePath("/admin");
}

export async function reactivateTutor(tutorId: string) {
  await requireAdmin();

  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin/tutors");
  revalidatePath("/admin");
}

/**
 * Updates any user's system role (STUDENT, TUTOR, ADMIN).
 * If promoted to TUTOR, ensures approved TutorProfile exists.
 */
export async function updateUserRole(userId: string, newRole: Role) {
  const admin = await requireAdmin();

  if (userId === admin.id && newRole !== "ADMIN") {
    throw new Error("You cannot revoke your own administrator role.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  if (newRole === "TUTOR") {
    const existing = await prisma.tutorProfile.findUnique({ where: { userId } });
    if (!existing) {
      await prisma.tutorProfile.create({
        data: {
          userId,
          status: "APPROVED",
          bio: "Verified Volunteer Tutor",
          school: "Learnivia Volunteer Faculty",
          volunteerHours: 0,
        },
      });
    } else {
      await prisma.tutorProfile.update({
        where: { userId },
        data: { status: "APPROVED" },
      });
    }
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/tutors");
  revalidatePath("/admin");
}

/**
 * Deletes a user account and associated records permanently.
 */
export async function deleteUserAccount(userId: string) {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    throw new Error("You cannot delete your own active administrator account.");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/tutors");
  revalidatePath("/admin");
}

/**
 * Admin action to update booking status (CONFIRMED, COMPLETED, CANCELLED).
 * Automatically calculates volunteer hours on COMPLETED status.
 */
export async function adminUpdateBookingStatus(
  bookingId: string,
  newStatus: "CONFIRMED" | "COMPLETED" | "CANCELED"
) {
  await requireAdmin();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true },
  });

  if (!booking) throw new Error("Booking not found");

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  });

  if (newStatus === "COMPLETED" && booking.status !== "COMPLETED") {
    const durationHours = Math.max(
      0.5,
      (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60)
    );
    await prisma.tutorProfile.update({
      where: { id: booking.tutorId },
      data: { volunteerHours: { increment: durationHours } },
    });
  }

  revalidatePath("/admin/sessions");
  revalidatePath("/admin");
}

/**
 * Admin action to cancel or delete a workshop.
 */
export async function adminCancelWorkshop(workshopId: string) {
  await requireAdmin();

  await prisma.workshop.delete({
    where: { id: workshopId },
  });

  revalidatePath("/admin/sessions");
  revalidatePath("/admin");
  revalidatePath("/sessions");
}

/**
 * Admin action to delete any community message across all channels.
 */
export async function adminDeleteCommunityMessage(messageId: string) {
  await requireAdmin();

  await prisma.communityMessage.delete({
    where: { id: messageId },
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
  revalidatePath("/community");
}

/**
 * Admin action to delete any homework help request.
 */
export async function adminDeleteHomeworkRequest(requestId: string) {
  await requireAdmin();

  await prisma.homeworkRequest.delete({
    where: { id: requestId },
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
  revalidatePath("/homework-help");
}

/**
 * Admin action to broadcast an official announcement across the platform.
 */
export async function adminBroadcastAnnouncement(content: string) {
  const admin = await requireAdmin();

  if (!content || !content.trim()) {
    throw new Error("Announcement content cannot be empty.");
  }

  const authorName = admin.name || "Learnivia Administration";
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  await prisma.communityMessage.create({
    data: {
      channel: "Announcements",
      authorId: admin.id,
      authorName,
      authorEmail: admin.email || "",
      authorRole: "COMMUNITY LEAD",
      authorInitials: initials,
      authorColor: "#0E8345",
      content: content.trim(),
      reactions: { heart: 1, clap: 1, bulb: 1, fire: 1 },
    },
  });

  revalidatePath("/community");
  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
}
