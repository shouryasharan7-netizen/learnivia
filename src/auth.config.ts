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
      if (user) {
        token.id = user.id
        // @ts-ignore
        token.role = user.role
        // @ts-ignore
        token.onboardingCompleted = user.onboardingCompleted
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        // @ts-ignore
        session.user.role = token.role
        // @ts-ignore
        session.user.onboardingCompleted = token.onboardingCompleted
      }
      return session
    },
  },
} satisfies NextAuthConfig
