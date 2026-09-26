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

  const users = await prisma.user.findMany({
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
