import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "TUTOR" | "ADMIN";
      onboardingCompleted: boolean;
      timezone?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: "STUDENT" | "TUTOR" | "ADMIN";
    onboardingCompleted: boolean;
    timezone?: string | null;
  }
}
