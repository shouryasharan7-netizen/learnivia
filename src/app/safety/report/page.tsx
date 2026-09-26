import styles from "./page.module.css";
import { auth } from "@/auth";
import Link from "next/link";
import { submitIncidentReport } from "@/app/actions/reports";
import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a Concern - Safety & Moderation | Learnivia",
  description:
    "Report an incident, safeguarding concern, or inappropriate behavior to the Learnivia safety moderation team.",
};

type Props = {
  searchParams: Promise<{ bookingId?: string; tutorId?: string }>;
};

export default async function ReportConcernPage({ searchParams }: Props) {
  const session = await auth();
  const { bookingId, tutorId } = await searchParams;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1
              className={styles.title}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <ShieldAlert
                size={26}
                style={{ color: "var(--wa-forest)" }}
                aria-hidden="true"
              />
              <span>Report a Safety Concern</span>
            </h1>
            <p className={styles.subtitle}>
              Your safety and trust are our top priorities. All reports are
              confidential and reviewed directly by our safeguarding and
              moderation team within 24 hours.
            </p>
          </div>

          <form action={submitIncidentReport} className={styles.form}>
            {bookingId && (
              <input type="hidden" name="bookingId" value={bookingId} />
            )}
            {tutorId && (
              <input type="hidden" name="reportedUserId" value={tutorId} />
            )}

            <div className={styles.formGroup}>
              <label htmlFor="category">
                What type of concern are you reporting? *
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue="Inappropriate Behavior"
              >
                <option value="Inappropriate Behavior">
                  Inappropriate Language or Behavior
                </option>
                <option value="Harassment or Bullying">
                  Harassment or Bullying
                </option>
                <option value="No-Show or Abandoned Session">
                  Tutor or Student No-Show
                </option>
                <option value="Privacy Violation">
                  Requesting Personal Contact Info / Privacy Concern
                </option>
                <option value="Academic Dishonesty">
                  Cheating or Academic Dishonesty
                </option>
                <option value="Technical Issue">
                  Technical Problem / Suspicious Link
                </option>
                <option value="Other">Other Concern</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Detailed Description *</label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                placeholder="Please describe what happened, including dates, names, or quotes if applicable. The more context you provide, the faster we can investigate."
              />
              <span className={styles.hint}>
                Please provide at least 10 characters with specific details.
              </span>
            </div>

            {!session?.user && (
              <div
                style={{
                  background: "var(--color-bg)",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                }}
              >
                ℹ️ You are submitting this report as an anonymous guest. If you
                would like us to follow up directly with you, you can{" "}
                <Link
                  href="/signin"
                  style={{ color: "var(--color-primary)", fontWeight: 700 }}
                >
                  sign in
                </Link>{" "}
                first.
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>
              Submit Confidential Report
            </button>
          </form>

          <Link href="/safety" className={styles.backLink}>
            ← Back to Safety Guidelines
          </Link>
        </div>
      </div>
    </main>
  );
}
