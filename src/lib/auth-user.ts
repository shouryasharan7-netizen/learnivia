import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAdminEmails } from "@/auth.config";
import type { User, TutorProfile, Role } from "@prisma/client";

export interface AuthenticatedUser extends User {
  role: Role;
  isTutor: boolean;
  isAdmin: boolean;
  tutorProfile: TutorProfile | null;
}

/**
 * Resolves the currently authenticated user from the database.
 * Uses both session.user.id and session.user.email as fallbacks.
 * Ensures role synchronization (e.g. designated admin emails).
 *
 * P0-5: Admin email check exclusively from ADMIN_EMAILS env var.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
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
      tutorProfile: true,
    },
  });

  if (!dbUser) return null;

  // Ground truth role checks — env var only, no hardcoded emails
  const email = dbUser.email?.trim().toLowerCase();
  const adminEmails = getAdminEmails();
  const isDesignatedAdmin = email ? adminEmails.has(email) : false;

  let role: Role = dbUser.role;

  // Elevate designated admin if needed
  if (isDesignatedAdmin && role !== "ADMIN") {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: "ADMIN" },
    });
    role = "ADMIN";
  }

  // A user is only an active tutor if their tutor profile is explicitly APPROVED (or they are an admin).
  // Suspended or rejected tutors cannot act as tutors regardless of user.role field.
  const isTutor =
    role === "ADMIN" ||
    (dbUser.tutorProfile?.status === "APPROVED");

  const isAdmin = role === "ADMIN";

  return {
    ...dbUser,
    role,
    isTutor,
    isAdmin,
  };
}

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
