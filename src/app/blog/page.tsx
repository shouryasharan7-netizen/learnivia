import StoriesPage, { metadata as storiesMetadata } from "@/app/stories/page";

export const dynamic = "force-dynamic";
export const revalidate = 300; // ISR: 5 min u2014 blog posts are stable

export const metadata = {
  ...storiesMetadata,
  title: "Blog & Stories | Learnivia",
};

export default StoriesPage;
