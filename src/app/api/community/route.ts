import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-user";
import { getMessages, addMessage, toggleReaction } from "@/lib/community-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel") || undefined;
  const messages = await getMessages(channel);
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in to post in the community." }, { status: 401 });
  }

  const body = await request.json();
  const { channel, content } = body;

  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Message content cannot be empty." }, { status: 400 });
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
    channel: channel || "Random",
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
