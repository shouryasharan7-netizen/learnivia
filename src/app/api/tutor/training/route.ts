import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
      include: { trainingModules: true },
    });

    if (!tutorProfile) {
      return NextResponse.json({ completedModules: [] });
    }

    const completed = tutorProfile.trainingModules
      .filter((m) => m.quizPassed)
      .map((m) => m.moduleId);

    return NextResponse.json({ completedModules: completed });
  } catch (error: any) {
    console.error("GET /api/tutor/training error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch training progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { moduleId, moduleTitle, quizPassed } = body;

    const modNum = Number(moduleId);
    if (!modNum || modNum < 1 || modNum > 5) {
      return NextResponse.json({ error: "Invalid moduleId" }, { status: 400 });
    }

    if (!quizPassed) {
      return NextResponse.json({ error: "Quiz must be passed to complete module" }, { status: 400 });
    }

    const training = await prisma.tutorTraining.upsert({
      where: {
        tutorId_moduleId: {
          tutorId: tutorProfile.id,
          moduleId: modNum,
        },
      },
      create: {
        tutorId: tutorProfile.id,
        moduleId: modNum,
        moduleTitle: String(moduleTitle || `Module ${modNum}`),
        quizPassed: true,
      },
      update: {
        quizPassed: true,
        completedAt: new Date(),
      },
    });

    // Check total completed modules
    const completedCount = await prisma.tutorTraining.count({
      where: {
        tutorId: tutorProfile.id,
        quizPassed: true,
      },
    });

    if (completedCount >= 3 && tutorProfile.status === "PENDING") {
      await prisma.tutorProfile.update({
        where: { id: tutorProfile.id },
        data: { status: "APPROVED" },
      });
    }

    return NextResponse.json({ success: true, training, isApproved: completedCount >= 3 });
  } catch (error: any) {
    console.error("POST /api/tutor/training error:", error);
    return NextResponse.json({ error: error.message || "Failed to save training progress" }, { status: 500 });
  }
}
