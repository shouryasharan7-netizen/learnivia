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
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { name, subject, quote } = body;

    if (!quote || quote.trim().length < 15) {
      return NextResponse.json(
        { error: "Please share a little more about your experience (at least 15 characters)." },
        { status: 400 }
      );
    }

    const storyName = name?.trim() || session?.user?.name || "Community Member";
    const storySubject = subject?.trim() || "General Tutoring";

    const newStory = await prisma.story.create({
      data: {
        name: storyName,
        subject: storySubject,
        quote: quote.trim(),
        isPublished: true, // published so it appears immediately!
      },
    });

    return NextResponse.json({ success: true, story: newStory });
  } catch (err) {
    console.error("Failed to submit story:", err);
    return NextResponse.json({ error: "Failed to submit story" }, { status: 500 });
  }
}
