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

        // Check for Demo / Fast-path logins
        const isDemo =
          ["shourya@test.com", "admin@test.com", "tutor@test.com", "student@test.com"].includes(inputEmail) &&
          inputPassword === "password123";

        if (isDemo || demoRole) {
          const roleFromDemo = demoRole ? demoRole.toUpperCase() : "";
          const targetEmail =
            roleFromDemo === "ADMIN"
              ? "admin@test.com"
              : roleFromDemo === "TUTOR"
                ? "tutor@test.com"
                : roleFromDemo === "STUDENT"
                  ? "student@test.com"
                  : inputEmail;

          const role =
            targetEmail === "shourya@test.com" || targetEmail === "admin@test.com"
              ? "ADMIN"
              : targetEmail === "tutor@test.com"
                ? "TUTOR"
                : "STUDENT";

          const name =
            targetEmail === "shourya@test.com"
              ? "Shourya Sharan (Admin)"
              : targetEmail === "admin@test.com"
                ? "Learnivia Admin"
                : targetEmail === "tutor@test.com"
                  ? "Sarah Jenkins (Tutor)"
                  : "Alex Chen (Learner)";

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

          const isAdminEmail = role === "ADMIN" || isDesignatedAdmin(user);
          return {
            id: user?.id || `demo-${role.toLowerCase()}`,
            name: user?.name || name,
            email: targetEmail,
            image: user?.image || null,
            role,
            isAdmin: isAdminEmail,
            isTutor: role === "TUTOR",
            isTrainingCompleted: true,
            tutorStatus: role === "TUTOR" ? "APPROVED" : null,
            onboardingCompleted: true,
            timezone: user?.timezone || "America/New_York",
          };
        }

        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).trim().toLowerCase();

        // P0-12: Check memory lockout first as quick filter
        if (isLockedOut(email)) {
          throw new Error("RATE_LIMITED");
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { tutorProfile: { include: { trainingModules: true } } },
        });

        // P0-12: Block suspended accounts immediately
        if (user?.accountSuspended) {
          throw new Error("ACCOUNT_SUSPENDED");
        }

        // P0-12: Check DB-backed lockout across distributed instances
        const now = new Date();
        if (user?.lockedUntil && user.lockedUntil > now) {
          throw new Error("RATE_LIMITED");
        }

        // P0-12: Always run bcrypt compare (even for non-existent users) to prevent timing attacks
        const dummyHash =
          "$2a$12$dummyhashfortimingnnn.aaaaabbbbccccddddeeeefffff";
        const passwordToCheck = user?.password || dummyHash;
        const isValid = await bcrypt.compare(
          credentials.password as string,
          passwordToCheck,
        );

        if (!user || !user.password || !isValid) {
          recordFailedAttempt(email);
          if (user) {
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

        // Success - clear failed attempts in memory & DB, record login timestamp
        clearAttempts(email);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginCount: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        // Strict Admin check: exclusively Ahmed and Shourya (or ADMIN_EMAILS)
        const isAdminUser = isDesignatedAdmin(user);
        const isApprovedTutor = Boolean(
          user.tutorProfile && user.tutorProfile.status === "APPROVED",
        );
        const isTrainingDone = Boolean(
          user.tutorProfile?.status === "APPROVED" ||
          (user.tutorProfile?.trainingModules?.filter((m: any) => m.quizPassed)
            .length ?? 0) >= 3,
        );

        if (isAdminUser && user.role !== "ADMIN") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
        } else if (!isAdminUser && user.role === "ADMIN") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "STUDENT" },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: isAdminUser
            ? "ADMIN"
            : user.role === "ADMIN"
              ? "STUDENT"
              : user.role,
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
