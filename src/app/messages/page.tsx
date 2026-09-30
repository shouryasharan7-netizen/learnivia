import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserMessageThreads } from "@/app/actions/messages";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Messages | Learnivia",
  description: "Direct tutoring inquiries and session group discussions monitored for volunteer safety.",
};

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/messages");
  }

  const res = await getUserMessageThreads();
  const threads = res.success ? res.threads : [];

  return (
    <MessagesClient
      initialThreads={threads}
      currentUserId={session.user.id}
    />
  );
}
