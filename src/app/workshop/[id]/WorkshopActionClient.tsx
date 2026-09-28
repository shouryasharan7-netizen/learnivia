"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import RegistrationModal from "./RegistrationModal";
import Link from "next/link";
import { CheckCircle2, Calendar, Download } from "lucide-react";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar-sync";

interface Props {
  workshopId: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  seatsLeft: number;
  tutorName: string;
  tutorInitials: string;
  isLive?: boolean;
  joinUrl?: string | null;
  title?: string;
  description?: string;
  startTime?: string | Date;
  endTime?: string | Date;
}

export default function WorkshopActionClient({
  workshopId,
  isEnrolled,
  isLoggedIn,
  seatsLeft,
  tutorName,
  tutorInitials,
  isLive,
  joinUrl,
  title = "Learnivia Workshop",
  description = "",
  startTime,
  endTime,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calParams = {
    title,
    description,
    location: "Learnivia Live Classroom (Zoom)",
    startTime: startTime ? new Date(startTime) : new Date(),
    endTime: endTime ? new Date(endTime) : new Date(Date.now() + 60 * 60 * 1000),
  };

  const googleCalUrl = generateGoogleCalendarUrl(calParams);

  if (!isLoggedIn) {
    return (
      <Link
        href={`/signin?callbackUrl=/workshop/${workshopId}`}
        className={styles.registerBtn}
      >
        Sign In to Register
      </Link>
    );
  }

  if (isEnrolled) {
    return (
      <div className={styles.enrolledActionStack}>
        {isLive && joinUrl ? (
          <a
            href={joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.liveJoinBtn}
          >
            <span className={styles.livePulseDot}></span>
            Join Live Zoom Classroom
          </a>
        ) : (
          <div className={styles.registeredState}>
            <CheckCircle2 size={18} />
            <span>You&apos;re Registered!</span>
          </div>
        )}

        <div className={styles.calendarSyncBox}>
          <p className={styles.calendarSyncTitle}>Sync with your calendar:</p>
          <div className={styles.calendarButtonsRow}>
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.calSyncBtn}
              title="Add this session to Google Calendar"
            >
              <Calendar size={14} />
              <span>Google Calendar</span>
            </a>
            <button
              type="button"
              onClick={() => downloadIcsFile(calParams)}
              className={styles.calSyncBtnSecondary}
              title="Download .ics file for Apple Calendar or Outlook"
            >
              <Download size={14} />
              <span>.ICS File (Apple / Outlook)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (seatsLeft <= 0) {
    return (
      <button disabled className={styles.disabledBtn}>
        Workshop Full
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={styles.registerBtn}
      >
        + Register for Free
      </button>
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workshopId={workshopId}
        tutorName={tutorName}
        tutorInitials={tutorInitials}
      />
    </>
  );
}

