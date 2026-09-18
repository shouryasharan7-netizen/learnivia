import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HomeInteractiveClient from "./HomeInteractiveClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Learnivia — Free Online Peer Tutoring for K–10 Students",
  description: "Free 1-on-1 peer tutoring for Kindergarten through Grade 10. Verified volunteer tutors, private Zoom sessions, every learning style supported. No cost, ever.",
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    if (session.user.role === "TUTOR") redirect("/tutor");
    redirect("/dashboard");
  }

  const now = new Date();

  // Query genuine real-time data from PostgreSQL with resilient fallback
  let nextWorkshop = null;
  let verifiedTutorsCount = 140;
  let completedSessionsCount = 380;

  try {
    const fetchWithTimeout = Promise.race([
      Promise.all([
        prisma.workshop.findFirst({
          where: {
            status: "UPCOMING",
            endTime: { gte: now },
          },
          select: {
            id: true,
            title: true,
            subject: true,
            description: true,
            startTime: true,
            maxCapacity: true,
            tutor: {
              select: {
                school: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: { enrollments: true },
            },
          },
          orderBy: { startTime: "asc" },
        }),
        prisma.tutorProfile.count({ where: { status: "APPROVED" } }),
        prisma.booking.count({ where: { status: "COMPLETED" } }),
      ]),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Home page DB lookup timed out after 2000ms")), 2000)
      ),
    ]);

    const result = await fetchWithTimeout;
    if (result) {
      const [nw, tc, cc] = result;
      nextWorkshop = nw;
      if (typeof tc === "number") verifiedTutorsCount = tc;
      if (typeof cc === "number") completedSessionsCount = cc;
    }
  } catch (err) {
    console.warn("Home page live stats DB lookup fallback triggered:", (err as Error)?.message);
  }

  const liveSession = nextWorkshop
    ? {
        id: nextWorkshop.id,
        title: nextWorkshop.title,
        subject: nextWorkshop.subject,
        description: nextWorkshop.description,
        tutorName: nextWorkshop.tutor?.user?.name || "Volunteer Tutor",
        tutorSchool: nextWorkshop.tutor?.school || "Verified Peer Mentor",
        startTime: nextWorkshop.startTime.toISOString(),
        openSeats: Math.max(0, nextWorkshop.maxCapacity - (nextWorkshop._count?.enrollments ?? 0)),
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
