import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ stories });
  } catch (err) {
    console.error("Failed to fetch stories:", err);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in to submit a community story." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { name, subject, quote } = body;

    if (!quote || quote.trim().length < 15) {
      return NextResponse.json(
        {
          error:
            "Please share a little more about your experience (at least 15 characters).",
        },
        { status: 400 },
      );
    }

    // Mask name for student privacy (First Name + Last Initial)
    const rawName = (
      name?.trim() ||
      session.user.name ||
      "Community Learner"
    ).trim();
    const parts = rawName.split(/\s+/);
    let storyName = parts[0];
    if (parts.length > 1) {
      storyName = `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
    }

    const storySubject = subject?.trim() || "Peer Learning";

    // Submissions require administrator moderation approval before becoming public
    const newStory = await prisma.story.create({
      data: {
        name: storyName,
        subject: storySubject,
        quote: quote.trim(),
        isPublished: false,
      },
    });

    return NextResponse.json({
      success: true,
      moderationPending: true,
      story: newStory,
    });
  } catch (err) {
    console.error("Failed to submit story:", err);
    return NextResponse.json(
      { error: "Failed to submit story" },
      { status: 500 },
    );
  }
}
