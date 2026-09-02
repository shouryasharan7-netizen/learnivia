"use client";

import { useState, useEffect, useTransition } from "react";
import { createWorkshop } from "@/app/actions/workshops";
import styles from "./page.module.css";

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

    // Convert local date/time into exact UTC ISO string in the client's browser
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

      // Inject exact UTC ISO strings into FormData
      formData.set("startUtc", startLocal.toISOString());
      formData.set("endUtc", endLocal.toISOString());
      formData.set("userTimezone", userTz);

      if (linkType === "custom" && customUrl.trim()) {
        formData.set("customMeetingUrl", customUrl.trim());
      }

      startTransition(async () => {
        try {
          await createWorkshop(formData);
          setSuccessMsg("🎉 Session published successfully! Your live room is ready to host.");
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
    <form onSubmit={handleSubmit} className={styles.workshopForm} style={{ borderTop: "none", padding: "0.5rem 0 0" }}>
      {errorMsg && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "0.75rem 1rem", color: "#991B1B", fontSize: "0.875rem", marginBottom: "1rem" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: "0.75rem 1rem", color: "#166534", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {successMsg}
        </div>
      )}

      <div className={styles.formRow}>
        <div style={{ flex: 2 }}>
          <label className={styles.inputLabel}>Workshop Title *</label>
          <input type="text" name="title" placeholder="e.g. SAT Math: Geometry & Circles Bootcamp" required className={styles.textInput} />
        </div>
        <div style={{ flex: 1.2 }}>
          <label className={styles.inputLabel}>Subject *</label>
          <select name="subject" required className={styles.selectInput}>
            <option value="SAT Prep">SAT Prep</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science (Bio / Chem / Physics)</option>
            <option value="College Admissions">College Admissions</option>
            <option value="Reading and Writing">Reading and Writing</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Homework Help">Homework Help</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label className={styles.inputLabel}>Grade Level *</label>
          <select name="grade" required className={styles.selectInput}>
            <option value="High School">High School</option>
            <option value="Middle School">Middle School</option>
            <option value="College Prep">College Prep</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>
      </div>

      <div>
        <label className={styles.inputLabel}>Session Description &amp; Objectives *</label>
        <textarea name="description" rows={2} placeholder="What topics will you cover? (e.g. We will walk through practice problems and answer live questions)" required className={styles.textareaInput} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.5rem 0", background: "#F1F5F9", padding: "0.5rem 0.85rem", borderRadius: 8, fontSize: "0.8125rem", color: "#475569" }}>
        <span>🌐 Scheduling in your local timezone: <strong style={{ color: "#0E8345" }}>{userTz}</strong></span>
        <span>Times will adjust automatically for learners worldwide</span>
      </div>

      <div className={styles.formRow}>
        <div>
          <label className={styles.inputLabel}>Date *</label>
          <input type="date" name="date" defaultValue={defaultDate} required className={styles.textInput} />
        </div>
        <div>
          <label className={styles.inputLabel}>Start Time *</label>
          <input type="time" name="startTime" defaultValue={defaultStart} required className={styles.textInput} />
        </div>
        <div>
          <label className={styles.inputLabel}>End Time *</label>
          <input type="time" name="endTime" defaultValue={defaultEnd} required className={styles.textInput} />
        </div>
        <div>
          <label className={styles.inputLabel}>Max Capacity</label>
          <input type="number" name="maxCapacity" defaultValue={12} min={2} max={30} className={styles.textInput} />
        </div>
      </div>

      {/* Meeting Room Options */}
      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "0.85rem 1rem", marginTop: "0.5rem" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>
          🎥 Meeting Room Setup
        </div>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
            <input
              type="radio"
              name="meetingOption"
              checked={linkType === "auto"}
              onChange={() => setLinkType("auto")}
            />
            <span><strong>Automatic Zoom Room</strong> (Verified Zoom meeting with instant host launch)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
            <input
              type="radio"
              name="meetingOption"
              checked={linkType === "custom"}
              onChange={() => setLinkType("custom")}
            />
            <span><strong>Custom Link</strong> (Paste your personal Zoom PMI or Google Meet)</span>
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
              required={linkType === "custom"}
            />
            <span style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.25rem", display: "block" }}>
              Students and tutors will join your personal Zoom or Google Meet room directly.
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", flexWrap: "wrap", gap: "1rem" }}>
        <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>
          ✓ Meeting room links are configured to start immediately with zero waiting room delay.
        </span>
        <button type="submit" disabled={isPending} className={styles.primaryBtn}>
          {isPending ? "Publishing Session..." : "Publish Session to Directory 🚀"}
        </button>
      </div>
    </form>
  );
}
