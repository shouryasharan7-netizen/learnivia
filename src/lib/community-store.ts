import { prisma } from "./prisma";

export interface CommunityMessage {
  id: string;
  channel: string;
  authorName: string;
  authorEmail: string;
  authorRole: "STUDENT" | "TUTOR" | "COMMUNITY LEAD";
  authorInitials: string;
  authorColor: string;
  content: string;
  timestamp: string;
  reactions: {
    heart: number;
    clap: number;
    bulb: number;
    fire: number;
  };
}

const DEFAULT_ANNOUNCEMENTS = [
  {
    channel: "Announcements",
    authorName: "Learnivia Team",
    authorEmail: "admin@learnivia.org",
    authorRole: "COMMUNITY LEAD" as const,
    authorInitials: "LT",
    authorColor: "#0E8345",
    content: "🎉 Welcome to the Learnivia Community! This is your space to connect with fellow learners and volunteer tutors around the globe. Join live sessions, ask questions in Homework Help, and start study circles in the channels below.",
    reactions: { heart: 1, clap: 1, bulb: 1, fire: 1 },
  },
];

const communityCache = new Map<string, { messages: CommunityMessage[]; timestamp: number }>();

export function invalidateCommunityCache() {
  communityCache.clear();
}

export async function getMessages(channel?: string): Promise<CommunityMessage[]> {
  const cacheKey = channel || "all";
  const cached = communityCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 30_000) {
    return cached.messages;
  }

  try {
    const where: any = {};
    if (channel && channel !== "Home" && channel !== "All") {
      where.channel = { equals: channel, mode: "insensitive" };
    }

    const rows = await prisma.communityMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (rows.length === 0 && (!channel || channel === "Announcements" || channel === "Home")) {
      return DEFAULT_ANNOUNCEMENTS.map((item, idx) => ({
        id: `default-${idx}`,
        ...item,
        authorEmail: "",
        timestamp: "Just now",
      }));
    }

    const messages: CommunityMessage[] = rows.map((r) => {
      const reactions = (r.reactions as any) || { heart: 0, clap: 0, bulb: 0, fire: 0 };
      const timeStr = new Date(r.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const dateStr = new Date(r.createdAt).toLocaleDateString([], { month: "short", day: "numeric" });

      // Privacy protection for student authors: First Name + Last Initial
      let displayName = r.authorName;
      if (r.authorRole === "STUDENT") {
        const parts = r.authorName.trim().split(/\s+/);
        if (parts.length > 1) {
          displayName = `${parts[0]} ${parts[parts.length - 1][0]}.`;
        }
      }

      return {
        id: r.id,
        channel: r.channel,
        authorName: displayName,
        authorEmail: "", // never leak personal email addresses to client
        authorRole: (r.authorRole as any) || "STUDENT",
        authorInitials: r.authorInitials,
        authorColor: r.authorColor,
        content: r.content,
        timestamp: `${dateStr} at ${timeStr}`,
        reactions: {
          heart: Number(reactions.heart) || 0,
          clap: Number(reactions.clap) || 0,
          bulb: Number(reactions.bulb) || 0,
          fire: Number(reactions.fire) || 0,
        },
      };
    });

    communityCache.set(cacheKey, { messages, timestamp: Date.now() });
    return messages;
  } catch (err) {
    console.error("Error loading community messages from DB:", err);
    return [];
  }
}

export async function addMessage(msg: {
  channel: string;
  authorName: string;
  authorEmail: string;
  authorRole: "STUDENT" | "TUTOR" | "COMMUNITY LEAD";
  authorInitials: string;
  authorColor: string;
  content: string;
  authorId?: string;
}): Promise<CommunityMessage> {
  invalidateCommunityCache();
  const defaultReactions = { heart: 0, clap: 0, bulb: 0, fire: 0 };

  const created = await prisma.communityMessage.create({
    data: {
      channel: msg.channel,
      authorId: msg.authorId,
      authorName: msg.authorName,
      authorEmail: msg.authorEmail,
      authorRole: msg.authorRole,
      authorInitials: msg.authorInitials,
      authorColor: msg.authorColor,
      content: msg.content,
      reactions: defaultReactions,
    },
  });

  const timeStr = new Date(created.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return {
    id: created.id,
    channel: created.channel,
    authorName: created.authorName,
    authorEmail: created.authorEmail || "",
    authorRole: created.authorRole as any,
    authorInitials: created.authorInitials,
    authorColor: created.authorColor,
    content: created.content,
    timestamp: `Today at ${timeStr}`,
    reactions: defaultReactions,
  };
}

export async function toggleReaction(
  messageId: string,
  reactionType: "heart" | "clap" | "bulb" | "fire"
): Promise<CommunityMessage | null> {
  try {
    const existing = await prisma.communityMessage.findUnique({
      where: { id: messageId },
    });
    if (!existing) return null;

    const currentReactions = (existing.reactions as any) || { heart: 0, clap: 0, bulb: 0, fire: 0 };
    currentReactions[reactionType] = (Number(currentReactions[reactionType]) || 0) + 1;

    const updated = await prisma.communityMessage.update({
      where: { id: messageId },
      data: { reactions: currentReactions },
    });
    invalidateCommunityCache();

    const timeStr = new Date(updated.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return {
      id: updated.id,
      channel: updated.channel,
      authorName: updated.authorName,
      authorEmail: updated.authorEmail || "",
      authorRole: updated.authorRole as any,
      authorInitials: updated.authorInitials,
      authorColor: updated.authorColor,
      content: updated.content,
      timestamp: `Today at ${timeStr}`,
      reactions: currentReactions,
    };
  } catch (err) {
    console.error("Failed to toggle reaction:", err);
    return null;
  }
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  try {
    await prisma.communityMessage.delete({
      where: { id: messageId },
    });
    return true;
  } catch (err) {
    console.error("Failed to delete message:", err);
    return false;
  }
}

export function checkContentSafety(content: string): { safe: boolean; reason?: string } {
  // Check for common phone number patterns
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  if (phonePattern.test(content)) {
    return {
      safe: false,
      reason: "For member safeguarding, sharing phone numbers or personal contact info is not permitted.",
    };
  }

  // Check for toxic or profanity words
  const prohibited = [
    "whatsapp me",
    "dm me on ig",
    "add my snap",
    "send nudes",
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "dick",
    "pussy",
    "retard",
    "faggot",
    "nigger",
    "nigga",
  ];
  const lower = content.toLowerCase();
  for (const word of prohibited) {
    if (lower.includes(word)) {
      return {
        safe: false,
        reason: "Message contains language that violates classroom-safe community standards.",
      };
    }
  }

  return { safe: true };
}

