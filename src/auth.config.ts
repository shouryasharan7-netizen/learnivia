import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

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
      }

      if (user) {
        token.id = user.id

        token.role = user.role

        token.onboardingCompleted = user.onboardingCompleted

        token.timezone = user.timezone
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "STUDENT" | "TUTOR" | "ADMIN"
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
        session.user.timezone = token.timezone as string | null
      }
      return session
    },
  },
} satisfies NextAuthConfig
