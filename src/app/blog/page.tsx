import StoriesPage, { metadata as storiesMetadata } from "@/app/stories/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  ...storiesMetadata,
  title: "Blog & Stories — Learnivia",
};

export default StoriesPage;
