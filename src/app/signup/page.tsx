import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpClient from "./SignUpClient";

export const metadata = {
  title: "Sign Up — Learnivia",
  description: "Create your free Learnivia account for peer-to-peer tutoring and learning.",
};

export default async function SignUpPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignUpClient />;
}
