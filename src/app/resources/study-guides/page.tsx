import type { Metadata } from "next";
import StudyGuidesClient from "./StudyGuidesClient";

export const metadata: Metadata = {
  title: "K-10 Study Guides & Subject Summaries | Learnivia",
  description: "Free K-10 study guides, formula cheat sheets, step-by-step methods, and interactive self-check tools across Mathematics, Science, Reading & Writing, and Social Studies.",
};

export default function StudyGuidesPage() {
  return <StudyGuidesClient />;
}
