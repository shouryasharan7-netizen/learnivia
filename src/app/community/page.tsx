import { auth } from "@/auth";
import { getMessages } from "@/lib/community-store";
import CommunityClient from "./CommunityClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Community — Learnivia",
  description: "Connect with the Learnivia learning community. Ask questions, share resources, and join live study channels.",
};

type Props = {
  searchParams: Promise<{ channel?: string }>;
};

export default async function CommunityPage({ searchParams }: Props) {
  const session = await auth();
  const { channel } = await searchParams;
  const initialMessages = getMessages(channel);

  const currentUser = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name,
        email: session.user.email,
        // @ts-ignore
        role: session.user.role || "STUDENT",
      }
    : null;

  return (
    <main style={{ minHeight: "calc(100vh - 56px)", background: "#F8FAFC" }}>
      <CommunityClient
        initialMessages={initialMessages}
        currentUser={currentUser}
        initialChannel={channel || "Announcements"}
      />
    </main>
  );
}
