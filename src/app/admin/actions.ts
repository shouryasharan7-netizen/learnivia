"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-user";
import { sendApplicationApproved } from "@/lib/email";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";

import { validateDocumentFile, uploadReportCardToStorage } from "@/lib/storage";

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
      where: { id: profile.userId },
      data: { role: "TUTOR" }
    });
  }

  if (profile.user.email) {
    try {
      await sendApplicationApproved(profile.user.email, profile.user.name || "Tutor");
    } catch (err) {
      console.error("Non-blocking email error in approveApplication:", err);
    }
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
  revalidatePath("/admin");
}

export async function suspendTutor(tutorId: string) {
  await requireAdmin();

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    select: { userId: true },
  });

  if (!tutor) throw new Error("Tutor profile not found");

  const now = new Date();

  // 1. Mark profile suspended
  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "SUSPENDED" },
  });

  // 2. Mark user account suspended
  await prisma.user.update({
    where: { id: tutor.userId },
    data: {
      accountSuspended: true,
      suspendedReason: "Tutor account suspended by administrator review.",
    },
  });

  // 3. Cancel upcoming confirmed bookings
  await prisma.booking.updateMany({
    where: {
      tutorId: tutorId,
      startTime: { gte: now },
      status: "CONFIRMED",
    },
    data: {
      status: "CANCELED",
      cancelReason: "Tutor account inactive.",
      checkUpNote: "Session automatically canceled: tutor is currently unavailable.",
    },
  });

  // 4. Cancel upcoming workshops
  await prisma.workshop.updateMany({
    where: {
      tutorId: tutorId,
      startTime: { gte: now },
      status: "UPCOMING",
    },
    data: {
      status: "CANCELED",
      checkUpNote: "Workshop automatically canceled: host is currently unavailable.",
    },
  });

  revalidatePath("/admin/tutors");
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
}

export async function reactivateTutor(tutorId: string) {
  await requireAdmin();

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    select: { userId: true },
  });

  if (!tutor) throw new Error("Tutor profile not found");

  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { status: "APPROVED" },
  });

  await prisma.user.update({
    where: { id: tutor.userId },
    data: {
      accountSuspended: false,
      suspendedReason: null,
    },
  });

  revalidatePath("/admin/tutors");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");
}

export async function adminUpdateReportCard(tutorId: string, formData: FormData) {
  await requireAdmin();

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    select: { userId: true },
  });
  if (!tutor) throw new Error("Tutor not found");

  const academicScores = ((formData.get("academicScores") as string) || "").trim() || null;
  const reportCardLink = ((formData.get("reportCardLink") as string) || "").trim() || null;
  const reportCardFile = formData.get("reportCardFile") as File | null;

  let reportCardUrl: string | null = reportCardLink;
  let reportCardName: string | null = reportCardLink ? "Academic Report Card Document" : null;
  let reportCardStorageKey: string | null = null;
  let reportCardMimeType: string | null = null;

  if (reportCardFile && reportCardFile.size > 0) {
    const validation = validateDocumentFile(reportCardFile);
    if (!validation.valid) {
      throw new Error(validation.error || "Invalid file");
    }
    const mimeType = reportCardFile.type || "application/pdf";
    const buffer = Buffer.from(await reportCardFile.arrayBuffer());
    const uploadRes = await uploadReportCardToStorage({
      buffer,
      fileName: reportCardFile.name,
      mimeType,
      userId: tutor.userId,
    });

    if (uploadRes.storageKey) {
      reportCardStorageKey = uploadRes.storageKey;
      reportCardMimeType = mimeType;
      reportCardName = reportCardFile.name;
      reportCardUrl = null;
    } else {
      reportCardUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
      reportCardName = reportCardFile.name;
      reportCardMimeType = mimeType;
    }
  }

  const updateData: Record<string, unknown> = {};
  if (academicScores !== null && academicScores !== "") {
    updateData.academicScores = academicScores;
  }
  if (reportCardStorageKey) {
    updateData.reportCardStorageKey = reportCardStorageKey;
    updateData.reportCardMimeType = reportCardMimeType;
    updateData.reportCardName = reportCardName;
    updateData.reportCardUrl = null;
  } else if (reportCardUrl) {
    updateData.reportCardUrl = reportCardUrl;
    updateData.reportCardName = reportCardName;
    updateData.reportCardMimeType = reportCardMimeType;
    updateData.reportCardStorageKey = null;
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.tutorProfile.update({
      where: { id: tutorId },
      data: updateData,
    });
  }

  revalidatePath("/admin/applications");
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

  // P1-9: Transactional integrity for session completion and hours logging
  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    if (newStatus === "COMPLETED" && booking.status !== "COMPLETED") {
      const durationHours = Math.max(
        0.5,
        (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60)
      );
      await tx.tutorProfile.update({
        where: { id: booking.tutorId },
        data: { volunteerHours: { increment: durationHours } },
      });
    }
  });

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
