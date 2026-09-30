"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface MessageThread {
  id: string; // channel id: e.g. "session-<id>", "workshop-<id>", "direct-<tutorId>-<studentId>"
  title: string;
  type: "session" | "workshop" | "direct";
  badgeText: string;
  badgeColor?: string;
  memberCount: number;
  lastMessageAuthor?: string;
  lastMessageSnippet?: string;
  lastMessageAt?: string;
  isClosed?: boolean;
  unreadCount?: number;
  targetId?: string; // bookingId, workshopId, or tutorId
}

export interface ChatMessageItem {
  id: string;
  authorId?: string | null;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  createdAt: string;
  reactions?: Record<string, number> | null;
  isCurrentUser: boolean;
}

export async function getUserMessageThreads(): Promise<{
  success: boolean;
  threads: MessageThread[];
  currentUserId?: string;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, threads: [], error: "Sign in required" };
  }

  const userId = session.user.id;
  const isTutor = Boolean(session.user.role === "TUTOR" || (session.user as any).isTutor);
  const isAdmin = session.user.role === "ADMIN";

  try {
    // 1. Fetch user's tutor profile if exists
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    const tutorId = tutorProfile?.id;

    // 2. Fetch 1-on-1 bookings (where user is student or tutor)
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { studentId: userId },
          ...(tutorId ? [{ tutorId }] : []),
        ],
      },
      include: {
        tutor: { include: { user: { select: { name: true, image: true } } } },
        student: { select: { id: true, name: true, image: true } },
      },
      orderBy: { startTime: "desc" },
      take: 20,
    });

    // 3. Fetch workshops (where user is tutor or enrolled)
    const [tutorWorkshops, enrollments] = await Promise.all([
      tutorId
        ? prisma.workshop.findMany({
            where: { tutorId },
            include: { enrollments: true },
            orderBy: { startTime: "desc" },
            take: 15,
          })
        : Promise.resolve([]),
      prisma.workshopEnrollment.findMany({
        where: { studentId: userId },
        include: {
          workshop: {
            include: {
              tutor: { include: { user: { select: { name: true } } } },
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
    ]);

    // 4. Fetch direct message channels involving this user
    // Channels like "direct-<tutorId>-<studentId>"
    const directChannelsWhere = [
      { channel: { startsWith: `direct-${tutorId}-` } },
      { channel: { endsWith: `-${userId}` } },
      { channel: "Direct Inquiries" },
    ];

    const directMessages = await prisma.communityMessage.findMany({
      where: {
        OR: directChannelsWhere,
      },
      orderBy: { createdAt: "desc" },
      take: 40,
    });

    const threads: MessageThread[] = [];

    // Map Bookings into threads
    for (const b of bookings) {
      const channel = `session-${b.id}`;
      const lastMsg = await prisma.communityMessage.findFirst({
        where: { channel },
        orderBy: { createdAt: "desc" },
      });

      const otherPartyName =
        b.studentId === userId
          ? b.tutor.user.name || "Volunteer Tutor"
          : b.student.name || "Student";

      threads.push({
        id: channel,
        title: `${b.subject}: ${b.topic || otherPartyName}`,
        type: "session",
        badgeText: "1-ON-1",
        badgeColor: "#0D9488",
        memberCount: 2,
        lastMessageAuthor: lastMsg?.authorName,
        lastMessageSnippet:
          lastMsg?.content || `Session scheduled for ${new Date(b.startTime).toLocaleDateString()}`,
        lastMessageAt: (lastMsg?.createdAt || b.createdAt).toISOString(),
        isClosed: b.status === "COMPLETED" || b.status === "CANCELED",
        targetId: b.id,
      });
    }

    // Map Workshops into threads
    const allWorkshops = [
      ...tutorWorkshops,
      ...enrollments.map((e) => e.workshop),
    ];
    // Deduplicate
    const seenWorkshops = new Set<string>();
    for (const w of allWorkshops) {
      if (!w || seenWorkshops.has(w.id)) continue;
      seenWorkshops.add(w.id);

      const channel = `workshop-${w.id}`;
      const lastMsg = await prisma.communityMessage.findFirst({
        where: { channel },
        orderBy: { createdAt: "desc" },
      });

      const memberCount = (w.enrollments?.length || 0) + 1;

      threads.push({
        id: channel,
        title: w.title,
        type: "workshop",
        badgeText: "GROUP",
        badgeColor: "#2563EB",
        memberCount,
        lastMessageAuthor: lastMsg?.authorName,
        lastMessageSnippet:
          lastMsg?.content || `Workshop starts ${new Date(w.startTime).toLocaleDateString()}`,
        lastMessageAt: (lastMsg?.createdAt || w.createdAt).toISOString(),
        isClosed: w.status === "COMPLETED" || w.status === "CANCELED",
        targetId: w.id,
      });
    }

    // Map Direct Inquiries / Tutor Messages into threads
    const seenDirect = new Set<string>();
    for (const dm of directMessages) {
      let channel = dm.channel;
      if (channel === "Direct Inquiries") {
        channel = `direct-inquiry-${dm.id}`;
      }
      if (seenDirect.has(channel)) continue;
      seenDirect.add(channel);

      threads.push({
        id: channel,
        title: dm.content.startsWith("[Direct inquiry")
          ? dm.content.split("\n")[0].replace("[Direct inquiry for ", "").replace("]", "")
          : `Conversation with ${dm.authorName}`,
        type: "direct",
        badgeText: "DIRECT",
        badgeColor: "#7C3AED",
        memberCount: 2,
        lastMessageAuthor: dm.authorName,
        lastMessageSnippet: dm.content.replace(/\[Direct inquiry.*?\]/, "").trim(),
        lastMessageAt: dm.createdAt.toISOString(),
        isClosed: false,
      });
    }

    // If no threads yet, add a welcoming platform safety intro thread
    if (threads.length === 0) {
      threads.push({
        id: "learnivia-welcome",
        title: "Welcome to Learnivia Messages",
        type: "direct",
        badgeText: "HELP",
        badgeColor: "#0D9488",
        memberCount: 2,
        lastMessageAuthor: "Learnivia Peer Support",
        lastMessageSnippet: "Chats are automatically created when you book sessions or message a tutor.",
        lastMessageAt: new Date().toISOString(),
        isClosed: false,
      });
    }

    // Sort by recent activity
    threads.sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    });

    return { success: true, threads, currentUserId: userId };
  } catch (err: any) {
    console.error("getUserMessageThreads error:", err);
    return { success: false, threads: [], error: err.message };
  }
}

export async function getThreadMessages(channelId: string): Promise<{
  success: boolean;
  messages: ChatMessageItem[];
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, messages: [], error: "Sign in required" };
  }

  const userId = session.user.id;

  if (channelId === "learnivia-welcome") {
    return {
      success: true,
      messages: [
        {
          id: "welcome-1",
          authorName: "Learnivia Safety Team",
          authorRole: "Moderator",
          authorInitials: "LS",
          authorColor: "#0D9488",
          content: "Welcome to Learnivia! To maintain a safe learning environment, group chats are generated when you enroll in study sessions, and 1-on-1 chats are created when you message a verified tutor.",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isCurrentUser: false,
        },
        {
          id: "welcome-2",
          authorName: "Learnivia Safety Team",
          authorRole: "Moderator",
          authorInitials: "LS",
          authorColor: "#0D9488",
          content: "Remember: Never share passwords, home addresses, phone numbers, or social media handles. All messages are moderated for student safeguarding.",
          createdAt: new Date().toISOString(),
          isCurrentUser: false,
        },
      ],
    };
  }

  try {
    const rawMessages = await prisma.communityMessage.findMany({
      where: { channel: channelId },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    const messages: ChatMessageItem[] = rawMessages.map((m) => ({
      id: m.id,
      authorId: m.authorId,
      authorName: m.authorName,
      authorRole: m.authorRole,
      authorInitials: m.authorInitials,
      authorColor: m.authorColor,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      reactions: m.reactions as any,
      isCurrentUser: m.authorId === userId,
    }));

    return { success: true, messages };
  } catch (err: any) {
    console.error("getThreadMessages error:", err);
    return { success: false, messages: [], error: err.message };
  }
}

export async function sendThreadMessage(
  channelId: string,
  content: string,
): Promise<{
  success: boolean;
  message?: ChatMessageItem;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Sign in required" };
  }

  const text = content.trim();
  if (!text) {
    return { success: false, error: "Message cannot be empty." };
  }

  const userId = session.user.id;
  const userRole = session.user.role || "STUDENT";
  const isTutor = Boolean(userRole === "TUTOR" || (session.user as any).isTutor);
  const isAdmin = userRole === "ADMIN";

  // Safeguarding check:
  // If direct message channel, ensure it is NOT student-to-student!
  if (channelId.startsWith("direct-")) {
    const parts = channelId.split("-");
    // e.g. direct-<tutorId>-<studentId>
    if (parts.length >= 3) {
      const targetTutorId = parts[1];
      const targetStudentId = parts[2];

      // Verify targetTutorId belongs to a TutorProfile
      const tutor = await prisma.tutorProfile.findUnique({
        where: { id: targetTutorId },
      });

      if (!tutor) {
        return {
          success: false,
          error: "Direct messaging is strictly restricted to interactions with verified volunteer tutors.",
        };
      }

      // Check if user is neither the tutor nor the student
      if (tutor.userId !== userId && targetStudentId !== userId && !isAdmin) {
        return {
          success: false,
          error: "You are not a participant in this conversation.",
        };
      }
    }
  }

  const authorName = session.user.name || (isTutor ? "Tutor" : "Student");
  const authorRole = isTutor
    ? "Volunteer Tutor"
    : isAdmin
      ? "Platform Lead"
      : "Student";
  const authorInitials = authorName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const authorColor = isTutor ? "#0D9488" : isAdmin ? "#B45309" : "#2563EB";

  try {
    const created = await prisma.communityMessage.create({
      data: {
        channel: channelId,
        authorId: userId,
        authorName,
        authorEmail: session.user.email,
        authorRole,
        authorInitials,
        authorColor,
        content: text,
      },
    });

    const formatted: ChatMessageItem = {
      id: created.id,
      authorId: created.authorId,
      authorName: created.authorName,
      authorRole: created.authorRole,
      authorInitials: created.authorInitials,
      authorColor: created.authorColor,
      content: created.content,
      createdAt: created.createdAt.toISOString(),
      isCurrentUser: true,
    };

    revalidatePath("/messages");
    return { success: true, message: formatted };
  } catch (err: any) {
    console.error("sendThreadMessage error:", err);
    return { success: false, error: "Failed to send message." };
  }
}
