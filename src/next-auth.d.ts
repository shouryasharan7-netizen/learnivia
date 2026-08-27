import NextAuth, { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role: "STUDENT" | "TUTOR" | "ADMIN"
      onboardingCompleted: boolean
      timezone?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: "STUDENT" | "TUTOR" | "ADMIN"
    onboardingCompleted: boolean
    timezone?: string | null
  }
}
