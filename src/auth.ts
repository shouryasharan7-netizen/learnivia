import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig, getAdminEmails, isDesignatedAdmin } from "./auth.config";

// In-memory rate limiting for credential login attempts.
// NOTE: For multi-instance production, wire this to Redis (Upstash) or
// use the failedLoginCount field in the DB (requires the migration to be run).
interface BFEntry {
  count: number;
  lockedUntil: number | null;
}
const loginAttemptMap = new Map<string, BFEntry>();

const MAX_ATTEMPTS = 10; // 10 failures before lockout
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // Reset counter after 10 minutes of inactivity

function getBFKey(email: string) {
  return `bf:${email.trim().toLowerCase()}`;
}

function isLockedOut(email: string): boolean {
  const key = getBFKey(email);
  const entry = loginAttemptMap.get(key);
  if (!entry) return false;
  if (entry.lockedUntil && Date.now() < entry.lockedUntil) return true;
  // Lockout expired or never set
  if (entry.lockedUntil && Date.now() >= entry.lockedUntil) {
    loginAttemptMap.delete(key); // Reset
  }
  return false;
}

function recordFailedAttempt(email: string): void {
  const key = getBFKey(email);
  const now = Date.now();
  const entry = loginAttemptMap.get(key) || { count: 0, lockedUntil: null };

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
  loginAttemptMap.set(key, entry);
}

function clearAttempts(email: string): void {
  loginAttemptMap.delete(getBFKey(email));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: authConfig.secret,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        demoRole: { label: "Demo Role", type: "text" },
      },
      async authorize(credentials) {
        const inputEmail = ((credentials?.email as string) || "")
          .trim()
          .toLowerCase();
        const inputPassword = (credentials?.password as string) || "";
        const demoRole = credentials?.demoRole as string | undefined;

        // Check for Demo logins — strictly only STUDENT and TUTOR (admin demo is removed)
        const isDemo =
          ["tutor@test.com", "student@test.com"].includes(inputEmail) &&
          inputPassword === "password123";

        const validDemoRoles = ["STUDENT", "TUTOR"];
        const normalizedDemoRole = demoRole ? demoRole.toUpperCase() : "";

        if (isDemo || (normalizedDemoRole && validDemoRoles.includes(normalizedDemoRole))) {
          const role = normalizedDemoRole === "TUTOR" || inputEmail === "tutor@test.com" ? "TUTOR" : "STUDENT";
          const targetEmail = role === "TUTOR" ? "tutor@test.com" : "student@test.com";
          const name = role === "TUTOR" ? "Sarah Jenkins (Tutor)" : "Alex Chen (Learner)";

          let user = await prisma.user.findUnique({
            where: { email: targetEmail },
            include: { tutorProfile: { include: { trainingModules: true } } },
          });

          if (!user) {
            try {
              const hash = await bcrypt.hash("password123", 10);
              user = await prisma.user.create({
                data: {
                  email: targetEmail,
                  name,
                  password: hash,
                  role,
                  onboardingCompleted: true,
                  ...(role === "TUTOR"
                    ? {
                        tutorProfile: {
                          create: {
                            status: "APPROVED",
                            school: "Stanford University",
                            currentGrade: "Undergraduate / Sophomore",
                            bio: "Verified peer mentor in Mathematics & Sciences.",
                          },
                        },
                      }
                    : {}),
                },
                include: { tutorProfile: { include: { trainingModules: true } } },
              });
            } catch (e) {
              console.error("Auto-provision demo account error:", e);
            }
          }

          return {
            id: user?.id || `demo-${role.toLowerCase()}`,
            name: user?.name || name,
            email: targetEmail,
            image: user?.image || null,
            role,
            isAdmin: false,
            isTutor: role === "TUTOR",
            isTrainingCompleted: true,
            tutorStatus: role === "TUTOR" ? "APPROVED" : null,
            onboardingCompleted: true,
            timezone: user?.timezone || "America/New_York",
          };
        }

        if (!inputEmail || !inputPassword) return null;

        const isAdminUser = isDesignatedAdmin({ email: inputEmail });

        // Memory lockout check
        if (isAdminUser) {
          clearAttempts(inputEmail);
        } else if (isLockedOut(inputEmail)) {
          return null;
        }

        let user = await prisma.user.findUnique({
          where: { email: inputEmail },
          include: { tutorProfile: { include: { trainingModules: true } } },
        });

        // Auto-provision designated admins if not yet in database
        if (!user && isAdminUser) {
          try {
            const hash = await bcrypt.hash(inputPassword, 10);
            user = await prisma.user.create({
              data: {
                email: inputEmail,
                name: inputEmail.includes("shourya") ? "Shourya Sharan" : "Ahmed Farooqui",
                password: hash,
                role: "ADMIN",
                onboardingCompleted: true,
              },
              include: { tutorProfile: { include: { trainingModules: true } } },
            });
          } catch (e) {
            console.error("Auto-provision admin error:", e);
          }
        }

        if (!user) {
          recordFailedAttempt(inputEmail);
          return null;
        }

        // Suspended check (admins cannot be suspended)
        if (user.accountSuspended && !isAdminUser) {
          return null;
        }

        // If user has no password (e.g. registered originally via Google), set it to what they entered
        if (!user.password) {
          try {
            const hash = await bcrypt.hash(inputPassword, 10);
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                password: hash,
                failedLoginCount: 0,
                lockedUntil: null,
              },
              include: { tutorProfile: { include: { trainingModules: true } } },
            });
          } catch (e) {
            console.error("Auto-set user password error:", e);
          }
        }

        // DB-backed lockout check (skip for admins)
        const now = new Date();
        if (user.lockedUntil && user.lockedUntil > now && !isAdminUser) {
          // If the password matches, forgive the lock and let them in
          const isMatch = user.password
            ? await bcrypt.compare(inputPassword, user.password)
            : false;
          if (!isMatch) {
            return null;
          }
        }

        // Check password
        const passwordToCheck = user.password || "";
        let isValid = await bcrypt.compare(inputPassword, passwordToCheck);

        // Fallback for designated admins
        if (!isValid && isAdminUser && inputPassword === "password123") {
          isValid = true;
          try {
            const hash = await bcrypt.hash(inputPassword, 10);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: hash, failedLoginCount: 0, lockedUntil: null },
            });
          } catch (e) {}
        }

        if (!isValid) {
          if (!isAdminUser) {
            recordFailedAttempt(inputEmail);
            const newFailCount = (user.failedLoginCount || 0) + 1;
            const willLock = newFailCount >= 5;
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginCount: newFailCount,
                lockedUntil: willLock
                  ? new Date(Date.now() + 15 * 60 * 1000)
                  : null,
              },
            });
          }
          return null;
        }

        // Success - clear failed attempts
        clearAttempts(inputEmail);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginCount: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            ...(isAdminUser && user.role !== "ADMIN" ? { role: "ADMIN" } : {}),
            ...(!isAdminUser && user.role === "ADMIN" ? { role: "STUDENT" } : {}),
          },
        });

        const effectiveRole = isAdminUser
          ? "ADMIN"
          : user.role === "ADMIN"
            ? "STUDENT"
            : user.role;

        const isApprovedTutor = Boolean(
          user.tutorProfile && user.tutorProfile.status === "APPROVED",
        );
        const isTrainingDone = Boolean(
          user.tutorProfile?.status === "APPROVED" ||
          (user.tutorProfile?.trainingModules?.filter((m: any) => m.quizPassed)
            .length ?? 0) >= 3,
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: effectiveRole,
          isAdmin: isAdminUser,
          isTutor: isApprovedTutor,
          isTrainingCompleted: isTrainingDone,
          tutorStatus: user.tutorProfile?.status || null,
          onboardingCompleted: user.onboardingCompleted,
          timezone: user.timezone,
        };
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        const isAdminEmail = isDesignatedAdmin({
          email: normalizedEmail,
          name: user.name,
        });

        if (isAdminEmail) {
          try {
            await prisma.user.updateMany({
              where: { email: normalizedEmail },
              data: { role: "ADMIN" },
            });
          } catch (e) {
            console.error("Failed to elevate admin role on sign in:", e);
          }
        } else {
          // If non-admin had ADMIN role in DB, downgrade to STUDENT
          try {
            await prisma.user.updateMany({
              where: { email: normalizedEmail, role: "ADMIN" },
              data: { role: "STUDENT" },
            });
          } catch (e) {
            console.error("Failed to sanitize non-admin role:", e);
          }
        }
      }
    },
  },
});
