import { auth } from "@/auth";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ApplyFormClient from "./ApplyFormClient";

export const metadata: Metadata = {
  title: "Volunteer Tutor Application & Academic Credentials — Learnivia",
  description: "Apply to become a volunteer tutor on Learnivia or submit your academic report card and scores for review.",
};

export default async function ApplyPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <Image src="/images/become-a-tutor.png" alt="" width={120} height={150} className={styles.mascotImg} />
          <h1 className={styles.title}>Become a Volunteer Tutor</h1>
          <p className={styles.subtitle}>
            Help K–10 students learn for free. Earn verified volunteer hours. Make a genuine community impact.
          </p>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.loginPrompt}>
            <div className={styles.loginPromptIcon} aria-hidden="true">🔐</div>
            <h2>Create a free account to apply</h2>
            <p>
              You need a Learnivia account to submit your volunteer application and upload your academic report card. It takes less than a minute and is completely free.
            </p>
            <div className={styles.loginActions}>
              <Link href="/signup?role=tutor" className={styles.submitBtn}>
                Sign Up as a Volunteer Tutor →
              </Link>
            </div>
            <p className={styles.loginNote}>
              Already have an account? <Link href="/signin?callbackUrl=/apply" style={{ color: "#0E8345", fontWeight: 700 }}>Sign in here</Link>.
            </p>
          </div>

          <div className={styles.benefitsList}>
            <h3>What volunteer tutors get on Learnivia</h3>
            <ul>
              <li>✓ Verified record of volunteer service hours</li>
              <li>✓ Official downloadable transcript for NHS, school counselors &amp; portfolios</li>
              <li>✓ Complete schedule freedom — you set your own availability</li>
              <li>✓ Free training in safeguarding and online pedagogy</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  // Check if this user has already submitted or initiated an application
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      subjects: true,
      gradeLevels: true,
    },
  });

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/become-a-tutor.png" alt="" width={120} height={150} className={styles.mascotImg} />
        <h1 className={styles.title}>
          {tutorProfile ? "Your Volunteer Tutor Application" : "Become a Volunteer Tutor"}
        </h1>
        <p className={styles.subtitle}>
          {tutorProfile
            ? "Manage your credentials, update your subjects, and view your review status."
            : "Share what you know with K–10 learners. Complete your application below to get started."}
        </p>
      </div>

      <div className={styles.formContainer}>
        <ApplyFormClient user={session.user} existingProfile={tutorProfile} />
      </div>
    </main>
  );
}
