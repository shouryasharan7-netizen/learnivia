import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const ADMIN_EMAILS = new Set([
  "shouryasharan7@gmail.com",
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) : []),
]);

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
      // Handle session updates from the client
      if (trigger === "update" && session) {
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
        if (session.role !== undefined) {
          token.role = session.role;
        }
      }

      if (user) {
        token.id = (user.id || token.id || token.sub) as string;
        const normalizedEmail = (user.email || token.email || "").trim().toLowerCase();
        if (normalizedEmail) token.email = normalizedEmail;

        const isUserAdmin = normalizedEmail ? ADMIN_EMAILS.has(normalizedEmail) : false;
        token.role = isUserAdmin ? "ADMIN" : (user.role || token.role || "STUDENT");
        token.onboardingCompleted = user.onboardingCompleted ?? true;
        token.timezone = user.timezone ?? null;
      }

      // If token has an admin email, ensure role is always ADMIN
      if (token.email && ADMIN_EMAILS.has((token.email as string).trim().toLowerCase())) {
        token.role = "ADMIN";
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
