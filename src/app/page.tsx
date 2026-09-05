import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HomeInteractiveClient from "./HomeInteractiveClient";

export const dynamic = "force-dynamic";
export const revalidate = 30; // ISR: 30s cache for live stats

export const metadata = {
  title: "Learnivia — Free Online Peer Tutoring for K–10 Students",
  description: "Free 1-on-1 peer tutoring for Kindergarten through Grade 10. Verified volunteer tutors, private Zoom sessions, every learning style supported. No cost, ever.",
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const now = new Date();

  // Query genuine real-time data from PostgreSQL
  const [nextWorkshop, verifiedTutorsCount, completedSessionsCount] = await Promise.all([
    prisma.workshop.findFirst({
      where: {
        status: "UPCOMING",
        endTime: { gte: now },
      },
      include: {
        tutor: { include: { user: true } },
        enrollments: true,
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.tutorProfile.count({ where: { status: "APPROVED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
  ]);

  const liveSession = nextWorkshop
    ? {
        id: nextWorkshop.id,
        title: nextWorkshop.title,
        subject: nextWorkshop.subject,
        description: nextWorkshop.description,
        tutorName: nextWorkshop.tutor.user.name || "Volunteer Tutor",
        tutorSchool: nextWorkshop.tutor.school || "Verified Peer Mentor",
        startTime: nextWorkshop.startTime.toISOString(),
        openSeats: Math.max(0, nextWorkshop.maxCapacity - nextWorkshop.enrollments.length),
        maxCapacity: nextWorkshop.maxCapacity,
      }
    : null;

  return (
    <main>
      <HomeInteractiveClient
        liveSession={liveSession}
        tutorsCount={verifiedTutorsCount}
        completedCount={completedSessionsCount}
      />
    </main>
  );
}
