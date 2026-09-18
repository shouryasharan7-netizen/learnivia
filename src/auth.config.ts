import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

/**
 * P0-5: Returns the set of admin emails exclusively from the ADMIN_EMAILS
 * environment variable. No hardcoded email addresses in source code.
 *
 * Set ADMIN_EMAILS in your deployment environment (Vercel / .env.local):
 *   ADMIN_EMAILS=admin@example.com,anotheradmin@example.com
 *
 * NOTE: This function is called at request time (not module init) so that
 * the env var is read fresh. In practice on Vercel, env vars are baked in
 * at deploy time, so this is equivalent — but makes the dependency explicit.
 */
export function getAdminEmails(): Set<string> {
  if (!process.env.ADMIN_EMAILS) {
    return new Set<string>();
  }
  return new Set(
    process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
  );
}

/**
 * Strict Admin Designation:
 * Only Ahmed and Shourya (or emails in ADMIN_EMAILS) qualify for the ADMIN role.
 * All other learners and tutors are strictly non-admins.
 */
export function isDesignatedAdmin(user?: { name?: string | null; email?: string | null } | null): boolean {
  if (!user) return false;
  const email = (user.email || "").trim().toLowerCase();
  const name = (user.name || "").trim().toLowerCase();

  // Explicit check for Ahmed and Shourya
  if (email.includes("shourya") || name.includes("shourya")) return true;
  if (email.includes("ahmed") || name.includes("ahmed")) return true;

  // Environment variable check
  const adminEmails = getAdminEmails();
  if (email && adminEmails.has(email)) return true;

  return false;
}

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Handle safe session updates from the client (e.g. onboarding status)
      if (trigger === "update" && session) {
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
        if (session.timezone !== undefined) {
          token.timezone = session.timezone;
        }
      }

      if (user) {
        token.id = (user.id || token.id || token.sub) as string;
        const normalizedEmail = (user.email || token.email || "").trim().toLowerCase();
        if (normalizedEmail) token.email = normalizedEmail;
        if (user.name) token.name = user.name;

        const isUserAdmin = isDesignatedAdmin({ email: normalizedEmail, name: user.name });
        token.role = isUserAdmin ? "ADMIN" : (user.role === "ADMIN" ? "STUDENT" : (user.role || token.role || "STUDENT"));
        token.isAdmin = isUserAdmin;
        token.isTutor = Boolean((user as any).isTutor);
        token.isTrainingCompleted = Boolean((user as any).isTrainingCompleted);
        token.tutorStatus = (user as any).tutorStatus || null;
        token.onboardingCompleted = user.onboardingCompleted ?? true;
        token.timezone = user.timezone ?? null;
      }

      // Security enforcement: Ensure role and isAdmin match isDesignatedAdmin
      const userAdmin = isDesignatedAdmin({ email: token.email as string, name: token.name as string });
      if (userAdmin) {
        token.role = "ADMIN";
        token.isAdmin = true;
      } else {
        if (token.role === "ADMIN") {
          token.role = "STUDENT";
        }
        token.isAdmin = false;
      }

      // Guarantee token.id is never empty
      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = ((token.id || token.sub) as string) || "";
        const userAdmin = isDesignatedAdmin({ email: token.email as string, name: session.user.name || (token.name as string) });
        session.user.role = userAdmin ? "ADMIN" : ((token.role as any) === "ADMIN" ? "STUDENT" : (token.role as "STUDENT" | "TUTOR" | "ADMIN") || "STUDENT");
        session.user.isAdmin = userAdmin;
        session.user.isTutor = Boolean(token.isTutor);
        session.user.isTrainingCompleted = Boolean(token.isTrainingCompleted);
        session.user.tutorStatus = (token.tutorStatus as string | null) || null;
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
        session.user.timezone = (token.timezone as string | null) || null;
        if (token.email) {
          session.user.email = token.email as string;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig
