import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAdminEmails, isDesignatedAdmin } from "@/auth.config";
import type { User, TutorProfile, Role, TutorTraining } from "@prisma/client";

export interface AuthenticatedUser extends User {
  role: Role;
  isTutor: boolean;
  isAdmin: boolean;
  isTrainingCompleted: boolean;
  tutorProfile: (TutorProfile & { trainingModules?: TutorTraining[] }) | null;
}

/**
 * Resolves the currently authenticated user from the database.
 * Uses both session.user.id and session.user.email as fallbacks.
 * Wrapped with React.cache() to deduplicate queries across layouts and components in the same server request.
 *
 * Admin designation: Exclusively for Ahmed and Shourya (or ADMIN_EMAILS).
 */
export const getCurrentUser = cache(
  async function getCurrentUser(): Promise<AuthenticatedUser | null> {
    const session = await auth();
    if (!session?.user) return null;

    const rawEmail = session.user.email?.trim().toLowerCase();
    const rawId = session.user.id;

    if (!rawEmail && !rawId) return null;

    // Query database with fast lookup
    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(rawId ? [{ id: rawId }] : []),
          ...(rawEmail ? [{ email: rawEmail }] : []),
        ],
      },
      include: {
        tutorProfile: {
          include: {
            trainingModules: true,
          },
        },
      },
    });

    if (!dbUser) return null;

    // Strict designated admin check
    const isAdmin = isDesignatedAdmin(dbUser);
    const role: Role = isAdmin
      ? "ADMIN"
      : dbUser.role === "ADMIN"
        ? "STUDENT"
        : dbUser.role;

    if (isAdmin && dbUser.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { role: "ADMIN" },
      });
    } else if (!isAdmin && dbUser.role === "ADMIN") {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { role: "STUDENT" },
      });
    }

    // A user is only an active tutor if their tutor profile is explicitly APPROVED.
    // Admins do not automatically have an active tutor profile on learner dashboard.
    const isTutor = Boolean(dbUser.tutorProfile?.status === "APPROVED");
    const passedModules = (dbUser.tutorProfile?.trainingModules || []).filter(
      (m: any) => m.quizPassed,
    ).length;
    const isTrainingCompleted = passedModules === 5;

    return {
      ...dbUser,
      role,
      isTutor,
      isAdmin,
      isTrainingCompleted,
    };
  },
);

/**
 * Ensures user is authenticated; throws if not.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be signed in to perform this action.");
  }
  return user;
}

/**
 * Ensures user is an approved tutor (or admin) with a valid TutorProfile.
 */
export async function requireTutor(): Promise<{
  user: AuthenticatedUser;
  tutor: TutorProfile;
}> {
  const user = await requireAuth();

  let tutor = user.tutorProfile;

  // If user is an ADMIN without a tutor profile, auto-create one
  if (!tutor && user.isAdmin) {
    tutor = await prisma.tutorProfile.create({
      data: {
        userId: user.id,
        status: "APPROVED",
        bio: "Administrator & Volunteer Educator",
        school: "Learnivia Core Team",
        volunteerHours: 0.0,
      },
    });
  }

  if (!tutor || tutor.status !== "APPROVED") {
    throw new Error("Only approved tutors can perform this action.");
  }

  return { user, tutor };
}

/**
 * Ensures user has ADMIN role.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!user.isAdmin) {
    throw new Error("Unauthorized. Admin access required.");
  }
  return user;
}
