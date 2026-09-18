"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Video, ArrowRight, Copy, Check, Sparkles, BookOpen } from "lucide-react";
import styles from "./dashboard.module.css";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { ROUTES } from "@/lib/routes";
import { cancelBooking } from "@/app/actions/sessions";
import { getMeetingUrls } from "@/lib/meetingUrl";
import { toast } from "sonner";

interface UpcomingSession {
  id: string;
  subject: string;
  startTime: string | Date;
  endTime: string | Date;
  zoomLink?: string | null;
  tutor: {
    id: string;
    user: {
      name: string | null;
      image?: string | null;
    };
  };
}

interface UpcomingSessionCardProps {
  session: UpcomingSession | null;
  userTimezone?: string | null;
}

export function UpcomingSessionCard({ session, userTimezone }: UpcomingSessionCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const cleanJoinUrl = session?.zoomLink
    ? getMeetingUrls(session.zoomLink).joinUrl
    : null;

  const handleCopyLink = () => {
    if (cleanJoinUrl) {
      navigator.clipboard.writeText(cleanJoinUrl);
      setCopiedLink(true);
      toast.success("Zoom meeting link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!session) {
    return (
      <section aria-labelledby="upcoming-sessions-heading">
        <div className={styles.sectionHeader}>
          <h2 id="upcoming-sessions-heading" className={styles.sectionTitle}>
            Upcoming Session
          </h2>
          <Link href={ROUTES.sessions} className={styles.sectionLink}>
            All sessions <ArrowRight size={13} />
          </Link>
        </div>

        <div className={styles.emptyDeskSlip}>
          <div className={styles.emptyDeskIcon}>
            <Calendar size={24} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "center" }}>
            <h3 className={styles.emptyDeskTitle}>Your Study Desk is Open</h3>
            <p className={styles.emptyDeskDesc}>
              You have no upcoming tutoring sessions booked. Select a subject below to connect 1-on-1 with an approved peer tutor for free guidance.
            </p>
          </div>

          <div className={styles.subjectFilterRow}>
            <Link href={`${ROUTES.find}?subject=Mathematics`} className={styles.subjectPill}>
              Mathematics
            </Link>
            <Link href={`${ROUTES.find}?subject=Science`} className={styles.subjectPill}>
              Natural Sciences
            </Link>
            <Link href={`${ROUTES.find}?subject=Reading+%26+Writing`} className={styles.subjectPill}>
              Essay & Reading
            </Link>
            <Link href={ROUTES.community} className={styles.subjectPill}>
              Peer Roundtables
            </Link>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href={ROUTES.find} className={styles.joinBtn}>
              <Sparkles size={14} /> Find a Peer Tutor
            </Link>
            <Link href={ROUTES.sessions} className={styles.secondaryBtn}>
              Browse Session Library
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const tutorName = session.tutor.user.name || "Volunteer Tutor";
  const nameParts = tutorName.trim().split(" ");
  const displayTutor =
    nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`
      : tutorName;
  const initials = nameParts.map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const fd = new FormData();
      fd.append("bookingId", session.id);
      fd.append("cancelReason", cancelReason || "Canceled by student from dashboard");
      await cancelBooking(fd);
      toast.success("Session canceled successfully");
      setDialogOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred while canceling");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <section aria-labelledby="upcoming-sessions-heading">
      <div className={styles.sectionHeader}>
        <h2 id="upcoming-sessions-heading" className={styles.sectionTitle}>
          Upcoming Session
        </h2>
        <Link href={ROUTES.sessions} className={styles.sectionLink}>
          All sessions <ArrowRight size={13} />
        </Link>
      </div>

      <article className={styles.sessionCard}>
        <div className={styles.sessionCardHeader}>
          <div className={styles.sessionMetaGroup}>
            <div className={styles.tutorAvatar} aria-hidden="true">
              {initials}
            </div>
            <div>
              <h3 className={styles.sessionSubject}>{session.subject}</h3>
              <p className={styles.sessionTutor}>Mentorship with {displayTutor}</p>
            </div>
          </div>
          <StatusBadge status="confirmed" label="Confirmed Session" />
        </div>

        <div className={styles.sessionDetailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Scheduled Time</span>
            <span className={styles.detailValue}>
              <FormattedDateTime date={session.startTime} userTimezone={userTimezone} />
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Format</span>
            <span className={styles.detailValue}>1-on-1 Zoom Study Room</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Safeguarding</span>
            <span className={styles.detailValue}>Verified Volunteer Tutor</span>
          </div>
        </div>

        <footer className={styles.sessionCardFooter}>
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
            {cleanJoinUrl ? (
              <>
                <a
                  href={cleanJoinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.joinBtn}
                >
                  <Video size={16} /> Enter Zoom Study Room
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={styles.secondaryBtn}
                  title="Copy Zoom link to clipboard"
                >
                  {copiedLink ? <Check size={14} color="var(--wa-success, #1E5A3E)" /> : <Copy size={14} />}
                  <span>{copiedLink ? "Link Copied" : "Copy Zoom Link"}</span>
                </button>
              </>
            ) : (
              <Link href={`/sessions/${session.id}`} className={styles.joinBtn}>
                <Video size={16} /> Session Room Details
              </Link>
            )}
            <Link href={`/sessions/${session.id}`} className={styles.secondaryBtn}>
              <BookOpen size={14} /> Notes
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className={styles.secondaryBtn}
            style={{ color: "var(--wa-error, #9E2A2B)", borderColor: "var(--wa-border, #E6DFD5)" }}
          >
            Cancel Session
          </button>
        </footer>
      </article>

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Cancel Tutoring Session"
        description="Are you sure you want to cancel this tutoring session? We will notify your volunteer tutor immediately so they can release this slot to other learners."
        confirmLabel={isCancelling ? "Cancelling..." : "Confirm Cancellation"}
        cancelLabel="Keep Session"
        isDestructive={true}
        onConfirm={handleCancel}
        onCancel={() => setDialogOpen(false)}
      />
    </section>
  );
}
