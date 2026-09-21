"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { confirmStudentAttendance } from "@/app/actions/sessions";
import { toast } from "sonner";
import styles from "./attendance-prompt.module.css";

interface PendingAttendanceBooking {
  id: string;
  subject: string;
  startTime: Date | string;
  tutorName: string;
}

interface StudentAttendancePromptProps {
  pendingBookings: PendingAttendanceBooking[];
}

export function StudentAttendancePrompt({ pendingBookings }: StudentAttendancePromptProps) {
  const [list, setList] = useState<PendingAttendanceBooking[]>(pendingBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (list.length === 0) return null;

  const handleConfirm = async (bookingId: string, attended: boolean) => {
    setLoadingId(bookingId);
    try {
      const res = await confirmStudentAttendance(bookingId, attended);
      if (res.success) {
        if (attended) {
          toast.success("Thank you! Your session attendance has been confirmed.");
        } else {
          toast.info("Thank you for letting us know. We have updated your session record.");
        }
        setList((prev) => prev.filter((b) => b.id !== bookingId));
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit attendance confirmation.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.attendanceWrapper}>
      {list.map((booking) => (
        <div key={booking.id} className={styles.attendanceCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconCircle}>
              <CheckCircle2 size={18} className={styles.headerIcon} />
            </div>
            <div className={styles.headerText}>
              <h3 className={styles.title}>
                Did your tutoring session for <strong>{booking.subject}</strong> take place?
              </h3>
              <p className={styles.subtitle}>
                Tutor: <strong>{booking.tutorName}</strong> &bull; Please let us know if you and your tutor met for this lesson so we can keep your learning records up to date.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              disabled={loadingId === booking.id}
              onClick={() => handleConfirm(booking.id, true)}
              className={styles.confirmBtn}
            >
              <CheckCircle2 size={15} />
              <span>{loadingId === booking.id ? "Verifying..." : "Yes, I attended this session"}</span>
            </button>
            <button
              type="button"
              disabled={loadingId === booking.id}
              onClick={() => handleConfirm(booking.id, false)}
              className={styles.declineBtn}
            >
              <XCircle size={15} />
              <span>No, session didn&apos;t happen</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
