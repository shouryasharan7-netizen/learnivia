import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import UserManagementClient from "./UserManagementClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin - User & Role Management | Learnivia",
};

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect("/dashboard");
  }

  // Automatically purge known mock/test seed accounts from database
  try {
    await prisma.user.deleteMany({
      where: {
        OR: [
          {
            email: {
              in: [
                "tutor.test@learnivia.org",
                "parent.test@learnivia.org",
                "marcus.vance@learnivia.org",
                "elena.rostova@learnivia.org",
              ],
            },
          },
          { name: { in: ["Marcus Vance", "Elena Rostova"] } },
        ],
      },
    });
  } catch (e) {
    // Non-blocking if table locked or already deleted
  }

  const users = await prisma.user.findMany({
    where: {
      email: {
        notIn: [
          "tutor.test@learnivia.org",
          "parent.test@learnivia.org",
          "marcus.vance@learnivia.org",
          "elena.rostova@learnivia.org",
        ],
      },
      name: {
        notIn: ["Marcus Vance", "Elena Rostova"],
      },
    },
    include: {
      tutorProfile: {
        select: { id: true, status: true, volunteerHours: true },
      },
      studentBookings: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
    },
    orderBy: { id: "desc" },
    take: 100,
  });

  const serializedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    age: u.age,
    grade: u.grade,
    curriculum: u.curriculum,
    points: u.points,
    createdAt: u.emailVerified ? u.emailVerified.toISOString() : null,
    completedSessions: u.studentBookings.length,
    tutorProfile: u.tutorProfile
      ? {
          status: u.tutorProfile.status,
          volunteerHours: u.tutorProfile.volunteerHours,
        }
      : null,
  }));

  return (
    <UserManagementClient
      initialUsers={serializedUsers}
      currentAdminId={user.id}
    />
  );
}
