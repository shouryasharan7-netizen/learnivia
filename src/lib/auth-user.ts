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

    const isAdmin = isDesignatedAdmin(session.user);

    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findFirst({
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
    } catch (e) {
      console.error("Prisma lookup error in getCurrentUser:", e);
    }

    // If user exists in session but not in DB, auto-create to prevent redirect loops
    if (!dbUser && rawEmail) {
      try {
        dbUser = await prisma.user.create({
          data: {
            id: rawId && rawId.length >= 20 ? rawId : undefined,
            email: rawEmail,
            name: session.user.name || (rawEmail.includes("shourya") ? "Shourya Sharan" : rawEmail.split("@")[0]),
            role: isAdmin ? "ADMIN" : (session.user.role as Role) || "STUDENT",
            onboardingCompleted: true,
          },
          include: {
            tutorProfile: {
              include: {
                trainingModules: true,
              },
            },
          },
        });
      } catch (e) {
        console.error("Auto-provision dbUser error in getCurrentUser:", e);
      }
    }

    if (!dbUser) {
      // Safe fallback from session to prevent kicking user back to /signin
      const fallbackRole: Role = isAdmin
        ? "ADMIN"
        : (session.user.role as Role) || "STUDENT";

      return {
        id: rawId || "user-session",
        email: rawEmail || "",
        name: session.user.name || "User",
        role: fallbackRole,
        isTutor: session.user.role === "TUTOR",
        isAdmin,
        isTrainingCompleted: true,
        tutorProfile: null,
        onboardingCompleted: true,
        accountSuspended: false,
        suspendedReason: null,
        lockedUntil: null,
        failedLoginCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        emailVerified: new Date(),
        image: session.user.image || null,
        age: null,
        grade: null,
        curriculum: null,
        isMinor: false,
        parentEmail: null,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        password: null,
        primaryGoal: null,
        timezone: "America/New_York",
      } as unknown as AuthenticatedUser;
    }

    // Strict designated admin check
    const effectiveRole: Role = isAdmin
      ? "ADMIN"
      : dbUser.role === "ADMIN"
        ? "STUDENT"
        : dbUser.role;

    if (isAdmin && dbUser.role !== "ADMIN") {
      try {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: "ADMIN" },
        });
      } catch (e) {}
    } else if (!isAdmin && dbUser.role === "ADMIN") {
      try {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: "STUDENT" },
        });
      } catch (e) {}
    }

    const isTutor = Boolean(dbUser.tutorProfile?.status === "APPROVED");
    const passedModules = (dbUser.tutorProfile?.trainingModules || []).filter(
      (m: any) => m.quizPassed,
    ).length;
    const isTrainingCompleted = passedModules >= 3;

    return {
      ...dbUser,
      role: effectiveRole,
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
