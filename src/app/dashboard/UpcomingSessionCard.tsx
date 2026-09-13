"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Video, ArrowRight, Copy, Check } from "lucide-react";
import styles from "./dashboard.module.css";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
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
        <EmptyState
          icon={Calendar}
          title="No upcoming sessions booked"
          description="You don't have any tutoring sessions scheduled. Search our approved volunteer tutors or explore interactive workshops."
          action={
            <Link href={ROUTES.find} className={styles.joinBtn}>
              Find a Tutor
            </Link>
          }
          secondaryAction={
            <Link href={ROUTES.sessions} className={styles.secondaryBtn}>
              Browse Sessions
            </Link>
          }
        />
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
              <p className={styles.sessionTutor}>with {displayTutor}</p>
            </div>
          </div>
          <StatusBadge status="confirmed" label="Confirmed" />
        </div>

        <div className={styles.sessionDetailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Date & Time</span>
            <span className={styles.detailValue}>
              <FormattedDateTime date={session.startTime} userTimezone={userTimezone} />
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Meeting Format</span>
            <span className={styles.detailValue}>1-on-1 Zoom Room (Waiting Room Enabled)</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Safeguarding</span>
            <span className={styles.detailValue}>Verified Volunteer Tutor</span>
          </div>
        </div>

        <footer className={styles.sessionCardFooter}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            {cleanJoinUrl ? (
              <>
                <a
                  href={cleanJoinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.joinBtn}
                >
                  <Video size={16} /> Join Zoom Room
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={styles.secondaryBtn}
                  title="Copy Zoom link to clipboard"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                >
                  {copiedLink ? <Check size={14} color="#166534" /> : <Copy size={14} />}
                  <span>{copiedLink ? "Link Copied" : "Copy Zoom Link"}</span>
                </button>
              </>
            ) : (
              <Link href={`/sessions/${session.id}`} className={styles.joinBtn}>
                <Video size={16} /> Session Room Details
              </Link>
            )}
            <Link href={`/sessions/${session.id}`} className={styles.secondaryBtn}>
              Preparation Notes
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className={styles.secondaryBtn}
            style={{ color: "var(--wa-error)", borderColor: "var(--wa-border)" }}
          >
            Cancel Session
          </button>
        </footer>
      </article>

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Cancel Tutoring Session"
        description="Are you sure you want to cancel this tutoring session? We'll notify your volunteer tutor immediately so they can release the slot to other learners."
        confirmLabel={isCancelling ? "Cancelling..." : "Confirm Cancellation"}
        cancelLabel="Keep Session"
        isDestructive={true}
        onConfirm={handleCancel}
        onCancel={() => setDialogOpen(false)}
      />
    </section>
  );
}
