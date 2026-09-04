import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AdminSessionsClient from "./AdminSessionsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin - All Sessions & Workshops | Learnivia",
};

export default async function AdminSessionsPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect("/dashboard");
  }

  const [bookings, workshops] = await Promise.all([
    prisma.booking.findMany({
      include: {
        tutor: { include: { user: { select: { name: true, email: true } } } },
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startTime: "desc" },
    }),
    prisma.workshop.findMany({
      include: {
        tutor: { include: { user: { select: { name: true, email: true } } } },
        enrollments: { select: { id: true } },
      },
      orderBy: { startTime: "desc" },
    }),
  ]);

  const serializedBookings = bookings.map((b) => ({
    id: b.id,
    subject: b.subject,
    startTime: b.startTime.toISOString(),
    endTime: b.endTime.toISOString(),
    status: b.status,
    zoomLink: b.zoomLink,
    tutor: {
      id: b.tutorId,
      user: {
        name: b.tutor.user.name,
        email: b.tutor.user.email,
      },
    },
    student: {
      id: b.student.id,
      name: b.student.name,
      email: b.student.email,
    },
  }));

  const serializedWorkshops = workshops.map((w) => ({
    id: w.id,
    title: w.title,
    startTime: w.startTime.toISOString(),
    durationMinutes: Math.max(15, Math.round((new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60))),
    capacity: w.maxCapacity,
    zoomLink: w.zoomLink,
    tutor: {
      id: w.tutorId,
      user: {
        name: w.tutor.user.name,
        email: w.tutor.user.email,
      },
    },
    enrollmentCount: w.enrollments.length,
  }));

  return (
    <AdminSessionsClient
      initialBookings={serializedBookings}
      initialWorkshops={serializedWorkshops}
    />
  );
}
