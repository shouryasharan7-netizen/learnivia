import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileCheck, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "Volunteer Service Transcript | Learnivia",
  description:
    "Official, verifiable volunteer tutoring transcript and service hours certificate.",
};

export default async function VolunteerTranscriptRedirectPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/tutor/transcript");
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    include: { trainingModules: true },
  });

  if (profile) {
    const passed = (profile.trainingModules || []).filter(
      (m: any) => m.quizPassed,
    ).length;
    if (passed < 5) {
      redirect("/tutor/training?locked=1");
    }
    // Redirect directly to the tutor's verified transcript
    redirect(`/tutor/${profile.id}/transcript`);
  }

  // If user is not yet a tutor, provide a clean informational certificate preview
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden="true">
          <FileCheck size={32} />
        </div>
        <h1 className={styles.title}>Volunteer Service Record</h1>
        <p className={styles.description}>
          Verified service records detail your logged tutoring hours, student
          testimonials, and verified subjects. These documents feature
          cryptographic verification codes for school advisors, community
          service logs, and scholarship portfolios.
        </p>

        <div className={styles.noticeBox}>
          <strong>You don&apos;t have an active tutor profile yet.</strong>
          <p>
            Apply to become a volunteer tutor to start tutoring students and
            earning verified service hours.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/apply" className={styles.primaryBtn}>
            Apply to Become a Tutor{" "}
            <ArrowRight size={15} style={{ marginLeft: 6 }} />
          </Link>
          <Link href="/sessions" className={styles.secondaryBtn}>
            Explore Learning Sessions
          </Link>
        </div>
      </div>
    </main>
  );
}
