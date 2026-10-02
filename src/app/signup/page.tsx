import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpClient from "./SignUpClient";

export const metadata = {
  title: "Sign Up | Learnivia",
  description:
    "Create your free Learnivia account for peer-to-peer tutoring and learning.",
};

export default async function SignUpPage() {
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

  return <SignUpClient />;
}
