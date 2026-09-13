import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { addMessage } from "@/lib/community-store";
import { validateMeetingUrl } from "@/lib/meetingUrl";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");

    // P0-9: Homework questions are PRIVATE by default.
    // - Unauthenticated: 401
    // - Students: see only their own questions (full detail)
    // - Tutors/Admins: see open questions anonymized (no student identity, truncated question)
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to view homework questions." },
        { status: 401 }
      );
    }

    // Exclude soft-deleted questions
    const where: Record<string, unknown> = {
      deletedAt: null,
    };
    if (subject && subject !== "All") {
      where.subject = { contains: subject, mode: "insensitive" };
    }

    if (user.isAdmin || user.isTutor) {
      // Tutors & admins see open questions, anonymized
      where.status = "OPEN";

      const requests = await prisma.homeworkRequest.findMany({
        where,
        select: {
          id: true,
          subject: true,
          grade: true,
          curriculum: true,
          preferredFormat: true,
          status: true,
          createdAt: true,
          // Deliberately omit: question (full text), studentId, student details
          // Tutors get a truncated preview only — full question revealed on accept
          tutor: {
            select: {
              id: true,
              school: true,
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      return NextResponse.json({ success: true, requests, viewMode: "tutor" });
    } else {
      // Students see only their OWN questions with full detail
      where.studentId = user.id;

      const requests = await prisma.homeworkRequest.findMany({
        where,
        include: {
          student: { select: { id: true, name: true, grade: true, curriculum: true } },
          tutor: {
            select: {
              id: true,
              school: true,
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      return NextResponse.json({ success: true, requests, viewMode: "student" });
    }
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
      authorColor: "#C9922A",
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

    // P1-10: Domain validate zoomLink if provided
    if (zoomLink) {
      const urlCheck = validateMeetingUrl(zoomLink);
      if (!urlCheck.valid) {
        return NextResponse.json(
          { error: urlCheck.reason || "Invalid meeting link. Only approved video providers (Zoom, Google Meet) are permitted." },
          { status: 400 }
        );
      }
    }

    const existing = await prisma.homeworkRequest.findUnique({
      where: { id },
      include: { tutor: true },
    });

    if (!existing || existing.deletedAt) {
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
        tutor: { select: { id: true, school: true, user: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ success: true, homework: updated });
  } catch (error) {
    console.error("Failed to update homework request:", error);
    return NextResponse.json({ error: "Failed to update homework request." }, { status: 500 });
  }
}

/**
 * DELETE /api/homework
 * P0-9: Soft-delete homework requests (sets deletedAt timestamp).
 * Authorized for question author or platform admins only.
 */
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let id: string | null = null;
    try {
      const body = await request.json();
      id = body?.id ?? null;
    } catch {
      // Empty body is acceptable; fallback to searchParams
    }

    if (!id) {
      const { searchParams } = new URL(request.url);
      id = searchParams.get("id");
    }

    if (!id) {
      return NextResponse.json({ error: "Missing question ID." }, { status: 400 });
    }

    const existing = await prisma.homeworkRequest.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return NextResponse.json({ error: "Homework request not found." }, { status: 404 });
    }

    const isOwner = existing.studentId === user.id;
    const isAdmin = user.isAdmin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete this homework question." },
        { status: 403 }
      );
    }

    const deleted = await prisma.homeworkRequest.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Homework question successfully deleted.",
      id: deleted.id,
    });
  } catch (error) {
    console.error("Failed to delete homework request:", error);
    return NextResponse.json({ error: "Failed to delete homework request." }, { status: 500 });
  }
}
