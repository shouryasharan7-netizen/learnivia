import { auth } from "@/auth";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ApplyFormClient from "./ApplyFormClient";

export const metadata: Metadata = {
  title: "Volunteer Tutor Application & Academic Credentials | Learnivia",
  description:
    "Apply to become a volunteer tutor on Learnivia or submit your academic report card and scores for review.",
};

export default async function ApplyPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerMascotWrap}>
            <Image
              src="/images/become-a-tutor.png"
              alt="Become a Learnivia volunteer tutor"
              width={130}
              height={160}
              className={styles.mascotImg}
              priority
            />
          </div>
          <div className={styles.scopeBadge}>
            <span>Volunteer Mentorship Program • K-12 &amp; Standardized Test Scope</span>
          </div>
          <h1 className={styles.title}>Become a Volunteer Tutor</h1>
          <p className={styles.subtitle}>
            Help K-12 students and test prep candidates learn for free. Earn certified volunteer service hours,
            build leadership credentials, and make a genuine community impact.
          </p>

          <div className={styles.heroPerksRow}>
            <div className={styles.heroPerkPill}>
              <span>⏱️ Flexible Hours (1-3 hrs/wk)</span>
            </div>
            <div className={styles.heroPerkPill}>
              <span>📜 Certified Service Transcript</span>
            </div>
            <div className={styles.heroPerkPill}>
              <span>🎓 College &amp; CV Distinction</span>
            </div>
            <div className={styles.heroPerkPill}>
              <span>🛡️ 100% Free Tutor Training</span>
            </div>
          </div>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.loginPrompt}>
            <div className={styles.loginPromptIcon} aria-hidden="true">
              <Lock size={30} />
            </div>
            <h2>Create a free account to apply</h2>
            <p>
              You need a Learnivia account to submit your volunteer application
              and upload your academic report card. It takes less than a minute
              and is completely free.
            </p>
            <div className={styles.loginActions}>
              <Link href="/signup?role=tutor" className={styles.submitBtn}>
                Sign Up as a Volunteer Tutor <ArrowRight size={16} />
              </Link>
            </div>
            <p className={styles.loginNote}>
              Already have an account?{" "}
              <Link href="/signin?callbackUrl=/apply" className={styles.signinInlineLink}>
                Sign in here
              </Link>
              .
            </p>
          </div>

          <div className={styles.benefitsList}>
            <h3>What Volunteer Tutors Get on Learnivia</h3>
            <ul className={styles.benefitsUl}>
              <li>
                <CheckCircle2 size={18} color="#1b4d3e" style={{ flexShrink: 0 }} />
                <span><strong>Official Verified Service Records:</strong> Downloadable PDF transcripts for high school counselors, honor societies, and scholarship boards.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="#1b4d3e" style={{ flexShrink: 0 }} />
                <span><strong>Complete Scheduling Autonomy:</strong> Host group workshops or 1-on-1 sessions on your own calendar availability.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="#1b4d3e" style={{ flexShrink: 0 }} />
                <span><strong>Specialized Teaching Tracks:</strong> Teach core K-12 academics or high-demand test prep (SAT, ACT, AP, TOEFL, IELTS).</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="#1b4d3e" style={{ flexShrink: 0 }} />
                <span><strong>Free Certified Pedagogical Training:</strong> 5 comprehensive modules on child safety, active listening, and online workshop facilitation.</span>
              </li>
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
        <div className={styles.headerMascotWrap}>
          <Image
            src="/images/become-a-tutor.png"
            alt="Learnivia Volunteer Mascot"
            width={120}
            height={150}
            className={styles.mascotImg}
            priority
          />
        </div>
        <div className={styles.scopeBadge}>
          <span>Verified Volunteer Portal</span>
        </div>
        <h1 className={styles.title}>
          {tutorProfile
            ? "Your Volunteer Tutor Application"
            : "Become a Volunteer Tutor"}
        </h1>
        <p className={styles.subtitle}>
          {tutorProfile
            ? "Manage your credentials, update your subjects, and view your review status."
            : "Share what you know with K-12 and standardized test prep learners. Complete your application below to get started."}
        </p>

        {/* 4-Step Visual Progress Bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressStep}>
            <div className={`${styles.progressDot} ${styles.progressDotActive}`}>1</div>
            <span>Personal</span>
          </div>
          <div className={`${styles.progressLine} ${styles.progressLineActive}`} />
          <div className={styles.progressStep}>
            <div className={`${styles.progressDot} ${styles.progressDotActive}`}>2</div>
            <span>Academics</span>
          </div>
          <div className={`${styles.progressLine} ${styles.progressLineActive}`} />
          <div className={styles.progressStep}>
            <div className={`${styles.progressDot} ${styles.progressDotActive}`}>3</div>
            <span>Subjects</span>
          </div>
          <div className={`${styles.progressLine} ${styles.progressLineActive}`} />
          <div className={styles.progressStep}>
            <div className={`${styles.progressDot} ${styles.progressDotActive}`}>4</div>
            <span>Safety Agreement</span>
          </div>
        </div>
      </div>

      <div className={styles.formContainer}>
        <ApplyFormClient user={session.user} existingProfile={tutorProfile} />
      </div>
    </main>
  );
}
