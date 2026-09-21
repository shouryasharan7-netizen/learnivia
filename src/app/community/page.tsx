import { getCurrentUser } from "@/lib/auth-user";
import { getMessages } from "@/lib/community-store";
import CommunityClient from "./CommunityClient";

export const dynamic = "force-dynamic";
export const revalidate = 30; // ISR: 30s cache

export const metadata = {
  title: "Community - Learnivia",
  description: "Connect with the Learnivia learning community. Ask questions, share resources, and join live study channels.",
};

type Props = {
  searchParams: Promise<{ channel?: string }>;
};

export default async function CommunityPage({ searchParams }: Props) {
  // P0-11: Use getCurrentUser() which resolves isAdmin from the database
  // and ADMIN_EMAILS env var, never from hardcoded email strings in source.
  const user = await getCurrentUser();
  const { channel } = await searchParams;
  const initialMessages = await getMessages(channel);

  const currentUser = user
    ? {
        id: user.id,
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        role: (user.isTutor ? "TUTOR" : user.role === "STUDENT" ? "STUDENT" : "STUDENT") as "STUDENT" | "TUTOR" | "COMMUNITY LEAD",
        isAdmin: user.isAdmin,
      }
    : null;

  return (
    <main style={{ minHeight: "calc(100vh - 56px)", background: "var(--wa-cream, #FAF8F5)" }}>
      <CommunityClient
        initialMessages={initialMessages}
        currentUser={currentUser}
        initialChannel={channel || "Announcements"}
      />
    </main>
  );
}
