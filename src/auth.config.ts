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
    // If ADMIN_EMAILS is not configured, no email-based admin elevation occurs.
    // Admins can still be set directly in the database via user.role = "ADMIN".
    return new Set<string>();
  }
  return new Set(
    process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
  );
}

export const authConfig = {
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
        // NOTE: Never trust client-supplied session.role to prevent privilege escalation!
      }

      if (user) {
        token.id = (user.id || token.id || token.sub) as string;
        const normalizedEmail = (user.email || token.email || "").trim().toLowerCase();
        if (normalizedEmail) token.email = normalizedEmail;

        // P0-5: Admin check via env var only
        const adminEmails = getAdminEmails();
        const isUserAdmin = normalizedEmail ? adminEmails.has(normalizedEmail) : false;
        token.role = isUserAdmin ? "ADMIN" : (user.role || token.role || "STUDENT");
        token.onboardingCompleted = user.onboardingCompleted ?? true;
        token.timezone = user.timezone ?? null;
      }

      // If token has an admin email, ensure role is always ADMIN
      if (token.email) {
        const adminEmails = getAdminEmails();
        if (adminEmails.has((token.email as string).trim().toLowerCase())) {
          token.role = "ADMIN";
        }
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
        session.user.role = (token.role as "STUDENT" | "TUTOR" | "ADMIN") || "STUDENT";
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
