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
    authorRole: "COMMUNITY LEAD",
    authorInitials: "LT",
    authorColor: "#0E8345",
    content: "🎉 Welcome to the Learnivia Community! This is your space to connect with fellow learners and volunteer tutors around the globe. Join live sessions, ask questions in Homework Help, and start study circles in the channels below.",
    reactions: { heart: 1, clap: 1, bulb: 1, fire: 1 },
  },
];

export async function getMessages(channel?: string): Promise<CommunityMessage[]> {
  try {
    const where: any = {};
    if (channel && channel !== "Home" && channel !== "All") {
      where.channel = { equals: channel, mode: "insensitive" };
    }

    const count = await prisma.communityMessage.count();
    if (count === 0) {
      // Seed default announcement if completely empty
      for (const item of DEFAULT_ANNOUNCEMENTS) {
        await prisma.communityMessage.create({
          data: {
            channel: item.channel,
            authorName: item.authorName,
            authorEmail: item.authorEmail,
            authorRole: item.authorRole,
            authorInitials: item.authorInitials,
            authorColor: item.authorColor,
            content: item.content,
            reactions: item.reactions,
          },
        });
      }
    }

    const rows = await prisma.communityMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return rows.map((r) => {
      const reactions = (r.reactions as any) || { heart: 0, clap: 0, bulb: 0, fire: 0 };
      const timeStr = new Date(r.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const dateStr = new Date(r.createdAt).toLocaleDateString([], { month: "short", day: "numeric" });
      return {
        id: r.id,
        channel: r.channel,
        authorName: r.authorName,
        authorEmail: r.authorEmail || "",
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
