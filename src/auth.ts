import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig, getAdminEmails } from "./auth.config"

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
  const entry = loginAttemptMap.get(key);
  const now = Date.now();

  if (!entry || (now - (entry.lockedUntil || 0) > ATTEMPT_WINDOW_MS && !entry.lockedUntil)) {
    loginAttemptMap.set(key, { count: 1, lockedUntil: null });
    return;
  }

  const newCount = (entry.count || 0) + 1;
  if (newCount >= MAX_ATTEMPTS) {
    loginAttemptMap.set(key, { count: newCount, lockedUntil: now + LOCKOUT_DURATION_MS });
  } else {
    loginAttemptMap.set(key, { count: newCount, lockedUntil: null });
  }
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
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const email = (credentials.email as string).trim().toLowerCase();

        // P0-12: Check memory lockout first as quick filter
        if (isLockedOut(email)) {
          throw new Error("RATE_LIMITED");
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { tutorProfile: true },
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

        // P0-5: Admin email check exclusively from ADMIN_EMAILS env var — no hardcoded fallbacks
        const adminEmails = getAdminEmails();
        const isAdminEmail = adminEmails.has(email);

        if (isAdminEmail && user.role !== "ADMIN") {
          return await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
        }

        return user;
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        // P0-5: Admin email check exclusively from env var — no hardcoded fallbacks
        const adminEmails = getAdminEmails();
        const isAdminEmail = adminEmails.has(normalizedEmail);

        if (isAdminEmail) {
          try {
            await prisma.user.updateMany({
              where: { email: normalizedEmail },
              data: { role: "ADMIN" },
            });
          } catch (e) {
            console.error("Failed to elevate admin role on sign in:", e);
          }
        }
      }
    },
  },
});
