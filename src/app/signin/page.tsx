import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInClient from "./SignInClient";

export const metadata = {
  title: "Sign In — Learnivia",
  description: "Sign in to your Learnivia account to join tutoring sessions and workshops.",
};

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignInClient />;
}
