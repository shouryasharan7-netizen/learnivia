"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SessionChatMessage {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  createdAt: string;
  isCurrentUser: boolean;
}

export async function getSessionChatMessages(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized", messages: [] };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true },
  });

  if (!booking) {
    return { success: false, error: "Session not found", messages: [] };
  }

  const isStudent = booking.studentId === session.user.id;
  const isTutor = booking.tutor.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isStudent && !isTutor && !isAdmin) {
    return { success: false, error: "Access denied", messages: [] };
  }

  const channel = `session-${bookingId}`;
  const messages = await prisma.communityMessage.findMany({
    where: { channel },
    orderBy: { createdAt: "asc" },
  });

  const formatted: SessionChatMessage[] = messages.map((m) => ({
    id: m.id,
    authorName: m.authorName,
    authorRole: m.authorRole,
    authorInitials: m.authorInitials,
    authorColor: m.authorColor,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    isCurrentUser: m.authorId === session.user.id,
  }));

  return { success: true, messages: formatted };
}

export async function sendSessionChatMessage(bookingId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Sign in required" };
  }

  const text = content.trim();
  if (!text) {
    return { success: false, error: "Message cannot be empty" };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: { include: { user: true } }, student: true },
  });

  if (!booking) {
    return { success: false, error: "Session not found" };
  }

  const isStudent = booking.studentId === session.user.id;
  const isTutor = booking.tutor.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isStudent && !isTutor && !isAdmin) {
    return { success: false, error: "Only participants can send messages" };
  }

  const authorName = session.user.name || (isTutor ? "Tutor" : "Student");
  const authorRole = isTutor ? "Volunteer Tutor" : isAdmin ? "Platform Lead" : "Student";
  const authorInitials = authorName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const authorColor = isTutor ? "#2563EB" : "#0D9488";

  await prisma.communityMessage.create({
    data: {
      channel: `session-${bookingId}`,
      authorId: session.user.id,
      authorName,
      authorEmail: session.user.email,
      authorRole,
      authorInitials,
      authorColor,
      content: text,
    },
  });

  revalidatePath(`/sessions/${bookingId}`);
  return { success: true };
}

export async function sharePostClassResource(
  bookingId: string,
  title: string,
  urlOrNotes: string,
  category: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Sign in required" };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true },
  });

  if (!booking) {
    return { success: false, error: "Session not found" };
  }

  const isTutor = booking.tutor.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isTutor && !isAdmin) {
    return { success: false, error: "Only the session tutor can post official study resources" };
  }

  const resourcePayload = `[RESOURCE_SHARE]\nCategory: ${category}\nTitle: ${title.trim()}\nDetails: ${urlOrNotes.trim()}`;

  return await sendSessionChatMessage(bookingId, resourcePayload);
}
