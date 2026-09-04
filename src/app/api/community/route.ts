import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-user";
import { getMessages, addMessage, toggleReaction, deleteMessage, checkContentSafety } from "@/lib/community-store";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel") || undefined;
  const messages = await getMessages(channel);
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in to participate in the community." }, { status: 401 });
  }

  const body = await request.json();
  const { channel, content, action, messageId, reason } = body;

  // Handle Report Action
  if (action === "report" && messageId) {
    try {
      await prisma.incidentReport.create({
        data: {
          reporterId: user.id,
          category: "Community Moderation",
          description: `Reported Message ID: ${messageId}. Reason: ${reason || "Flagged by community member"}`,
          status: "PENDING",
        },
      });
      return NextResponse.json({ success: true, message: "Report submitted to moderators." });
    } catch (e) {
      console.error("Failed to file report:", e);
      return NextResponse.json({ error: "Failed to submit report." }, { status: 500 });
    }
  }

  // Handle New Message
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Message content cannot be empty." }, { status: 400 });
  }

  const targetChannel = channel || "Random";

  // Enforce channel permissions: Only admins can post in Announcements
  if (targetChannel.toLowerCase() === "announcements" && !user.isAdmin) {
    return NextResponse.json(
      { error: "Only platform administrators are permitted to post in #Announcements." },
      { status: 403 }
    );
  }

  // Enforce Safety and Safeguarding Moderation Filter
  const safetyCheck = checkContentSafety(content.trim());
  if (!safetyCheck.safe) {
    return NextResponse.json({ error: safetyCheck.reason }, { status: 400 });
  }

  const userName = user.name || "Community Member";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const userRole = user.isAdmin ? "COMMUNITY LEAD" : user.isTutor ? "TUTOR" : "STUDENT";
  const colors = ["#0E8345", "#7C3AED", "#2563EB", "#D97706", "#DC2626", "#0D9488"];
  const color = colors[userName.charCodeAt(0) % colors.length];

  const newMsg = await addMessage({
    channel: targetChannel,
    authorId: user.id,
    authorName: userName,
    authorEmail: user.email || "",
    authorRole: userRole,
    authorInitials: initials,
    authorColor: color,
    content: content.trim(),
  });

  return NextResponse.json({ success: true, message: newMsg });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { messageId, reactionType } = body;

  if (!messageId || !reactionType) {
    return NextResponse.json({ error: "Missing messageId or reactionType." }, { status: 400 });
  }

  const updated = await toggleReaction(messageId, reactionType);
  if (!updated) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: updated });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get("messageId");

  if (!messageId) {
    return NextResponse.json({ error: "Missing messageId parameter." }, { status: 400 });
  }

  // Verify permission: User must be ADMIN or author of the message
  const msg = await prisma.communityMessage.findUnique({ where: { id: messageId } });
  if (!msg) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  if (!user.isAdmin && msg.authorId !== user.id) {
    return NextResponse.json({ error: "You do not have permission to delete this message." }, { status: 403 });
  }

  const deleted = await deleteMessage(messageId);
  if (!deleted) {
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }

  return NextResponse.json({ success: true, messageId });
}
