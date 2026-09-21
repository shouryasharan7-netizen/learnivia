"use client";

import React, { useState, useEffect, useTransition } from "react";
import { createWorkshop } from "@/app/actions/workshops";
import styles from "./page.module.css";
import {
  AlertCircle,
  CheckCircle2,
  Video,
  Globe,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

export function ScheduleWorkshopForm() {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Timezone state
  const [userTz, setUserTz] = useState<string>("Local Time");
  const [defaultDate, setDefaultDate] = useState<string>("");
  const [defaultStart, setDefaultStart] = useState<string>("16:00");
  const [defaultEnd, setDefaultEnd] = useState<string>("17:00");

  // Custom link toggle
  const [linkType, setLinkType] = useState<"auto" | "custom">("auto");
  const [customUrl, setCustomUrl] = useState<string>("");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTz(tz);

      const now = new Date();
      // Format YYYY-MM-DD in local time
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      setDefaultDate(`${year}-${month}-${day}`);

      // Next 15-minute slot
      const nextMin = Math.ceil((now.getMinutes() + 5) / 15) * 15;
      now.setMinutes(nextMin, 0, 0);
      const startH = String(now.getHours()).padStart(2, "0");
      const startM = String(now.getMinutes()).padStart(2, "0");
      setDefaultStart(`${startH}:${startM}`);

      now.setHours(now.getHours() + 1);
      const endH = String(now.getHours()).padStart(2, "0");
      const endM = String(now.getMinutes()).padStart(2, "0");
      setDefaultEnd(`${endH}:${endM}`);
    } catch {
      // Fallback
    }
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    if (!date || !startTime || !endTime) {
      setErrorMsg("Please fill in all date and time fields.");
      return;
    }

    try {
      const [y, m, d] = date.split("-").map(Number);
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      const startLocal = new Date(y, m - 1, d, sh, sm, 0, 0);
      const endLocal = new Date(y, m - 1, d, eh, em, 0, 0);

      if (isNaN(startLocal.getTime()) || isNaN(endLocal.getTime())) {
        setErrorMsg("Invalid date or time selected.");
        return;
      }

      if (endLocal.getTime() <= startLocal.getTime()) {
        setErrorMsg("End time must be after start time.");
        return;
      }

      formData.set("startUtc", startLocal.toISOString());
      formData.set("endUtc", endLocal.toISOString());
      formData.set("userTimezone", userTz);

      if (linkType === "custom" && customUrl.trim()) {
        formData.set("customMeetingUrl", customUrl.trim());
      }

      startTransition(async () => {
        try {
          await createWorkshop(formData);
          setSuccessMsg("Session published successfully. It is now open for learner enrollments.");
          form.reset();
        } catch (err: any) {
          setErrorMsg(err?.message || "Failed to schedule workshop. Please check your details.");
        }
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to parse schedule time.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {errorMsg && (
        <div
          role="alert"
          style={{
            background: "#FEF2F2",
            border: "1px solid #FCA5A5",
            borderRadius: "var(--wa-radius-sm)",
            padding: "0.75rem 1rem",
            color: "#991B1B",
            fontSize: "0.8125rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <AlertCircle size={16} aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          style={{
            background: "var(--wa-green-light)",
            border: "1px solid var(--wa-border)",
            borderRadius: "var(--wa-radius-sm)",
            padding: "0.75rem 1rem",
            color: "var(--wa-green)",
            fontSize: "0.8125rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr", gap: "0.75rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>
            Workshop Title *
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Grade 6 Algebra: Variables & Expressions"
            required
            className={styles.textInput}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>
            Subject *
          </label>
          <select name="subject" required className={styles.selectInput} style={{ width: "100%" }}>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science (Bio / Chem / Physics)</option>
            <option value="Reading and Writing">Reading &amp; Writing</option>
            <option value="Social Studies">Social Studies / History</option>
            <option value="Computer Science">Computer Science &amp; Coding</option>
            <option value="Homework Help">Homework Help</option>
            <option value="Learning Support">Learning Support &amp; Study Skills</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>
            Grade Level *
          </label>
          <select name="grade" required className={styles.selectInput} style={{ width: "100%" }}>
            <option value="All Levels">All K-10 Levels</option>
            <option value="Early Elementary (K-2)">Early Elementary (K-2)</option>
            <option value="Elementary (3-5)">Elementary (Grades 3-5)</option>
            <option value="Middle School (6-8)">Middle School (Grades 6-8)</option>
            <option value="Early High School (9-10)">Early High School (Grades 9-10)</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>
          Session Description &amp; Objectives *
        </label>
        <textarea
          name="description"
          rows={2}
          placeholder="What topics will you cover? (e.g. We will walk through practice problems and answer live questions)"
          required
          className={styles.textareaInput}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--wa-cream)",
          border: "1px solid var(--wa-border)",
          padding: "0.5rem 0.85rem",
          borderRadius: "var(--wa-radius-sm)",
          fontSize: "0.8125rem",
          color: "var(--wa-muted)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <Globe size={14} aria-hidden="true" />
          Timezone: <strong style={{ color: "var(--wa-ink)" }}>{userTz}</strong>
        </span>
        <span>Times adjust automatically for learners worldwide</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>
            Date *
          </label>
          <input type="date" name="date" defaultValue={defaultDate} required className={styles.textInput} style={{ width: "100%" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>
            Start Time *
          </label>
          <input type="time" name="startTime" defaultValue={defaultStart} required className={styles.textInput} style={{ width: "100%" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>
            End Time *
          </label>
          <input type="time" name="endTime" defaultValue={defaultEnd} required className={styles.textInput} style={{ width: "100%" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>
            Max Capacity
          </label>
          <input type="number" name="maxCapacity" defaultValue={12} min={2} max={30} className={styles.textInput} style={{ width: "100%" }} />
        </div>
      </div>

      {/* Meeting Room Options */}
      <div
        style={{
          background: "var(--wa-cream)",
          border: "1px solid var(--wa-border)",
          borderRadius: "var(--wa-radius-sm)",
          padding: "0.85rem 1rem",
        }}
      >
        <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--wa-ink)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <Video size={15} aria-hidden="true" />
          <span>Meeting Room Configuration</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", color: "var(--wa-text)", cursor: "pointer" }}>
            <input
              type="radio"
              name="meetingOption"
              checked={linkType === "auto"}
              onChange={() => setLinkType("auto")}
            />
            <span><strong>Automatic Zoom Room</strong> (Verified Zoom meeting with instant host launch)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", color: "var(--wa-text)", cursor: "pointer" }}>
            <input
              type="radio"
              name="meetingOption"
              checked={linkType === "custom"}
              onChange={() => setLinkType("custom")}
            />
            <span><strong>Custom Link</strong> (Personal Zoom PMI or Google Meet)</span>
          </label>
        </div>

        {linkType === "custom" && (
          <div style={{ marginTop: "0.5rem" }}>
            <input
              type="url"
              placeholder="https://zoom.us/j/your-id or https://meet.google.com/xyz-abc"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className={styles.textInput}
              style={{ width: "100%" }}
              required={linkType === "custom"}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--wa-muted)", marginTop: "0.25rem", display: "block" }}>
              Students and tutors will join your personal Zoom or Google Meet room directly.
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--wa-muted)" }}>
          Meeting room links are configured to start immediately without waiting room delays.
        </span>
        <button type="submit" disabled={isPending} className={styles.primaryBtn}>
          <PlusCircle size={15} aria-hidden="true" />
          <span>{isPending ? "Publishing Session..." : "Publish Session to Directory"}</span>
        </button>
      </div>
    </form>
  );
}
