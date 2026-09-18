import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig, getAdminEmails, isDesignatedAdmin } from "./auth.config"

// ── P0-12: Brute-force protection ────────────────────────────────────────
// In-memory rate limiting for credential login attempts.
// NOTE: For multi-instance production, wire this to Redis (Upstash) or
// use the failedLoginCount field in the DB (requires the migration to be run).
interface BFEntry { count: number; lockedUntil: number | null }
const loginAttemptMap = new Map<string, BFEntry>();

const MAX_ATTEMPTS = 10;           // 10 failures before lockout
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;   // Reset counter after 10 minutes of inactivity

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
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Fast-path bypass exclusively for demo accounts
        const demoEmail = (credentials?.email as string || "").trim().toLowerCase();
        if (demoEmail === "shourya@test.com" && credentials?.password === "password123") {
          const user = await prisma.user.findUnique({
            where: { email: demoEmail },
            include: { tutorProfile: { include: { trainingModules: true } } },
          });

          if (user) {
            const isAdminEmail = isDesignatedAdmin(user);
            const isApprovedTutor = Boolean(user.tutorProfile && user.tutorProfile.status === "APPROVED");
            const isTrainingDone = Boolean(user.tutorProfile?.trainingModules?.filter((m: any) => m.quizPassed).length === 5);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: isAdminEmail ? "ADMIN" : user.role,
              isAdmin: isAdminEmail,
              isTutor: isApprovedTutor,
              isTrainingCompleted: isTrainingDone,
              tutorStatus: user.tutorProfile?.status || null,
              onboardingCompleted: user.onboardingCompleted,
              timezone: user.timezone,
            };
          }
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
        const dummyHash = "$2a$12$dummyhashfortimingnnn.aaaaabbbbccccddddeeeefffff";
        const passwordToCheck = user?.password || dummyHash;
        const isValid = await bcrypt.compare(credentials.password as string, passwordToCheck);

        if (!user || !user.password || !isValid) {
          recordFailedAttempt(email);
          if (user) {
            const newFailCount = (user.failedLoginCount || 0) + 1;
            const willLock = newFailCount >= 5;
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginCount: newFailCount,
                lockedUntil: willLock ? new Date(Date.now() + 15 * 60 * 1000) : null,
              },
            });
          }
          return null;
        }

        // Success — clear failed attempts in memory & DB, record login timestamp
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
        const isApprovedTutor = Boolean(user.tutorProfile && user.tutorProfile.status === "APPROVED");
        const isTrainingDone = Boolean(user.tutorProfile?.trainingModules?.filter((m: any) => m.quizPassed).length === 5);

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
          role: isAdminUser ? "ADMIN" : (user.role === "ADMIN" ? "STUDENT" : user.role),
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
        const isAdminEmail = isDesignatedAdmin({ email: normalizedEmail, name: user.name });

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
