import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { addMessage } from "@/lib/community-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const mineOnly = searchParams.get("mine") === "true";

    const user = await getCurrentUser();

    const where: any = {};
    if (subject && subject !== "All") {
      where.subject = { contains: subject, mode: "insensitive" };
    }
    if (mineOnly && user) {
      where.studentId = user.id;
    }

    const requests = await prisma.homeworkRequest.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, grade: true, curriculum: true } },
        tutor: { include: { user: { select: { id: true, name: true, image: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Privacy masking for minor students: First Name + Last Initial
    const sanitizedRequests = requests.map((req) => {
      const rawName = req.student?.name || "Student";
      const parts = rawName.trim().split(/\s+/);
      const maskedName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
      return {
        ...req,
        student: req.student ? { ...req.student, name: maskedName } : null,
      };
    });

    return NextResponse.json({ success: true, requests: sanitizedRequests });
  } catch (error) {
    console.error("Error fetching homework requests:", error);
    return NextResponse.json({ error: "Failed to fetch questions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to post a homework question." }, { status: 401 });
    }

    const body = await request.json();
    const { subject, question, preferredFormat, grade, curriculum } = body;

    if (!subject || !question || !question.trim()) {
      return NextResponse.json({ error: "Subject and question are required." }, { status: 400 });
    }

    // 1. Create persistent HomeworkRequest in PostgreSQL
    const homework = await prisma.homeworkRequest.create({
      data: {
        studentId: user.id,
        subject,
        question: question.trim(),
        preferredFormat: preferredFormat || "zoom",
        grade: grade || user.grade || undefined,
        curriculum: curriculum || user.curriculum || undefined,
        status: "OPEN",
      },
      include: {
        student: { select: { id: true, name: true, grade: true, curriculum: true } },
      },
    });

    // 2. Also broadcast to Community channel for immediate visibility (without exposing email)
    const userName = user.name || "Student";
    const nameParts = userName.trim().split(/\s+/);
    const maskedAuthor = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.` : nameParts[0];
    const initials = nameParts.map((n) => n[0]).slice(0, 2).join("").toUpperCase();

    await addMessage({
      channel: "K–10 Homework Help",
      authorId: user.id,
      authorName: maskedAuthor,
      authorEmail: "", // never leak personal email addresses to community store
      authorRole: "STUDENT",
      authorInitials: initials,
      authorColor: "#7C3AED",
      content: `📌 [${subject}] ${question.trim()} (Format: ${preferredFormat === "zoom" ? "Live Zoom Room" : "Chat Discussion"})`,
    });

    return NextResponse.json({ success: true, homework });
  } catch (error) {
    console.error("Failed to create homework request:", error);
    return NextResponse.json({ error: "Internal server error creating homework request." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { id, answer, zoomLink, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing question ID." }, { status: 400 });
    }

    const existing = await prisma.homeworkRequest.findUnique({
      where: { id },
      include: { tutor: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Homework request not found." }, { status: 404 });
    }

    // Enforce role & ownership authorization:
    // Only the student who posted, an approved tutor, or an admin can update the request
    const isOwner = existing.studentId === user.id;
    const isTutor = user.isTutor;
    const isAdmin = user.isAdmin;

    if (!isOwner && !isTutor && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to modify this homework question." },
        { status: 403 }
      );
    }

    // Tutor profile if current user is an approved tutor answering
    let tutorProfileId = existing.tutorId;
    if (isTutor && !tutorProfileId) {
      const profile = await prisma.tutorProfile.findUnique({ where: { userId: user.id } });
      if (profile && profile.status === "APPROVED") tutorProfileId = profile.id;
    }

    const updated = await prisma.homeworkRequest.update({
      where: { id },
      data: {
        answer: answer !== undefined ? answer : existing.answer,
        zoomLink: zoomLink !== undefined ? zoomLink : existing.zoomLink,
        status: status || (answer ? "ANSWERED" : existing.status),
        tutorId: tutorProfileId,
      },
      include: {
        student: { select: { id: true, name: true } },
        tutor: { include: { user: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ success: true, homework: updated });
  } catch (error) {
    console.error("Failed to update homework request:", error);
    return NextResponse.json({ error: "Failed to update homework request." }, { status: 500 });
  }
}
