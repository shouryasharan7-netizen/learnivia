"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import RegistrationModal from "./RegistrationModal";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface Props {
  workshopId: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  seatsLeft: number;
  tutorName: string;
  tutorInitials: string;
  isLive?: boolean;
  joinUrl?: string | null;
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
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (isLive && joinUrl) {
      return (
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.registerBtn}
        >
          Join Live Zoom
        </a>
      );
    }
    return (
      <div className={styles.registeredState}>
        <CheckCircle2 size={18} />
        Registered
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
        + Register
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
