import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CalendarClient, { CalendarSessionItem } from "./CalendarClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Calendar & Schedule | Learnivia",
  description: "View and manage your upcoming 1-on-1 tutoring sessions and peer workshops.",
};

export default async function CalendarPage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/calendar");
  }

  const searchParams = await props.searchParams;
  const currentTab = (searchParams.tab === "past" ? "past" : "upcoming") as "upcoming" | "past";
  const userId = session.user.id;

  // Check if user has tutor profile
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  const tutorId = tutorProfile?.id;

  const now = new Date();

  // Query 1-on-1 bookings
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { studentId: userId },
        ...(tutorId ? [{ tutorId }] : []),
      ],
    },
    include: {
      tutor: {
        include: {
          user: { select: { name: true, image: true } },
        },
      },
      student: { select: { name: true, image: true } },
    },
    orderBy: { startTime: "asc" },
  });

  // Query workshops (as tutor or enrolled student)
  const [tutorWorkshops, enrollments] = await Promise.all([
    tutorId
      ? prisma.workshop.findMany({
          where: { tutorId },
          include: {
            tutor: { include: { user: { select: { name: true, image: true } } } },
          },
          orderBy: { startTime: "asc" },
        })
      : Promise.resolve([]),
    prisma.workshopEnrollment.findMany({
      where: { studentId: userId },
      include: {
        workshop: {
          include: {
            tutor: { include: { user: { select: { name: true, image: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const workshopList = [
    ...tutorWorkshops,
    ...enrollments.map((e) => e.workshop),
  ];

  // Map into CalendarSessionItem
  const bookingItems: CalendarSessionItem[] = bookings.map((b) => {
    const isCompleted = b.status === "COMPLETED" || new Date(b.endTime) < now;
    return {
      id: b.id,
      title: `${b.subject} Tutoring: ${b.topic || "1-on-1"}`,
      subject: b.subject,
      startTime: b.startTime.toISOString(),
      endTime: b.endTime.toISOString(),
      tutorName: b.tutor.user.name || "Volunteer Tutor",
      tutorImage: b.tutor.user.image,
      tutorSchool: b.tutor.school,
      zoomLink: b.zoomLink,
      status: isCompleted ? "COMPLETED" : "UPCOMING",
      isWorkshop: false,
    };
  });

  const seenWorkshopIds = new Set<string>();
  const workshopItems: CalendarSessionItem[] = [];
  for (const w of workshopList) {
    if (!w || seenWorkshopIds.has(w.id)) continue;
    seenWorkshopIds.add(w.id);

    const isCompleted = w.status === "COMPLETED" || new Date(w.endTime) < now;
    workshopItems.push({
      id: w.id,
      title: w.title,
      subject: w.subject,
      startTime: w.startTime.toISOString(),
      endTime: w.endTime.toISOString(),
      tutorName: w.tutor?.user?.name || "Peer Leader",
      tutorSchool: w.tutor?.school,
      zoomLink: w.zoomLink,
      status: isCompleted ? "COMPLETED" : "UPCOMING",
      isWorkshop: true,
    });
  }

  const allItems = [...bookingItems, ...workshopItems];

  const upcomingSessions = allItems
    .filter((s) => s.status === "UPCOMING" && new Date(s.endTime) >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const pastSessions = allItems
    .filter((s) => s.status === "COMPLETED" || new Date(s.endTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <CalendarClient
      upcomingSessions={upcomingSessions}
      pastSessions={pastSessions}
      defaultTab={currentTab}
    />
  );
}
