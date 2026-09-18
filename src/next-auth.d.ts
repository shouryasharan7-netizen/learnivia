import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "TUTOR" | "ADMIN";
      onboardingCompleted: boolean;
      timezone?: string | null;
      isTutor?: boolean;
      isAdmin?: boolean;
      isTrainingCompleted?: boolean;
      tutorStatus?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: "STUDENT" | "TUTOR" | "ADMIN";
    onboardingCompleted: boolean;
    timezone?: string | null;
    isTutor?: boolean;
    isAdmin?: boolean;
    isTrainingCompleted?: boolean;
    tutorStatus?: string | null;
  }
}
