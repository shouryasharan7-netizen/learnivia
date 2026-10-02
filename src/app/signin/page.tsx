import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInClient from "./SignInClient";

export const metadata = {
  title: "Sign In - Learnivia",
  description:
    "Sign in to your Learnivia account to join tutoring sessions and workshops.",
};

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    const { isDesignatedAdmin } = await import("@/auth.config");
    const isUserAdmin = isDesignatedAdmin(session.user);
    const isApprovedTutor =
      session.user.role === "TUTOR" &&
      (session.user as any)?.tutorStatus === "APPROVED";
    if (isUserAdmin) redirect("/admin");
    if (isApprovedTutor) redirect("/tutor");
    redirect("/dashboard");
  }

  return <SignInClient />;
}
