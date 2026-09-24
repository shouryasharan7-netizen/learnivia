import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInClient from "./SignInClient";

export const metadata = {
  title: "Sign In - Learnivia",
  description: "Sign in to your Learnivia account to join tutoring sessions and workshops.",
};

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    if (session.user.role === "ADMIN") redirect("/admin");
    if (session.user.role === "TUTOR") redirect("/tutor");
    redirect("/dashboard");
  }

  return <SignInClient />;
}
