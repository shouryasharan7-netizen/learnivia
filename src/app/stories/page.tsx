import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import StoriesClient from "./StoriesClient";

export const dynamic = "force-dynamic";
export const revalidate = 60; // ISR: 60s cache

export const metadata: Metadata = {
  title: "Stories & Blog — Learnivia",
  description:
    "Real breakthroughs from Ku201310 learners, volunteer tutor spotlights, and parent perspectives from our community around the world.",
  openGraph: {
    title: "Stories & Blog — Learnivia",
    description:
      "Explore real student breakthroughs, tutor journeys, and test prep masterclasses from the Learnivia community.",
    url: "https://learnivia-green.vercel.app/stories",
    siteName: "Learnivia",
    type: "website",
  },
};

export default async function StoriesPage() {
  let initialStories: Array<{ id: string; name: string; subject: string; quote: string }> = [];

  try {
    const dbStories = await prisma.story.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    initialStories = dbStories.map((s) => ({
      id: s.id,
      name: s.name,
      subject: s.subject,
      quote: s.quote,
    }));
  } catch (err) {
    console.error("Error fetching stories from DB:", err);
  }

  return <StoriesClient initialDbStories={initialStories} />;
}
