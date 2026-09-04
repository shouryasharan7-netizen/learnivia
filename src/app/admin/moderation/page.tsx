import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import AdminModerationClient from "./AdminModerationClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin - Content & Moderation Hub | Learnivia",
};

export default async function AdminModerationPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect("/dashboard");
  }

  const [messages, homeworkRequests] = await Promise.all([
    prisma.communityMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
    prisma.homeworkRequest.findMany({
      include: {
        student: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);

  const serializedMessages = messages.map((m) => ({
    id: m.id,
    channel: m.channel,
    authorName: m.authorName,
    authorEmail: m.authorEmail,
    authorRole: m.authorRole,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  }));

  const serializedHomework = homeworkRequests.map((h) => ({
    id: h.id,
    subject: h.subject,
    question: h.question,
    status: h.status,
    preferredFormat: h.preferredFormat,
    studentName: h.student.name || h.student.email,
    createdAt: h.createdAt.toISOString(),
  }));

  return (
    <AdminModerationClient
      initialMessages={serializedMessages}
      initialHomework={serializedHomework}
    />
  );
}
