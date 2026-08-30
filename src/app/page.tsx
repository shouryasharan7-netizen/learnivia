import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HomeInteractiveClient from "./HomeInteractiveClient";

export const metadata = {
  title: "Learnivia — Free Online Peer Tutoring",
  description: "Join over 205k students. Free peer-led tutoring, SAT prep, college admissions mentorship, homework help, and meaningful conversations with students around the globe.",
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <HomeInteractiveClient />
    </main>
  );
}
