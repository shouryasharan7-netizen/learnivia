import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TutorTrainingClient } from "./TutorTrainingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Safeguarding & Tutoring Training | Learnivia",
  description:
    "Mandatory child safeguarding and interactive tutoring training modules for Learnivia volunteer educators.",
};

export default async function TutorTrainingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/tutor/training");
  }

  // Check if tutor already passed all 3 modules or is already APPROVED
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    include: { trainingModules: true },
  });

  const passedCount = (tutor?.trainingModules || []).filter(
    (m: any) => m.quizPassed,
  ).length;

  // If already approved or completed 3/3, redirect immediately on the server — ZERO FLASH FOREVER!
  if (tutor && (tutor.status === "APPROVED" || passedCount >= 3)) {
    redirect("/tutor");
  }

  const initialCompleted = (tutor?.trainingModules || [])
    .filter((m: any) => m.quizPassed)
    .map((m: any) => m.moduleId);

  return <TutorTrainingClient initialCompleted={initialCompleted} />;
}
