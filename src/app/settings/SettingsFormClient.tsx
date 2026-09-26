"use client";

import { useState } from "react";
import { updateSettings } from "./actions";
import {
  CheckCircle2,
  AlertTriangle,
  Save,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import styles from "./page.module.css";

interface SettingsFormClientProps {
  user: any;
}

export default function SettingsFormClient({ user }: SettingsFormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);

    if (result.success) {
      setSuccessMsg("Settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(result.error || "Failed to update settings.");
    }

    setIsSubmitting(false);
  };

  const isTutor = !!user.tutorProfile;

  return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      {errorMsg && (
        <div className={styles.errorAlert}>
          <AlertTriangle size={18} />
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className={styles.successAlert}>
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {/* Account Basics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Information</h2>

        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input
            type="email"
            value={user.email || ""}
            disabled
            className={styles.disabledInput}
          />
          <span className={styles.helpText}>
            Email address cannot be changed currently.
          </span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Display Name</label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name || ""}
            className={styles.input}
            placeholder="How you want to be known on Learnivia"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={user.timezone || "America/New_York"}
            className={styles.input}
          >
            <optgroup label="Americas">
              <option value="America/New_York">
                Eastern Time (US & Canada)
              </option>
              <option value="America/Chicago">
                Central Time (US & Canada)
              </option>
              <option value="America/Denver">
                Mountain Time (US & Canada)
              </option>
              <option value="America/Los_Angeles">
                Pacific Time (US & Canada)
              </option>
            </optgroup>
            <optgroup label="Europe & Africa">
              <option value="Europe/London">London (GMT/BST)</option>
              <option value="Europe/Paris">Central Europe (CET/CEST)</option>
            </optgroup>
            <optgroup label="Asia & Pacific">
              <option value="Asia/Dubai">Gulf Standard Time</option>
              <option value="Asia/Kolkata">India Standard Time</option>
              <option value="Asia/Singapore">Singapore / Malaysia</option>
              <option value="Asia/Tokyo">Japan Standard Time</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </optgroup>
          </select>
          <span className={styles.helpText}>
            Your session times will be automatically converted to this timezone.
          </span>
        </div>
      </div>

      {/* Learner Profile */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Learner Profile</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div className={styles.formGroup}>
            <label htmlFor="grade">Current Grade Level</label>
            <select
              id="grade"
              name="grade"
              defaultValue={user.grade || ""}
              className={styles.input}
            >
              <option value="">Prefer not to say</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="primaryGoal">Primary Goal</label>
            <select
              id="primaryGoal"
              name="primaryGoal"
              defaultValue={user.primaryGoal || ""}
              className={styles.input}
            >
              <option value="">Select a goal</option>
              <option value="Improve Grades">Improve Grades</option>
              <option value="Homework Help">Homework Help</option>
              <option value="Test Prep">Test Preparation</option>
              <option value="Learn New Skills">Learn New Skills</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tutor Profile (Only if they are a tutor) */}
      {isTutor && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tutor Public Profile</h2>

          <div className={styles.formGroup}>
            <label htmlFor="school">School / Affiliation</label>
            <input
              id="school"
              name="school"
              type="text"
              defaultValue={user.tutorProfile.school || ""}
              className={styles.input}
              placeholder="e.g. Centennial High School"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio">About Me (Bio)</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={user.tutorProfile.bio || ""}
              className={styles.input}
              style={{ resize: "vertical" }}
              placeholder="Tell students about your teaching style, experience, and hobbies."
            />
            <span className={styles.helpText}>
              This appears on your public tutor profile page.
            </span>
          </div>
        </div>
      )}

      {/* Submit */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: "1rem",
        }}
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? (
            <Loader2 size={16} className={styles.spin} />
          ) : (
            <Save size={16} />
          )}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
