"use client";

import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  Clock,
  Compass,
  GraduationCap,
  CalendarCheck,
  Video,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import styles from "./dashboard.module.css";
import { ROUTES } from "@/lib/routes";

interface NextActionPanelProps {
  isNewLearner: boolean;
  guardianConsentPending: boolean;
  emailUnverified: boolean;
  isApprovedTutor: boolean;
  isPendingTutor?: boolean;
  isTrainingPending?: boolean;
  canApplyTutor?: boolean;
  hasUpcomingSession: boolean;
  nextSession?: {
    id: string;
    subject: string;
    startTime: string | Date;
    tutorName: string;
    meetingUrl?: string | null;
  } | null;
  hasCompletedSession: boolean;
  lastCompletedSession?: {
    id: string;
    subject: string;
    tutorName: string;
  } | null;
}

export function NextActionPanel({
  isNewLearner,
  guardianConsentPending,
  emailUnverified,
  isApprovedTutor,
  isPendingTutor = false,
  isTrainingPending = false,
  canApplyTutor = false,
  hasUpcomingSession,
  nextSession,
  hasCompletedSession,
  lastCompletedSession,
}: NextActionPanelProps) {
  // 1. New Learner / Guardian Consent / Verification Priority State
  if (guardianConsentPending) {
    return (
      <aside className={`${styles.nextActionPanel} ${styles.nextActionWarning}`} aria-label="Action required">
        <div className={styles.nextActionContent}>
          <div className={`${styles.nextActionIcon} ${styles.nextActionIconWarning}`}>
            <AlertCircle size={20} />
          </div>
          <div className={styles.nextActionBody}>
            <span className={`${styles.nextActionTag} ${styles.nextActionTagWarning}`}>
              Guardian Consent Required
            </span>
            <h2 className={styles.nextActionTitle}>Consent invitation sent to your parent or guardian</h2>
            <p className={styles.nextActionDesc}>
              Under Learnivia child safeguarding policies, minor learners require guardian confirmation before scheduling 1-on-1 tutoring sessions.
            </p>
          </div>
        </div>
        <Link href={ROUTES.safety} className={styles.nextActionBtn}>
          Safety Standards <ArrowRight size={14} />
        </Link>
      </aside>
    );
  }

  if (emailUnverified) {
    return (
      <aside className={`${styles.nextActionPanel} ${styles.nextActionWarning}`} aria-label="Action required">
        <div className={styles.nextActionContent}>
          <div className={`${styles.nextActionIcon} ${styles.nextActionIconWarning}`}>
            <Clock size={20} />
          </div>
          <div className={styles.nextActionBody}>
            <span className={`${styles.nextActionTag} ${styles.nextActionTagWarning}`}>
              Email Verification
            </span>
            <h2 className={styles.nextActionTitle}>Please verify your email address</h2>
            <p className={styles.nextActionDesc}>
              Confirming your email address ensures you receive session notifications, Zoom room links, and calendar invites.
            </p>
          </div>
        </div>
        <Link href="/verify-email" className={styles.nextActionBtn}>
          Verify Account <ArrowRight size={14} />
        </Link>
      </aside>
    );
  }

  if (isNewLearner) {
    return (
      <aside className={styles.nextActionPanel} aria-label="Next recommended action">
        <div className={styles.nextActionContent}>
          <div className={styles.nextActionIcon}>
            <GraduationCap size={20} />
          </div>
          <div className={styles.nextActionBody}>
            <span className={styles.nextActionTag}>Onboarding</span>
            <h2 className={styles.nextActionTitle}>Complete your student profile</h2>
            <p className={styles.nextActionDesc}>
              Tell us your grade level and preferred learning topics so our volunteer tutors can prepare personalized materials for your sessions.
            </p>
          </div>
        </div>
        <Link href={ROUTES.learner.onboarding} className={styles.nextActionBtn}>
          Complete Setup <ArrowRight size={14} />
        </Link>
      </aside>
    );
  }

  // 2. Upcoming Session State
  if (hasUpcomingSession && nextSession) {
    return (
      <aside className={styles.nextActionPanel} aria-label="Upcoming tutoring session">
        <div className={styles.nextActionContent}>
          <div className={styles.nextActionIcon}>
            <Video size={20} />
          </div>
          <div className={styles.nextActionBody}>
            <span className={styles.nextActionTag}>Upcoming Tutoring Session</span>
            <h2 className={styles.nextActionTitle}>
              Prepare for {nextSession.subject} with {nextSession.tutorName}
            </h2>
            <p className={styles.nextActionDesc}>
              Your session is confirmed. Review your questions and join the verified Zoom waiting room a few minutes before start time.
            </p>
          </div>
        </div>
        {nextSession.meetingUrl ? (
          <a
            href={nextSession.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.nextActionBtn}
          >
            Join Waiting Room <ArrowRight size={14} />
          </a>
        ) : (
          <Link href={`/sessions/${nextSession.id}`} className={styles.nextActionBtn}>
            View Session Details <ArrowRight size={14} />
          </Link>
        )}
      </aside>
    );
  }

  // 3. Tutor Training Gate State
  if (isTrainingPending) {
    return (
      <aside className={styles.nextActionPanel} aria-label="Tutor training required">
        <div className={styles.nextActionContent}>
          <div className={styles.nextActionIcon} style={{ background: "#FEF3C7", color: "#92400E" }}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.nextActionBody}>
            <span className={`${styles.nextActionTag} ${styles.nextActionTagWarning}`}>
              Safeguarding Training Required
            </span>
            <h2 className={styles.nextActionTitle}>Complete mandatory tutor training</h2>
            <p className={styles.nextActionDesc}>
              Your volunteer tutor application has been approved! Complete all 5 short safeguarding and mentorship modules to unlock session hosting and your full Tutor Workspace.
            </p>
          </div>
        </div>
        <Link href={ROUTES.tutor.training} className={styles.nextActionBtn}>
          Complete Training <ArrowRight size={14} />
        </Link>
      </aside>
    );
  }

  // 4. Tutor Application Pending State
  if (isPendingTutor) {
    return (
      <aside className={styles.nextActionPanel} aria-label="Tutor application status">
        <div className={styles.nextActionContent}>
          <div className={styles.nextActionIcon} style={{ background: "#FEF3C7", color: "#92400E" }}>
            <Clock size={20} />
          </div>
          <div className={styles.nextActionBody}>
            <span className={`${styles.nextActionTag} ${styles.nextActionTagWarning}`}>
              Application Under Review
            </span>
            <h2 className={styles.nextActionTitle}>Tutor application received</h2>
            <p className={styles.nextActionDesc}>
              Our academic board is reviewing your volunteer tutor application. In the meantime, you can start reviewing the 5 safeguarding and mentorship training modules.
            </p>
          </div>
        </div>
        <Link href={ROUTES.tutor.training} className={styles.nextActionBtn}>
          Preview Training <ArrowRight size={14} />
        </Link>
      </aside>
    );
  }

  // 5. Approved & Trained Tutor Context State
  if (isApprovedTutor) {
    return (
      <aside className={styles.nextActionPanel} aria-label="Volunteer tutor status">
        <div className={styles.nextActionContent}>
          <div className={styles.nextActionIcon}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.nextActionBody}>
            <span className={styles.nextActionTag}>Tutor Workspace</span>
            <h2 className={styles.nextActionTitle}>Your volunteer tutor profile is active</h2>
            <p className={styles.nextActionDesc}>
              Open your Tutor Workspace to update your weekly availability, host small-group workshops, and track verified service hours.
            </p>
          </div>
        </div>
        <Link href={ROUTES.tutor.home} className={styles.nextActionBtn}>
          Open Tutor Workspace <ArrowRight size={14} />
        </Link>
      </aside>
    );
  }

  // 4. Completed Session State
  if (hasCompletedSession && lastCompletedSession) {
    return (
      <aside className={styles.nextActionPanel} aria-label="Recent session completed">
        <div className={styles.nextActionContent}>
          <div className={styles.nextActionIcon}>
            <CalendarCheck size={20} />
          </div>
          <div className={styles.nextActionBody}>
            <span className={styles.nextActionTag}>Session Completed</span>
            <h2 className={styles.nextActionTitle}>
              Great work in {lastCompletedSession.subject}
            </h2>
            <p className={styles.nextActionDesc}>
              You finished your peer session with {lastCompletedSession.tutorName}. Schedule your next 1-on-1 check-in or submit a question to homework help.
            </p>
          </div>
        </div>
        <Link href={ROUTES.find} className={styles.nextActionBtn}>
          Book Next Session <ArrowRight size={14} />
        </Link>
      </aside>
    );
  }

  // 5. Default Active State: No booked session
  return (
    <aside className={styles.nextActionPanel} aria-label="Get started with peer tutoring">
      <div className={styles.nextActionContent}>
        <div className={styles.nextActionIcon}>
          <Compass size={20} />
        </div>
        <div className={styles.nextActionBody}>
          <span className={styles.nextActionTag}>Start Learning</span>
          <h2 className={styles.nextActionTitle}>Find a verified volunteer tutor</h2>
          <p className={styles.nextActionDesc}>
            Connect 1-on-1 with student tutors across Mathematics, Sciences, and Humanities for free homework reviews and exam prep.
          </p>
        </div>
      </div>
      <Link href={ROUTES.find} className={styles.nextActionBtn}>
        Find a Tutor <ArrowRight size={14} />
      </Link>
    </aside>
  );
}
