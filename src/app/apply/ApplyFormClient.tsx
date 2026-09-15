"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ClipboardList, BookOpen, AlertTriangle, CheckSquare, Square, Check } from "lucide-react";
import styles from "./page.module.css";
import { submitApplication } from "./actions";

interface ApplyFormClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    timezone?: string | null;
  };
  existingProfile?: {
    id: string;
    status: string;
    school?: string | null;
    bio?: string | null;
    experience?: string | null;
    academicScores?: string | null;
    reportCardUrl?: string | null;
    reportCardName?: string | null;
    reportCardStorageKey?: string | null;
    subjects: { id: string; name: string }[];
    gradeLevels: { id: string; name: string }[];
  } | null;
}

const GRADE_OPTIONS = [
  { value: "kindergarten", label: "Kindergarten (Ages 5–6)" },
  { value: "grade-1-2", label: "Early Elementary (Grades 1–2)" },
  { value: "grade-3-5", label: "Elementary (Grades 3–5)" },
  { value: "grade-6-8", label: "Middle School (Grades 6–8)" },
  { value: "grade-9-10", label: "Early High School (Grades 9–10)" },
];

export default function ApplyFormClient({ user, existingProfile }: ApplyFormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [school, setSchool] = useState(existingProfile?.school || "");
  const [timezone, setTimezone] = useState(user.timezone || "Asia/Kolkata");
  const [academicScores, setAcademicScores] = useState(existingProfile?.academicScores || "");
  const [reportCardLink, setReportCardLink] = useState(
    existingProfile?.reportCardUrl?.startsWith("http") ? existingProfile.reportCardUrl : ""
  );
  const [reportCardFile, setReportCardFile] = useState<File | null>(null);

  // Initial grade levels match
  const initialGrades = GRADE_OPTIONS.filter((g) =>
    existingProfile?.gradeLevels.some((gl) =>
      gl.name.toLowerCase().includes(g.value.replace("-", " ")) ||
      gl.name.toLowerCase().includes(g.label.toLowerCase())
    )
  ).map((g) => g.value);

  const [selectedGrades, setSelectedGrades] = useState<string[]>(
    initialGrades.length > 0 ? initialGrades : ["grade-3-5", "grade-6-8"]
  );

  const [subjects, setSubjects] = useState(
    existingProfile?.subjects.map((s) => s.name).join(", ") || "Mathematics, Science"
  );
  const [bio, setBio] = useState(existingProfile?.bio || "");
  const [experience, setExperience] = useState(existingProfile?.experience || "");

  const [agreedGuidelines, setAgreedGuidelines] = useState(true);
  const [agreedSafeguarding, setAgreedSafeguarding] = useState(true);
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);

  const handleGradeToggle = (val: string) => {
    setSelectedGrades((prev) =>
      prev.includes(val) ? prev.filter((g) => g !== val) : [...prev, val]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) {
        setErrorMsg("File is larger than 4MB. Please upload a smaller file or paste a Google Drive link.");
        e.target.value = "";
        setReportCardFile(null);
        return;
      }
      setErrorMsg("");
      setReportCardFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Real-time client checks
    if (!bio.trim() || bio.trim().length < 20) {
      setErrorMsg("Please write at least 20 characters in your bio describing yourself and your teaching approach.");
      return;
    }

    if (!subjects.trim()) {
      setErrorMsg("Please list the subjects you can teach.");
      return;
    }

    if (selectedGrades.length === 0) {
      setErrorMsg("Please select at least one grade level you can support.");
      return;
    }

    const hasReportCard = Boolean(
      reportCardFile ||
      reportCardLink.trim() ||
      existingProfile?.reportCardStorageKey ||
      existingProfile?.reportCardUrl
    );
    if (!hasReportCard) {
      setErrorMsg("An academic report card or marksheet document is strictly required to sign up as a tutor. Please upload your document or provide a share link.");
      return;
    }

    if (!agreedGuidelines || !agreedSafeguarding || !agreedPrivacy) {
      setErrorMsg("Please acknowledge and agree to the community, safeguarding, and privacy terms.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("bio", bio.trim());
      formData.append("timezone", timezone);
      formData.append("school", school.trim());
      formData.append("experience", experience.trim());
      formData.append("subjects", subjects.trim());
      formData.append("academicScores", academicScores.trim());
      formData.append("reportCardLink", reportCardLink.trim());

      selectedGrades.forEach((g) => {
        formData.append("grades", g);
      });

      if (reportCardFile) {
        formData.append("reportCardFile", reportCardFile);
      }

      const res = await submitApplication(formData);

      if (res && !res.success) {
        setErrorMsg(res.error || "Failed to submit application. Please try again.");
        setIsSubmitting(false);
      } else {
        setIsSuccess(true);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg(err.message || "A network or server error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "2px solid #86EFAC",
          padding: "3rem 2rem",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(14, 131, 69, 0.08)",
          maxWidth: "680px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "rgba(35, 75, 59, 0.1)", color: "var(--color-forest, #234B3B)", margin: "0 auto 1.25rem auto" }}>
          <CheckCircle2 size={36} />
        </div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", margin: "0 0 0.75rem" }}>
          Application Submitted Successfully!
        </h2>
        <p style={{ color: "#475569", fontSize: "1rem", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto 1.75rem" }}>
          Thank you for applying to be a volunteer peer tutor on Learnivia. Our academic moderation team reviews every
          transcript and profile within <strong>24–48 hours</strong>.
        </p>

        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 800, color: "#0D683B", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ArrowRight size={16} /> Next Step: Complete Your Required Training
          </div>
          <p style={{ fontSize: "0.875rem", color: "#166534", margin: 0, lineHeight: 1.5 }}>
            While your credentials are being verified, you can complete the 5 required tutor training modules (safeguarding,
            active listening, and Zoom tools). Once finished, you will be immediately eligible to accept bookings.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/tutor/training"
            style={{
              background: "#0E8345",
              color: "#FFFFFF",
              padding: "0.75rem 1.75rem",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(14, 131, 69, 0.25)",
            }}
          >
            Start Tutor Training →
          </Link>
          <Link
            href="/tutor"
            style={{
              background: "#F8FAFC",
              color: "#334155",
              border: "1px solid #CBD5E1",
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Go to Tutor Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Existing Status Banner */}
      {existingProfile && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "14px",
            padding: "1.25rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ClipboardList size={18} color="var(--color-forest, #234B3B)" />
              <strong style={{ fontSize: "1rem", color: "#0F172A" }}>Application Status:</strong>
              <span
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  backgroundColor:
                    existingProfile.status === "APPROVED"
                      ? "#DCFCE7"
                      : existingProfile.status === "PENDING"
                      ? "#FEF3C7"
                      : "#FEE2E2",
                  color:
                    existingProfile.status === "APPROVED"
                      ? "#15803D"
                      : existingProfile.status === "PENDING"
                      ? "#B45309"
                      : "#B91C1C",
                }}
              >
                {existingProfile.status}
              </span>
            </div>
            <p style={{ margin: "0.25rem 0 0", color: "#64748B", fontSize: "0.825rem" }}>
              {existingProfile.status === "PENDING"
                ? "Your application is currently being reviewed by our academic board. You can update your details below anytime."
                : existingProfile.status === "APPROVED"
                ? "You are an approved volunteer tutor! You can update your profile details and subjects below."
                : "Your application is under review."}
            </p>
          </div>

          <Link
            href="/tutor/training"
            style={{
              background: "#E6F4EA",
              color: "#0E8345",
              padding: "0.45rem 1rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.825rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <BookOpen size={14} /> Tutor Training
          </Link>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1.5px solid #F87171",
            color: "#991B1B",
            padding: "0.85rem 1.25rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 1. Personal Details */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>1. Personal Details</h2>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" value={user.name || "Volunteer Tutor"} disabled className={styles.disabledInput} />
            <span className={styles.fieldHint}>From your account profile</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div className={styles.formGroup}>
              <label htmlFor="school">School / University / Affiliation</label>
              <input
                id="school"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Centennial High School / UC Berkeley"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timezone">Your Timezone *</label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                required
              >
                <optgroup label="Asia & Pacific">
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Dubai">Gulf Standard Time (UAE)</option>
                  <option value="Asia/Singapore">Singapore / Malaysia</option>
                  <option value="Asia/Tokyo">Japan / Korea</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </optgroup>
                <optgroup label="Americas">
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Chicago">Central Time (US)</option>
                  <option value="America/Denver">Mountain Time (US)</option>
                  <option value="America/Los_Angeles">Pacific Time (US)</option>
                  <option value="America/Toronto">Toronto (Eastern)</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Paris / Berlin (CET)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Academic Credentials & Report Card */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>2. Academic Scores &amp; Report Card</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
            Our academic verification team checks report cards or certificates to ensure quality peer tutoring for our learners.
          </p>

          <div className={styles.formGroup}>
            <label htmlFor="academicScores">Academic Results / Scores (CGPA, Marks or GPA) *</label>
            <input
              id="academicScores"
              type="text"
              value={academicScores}
              onChange={(e) => setAcademicScores(e.target.value)}
              placeholder="e.g. Class 10 CGPA: 8.7, or 95% in CBSE / GCSE 9s / GPA 3.9"
              required
            />
            <span className={styles.fieldHint}>Summarize your latest official marks in the subjects you plan to teach</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div className={styles.formGroup}>
              <label htmlFor="reportCardFile">
                Upload Report Card / Marksheet (PDF or Image) <span style={{ color: "var(--wa-error, #dc2626)", fontWeight: 700 }}>* Required</span>
              </label>
              <input
                id="reportCardFile"
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileChange}
                style={{
                  padding: "0.5rem",
                  border: "1px dashed var(--color-border)",
                  borderRadius: "8px",
                  background: "var(--color-cream)",
                }}
              />
              <span className={styles.fieldHint}>
                {reportCardFile
                  ? `Selected: ${reportCardFile.name} (${(reportCardFile.size / 1024).toFixed(0)} KB)`
                  : "PDF, PNG, or JPG (max 4MB)"}
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reportCardLink">Or Provide Document Link (Google Drive / Cloud Share)</label>
              <input
                id="reportCardLink"
                type="url"
                value={reportCardLink}
                onChange={(e) => setReportCardLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
              />
              <span className={styles.fieldHint}>Make sure link sharing is set to 'Anyone with the link can view'</span>
            </div>
          </div>

          {existingProfile?.reportCardUrl && (
            <div style={{ fontSize: "0.85rem", color: "#0D683B", background: "#F0FDF4", padding: "0.6rem 0.9rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Check size={14} /> Previously submitted: <strong>{existingProfile.reportCardName || "Academic Document"}</strong>
            </div>
          )}
        </div>

        {/* 3. Grade Bands & Subjects */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>3. What You'll Teach (K–10)</h2>
          <div className={styles.formGroup}>
            <label>Grade Levels You Can Support *</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.6rem", marginTop: "0.25rem" }}>
              {GRADE_OPTIONS.map((g) => {
                const isSelected = selectedGrades.includes(g.value);
                return (
                  <button
                    type="button"
                    key={g.value}
                    onClick={() => handleGradeToggle(g.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid #0E8345" : "1.5px solid #CBD5E1",
                      background: isSelected ? "#F0FDF4" : "#FFFFFF",
                      color: isSelected ? "#0D683B" : "#334155",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 150ms ease",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      {isSelected ? <CheckSquare size={16} color="var(--color-forest, #234B3B)" /> : <Square size={16} color="#94A3B8" />}
                    </span>
                    <span>{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginTop: "0.5rem" }}>
            <label htmlFor="subjects">Subjects You Can Teach *</label>
            <input
              id="subjects"
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g. Mathematics, Science, Reading & Writing, Social Studies"
              required
            />
            <span className={styles.fieldHint}>Comma-separated list (e.g. Pre-Algebra, Biology, English Grammar)</span>
          </div>
        </div>

        {/* 4. About You */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>4. About You</h2>
          <div className={styles.formGroup}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label htmlFor="bio">Tell students about yourself *</label>
              <span style={{ fontSize: "0.75rem", color: bio.length >= 20 ? "#0E8345" : "#94A3B8" }}>
                {bio.length}/600 characters
              </span>
            </div>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              rows={4}
              maxLength={600}
              placeholder="Share your background, your favorite topics to explain, and how you help students build confidence."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="experience">Relevant Experience (Optional)</label>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={2}
              placeholder="Any tutoring, school mentoring, club leadership, or community teaching experience."
            />
          </div>
        </div>

        {/* 5. Acknowledgements */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>5. Community Standards & Safeguarding</h2>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedGuidelines}
                onChange={(e) => setAgreedGuidelines(e.target.checked)}
                required
              />
              <span>
                I agree to uphold the{" "}
                <Link href="/safety" target="_blank" style={{ color: "#0E8345", fontWeight: 700 }}>
                  Learnivia Community Guidelines
                </Link>
                .
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedSafeguarding}
                onChange={(e) => setAgreedSafeguarding(e.target.checked)}
                required
              />
              <span>I understand that sessions are with real students and I will maintain classroom-safe professionalism at all times.</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedPrivacy}
                onChange={(e) => setAgreedPrivacy(e.target.checked)}
                required
              />
              <span>
                I agree to the{" "}
                <Link href="/privacy" target="_blank" style={{ color: "#0E8345", fontWeight: 700 }}>
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: "1rem" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              width: "100%",
              background: isSubmitting ? "#64748B" : "#0E8345",
              color: "#FFFFFF",
              border: "none",
              padding: "1rem",
              borderRadius: "10px",
              fontSize: "1.05rem",
              fontWeight: 800,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "background 150ms ease, transform 150ms ease",
              boxShadow: "0 4px 12px rgba(14, 131, 69, 0.2)",
            }}
          >
            {isSubmitting ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "18px",
                    height: "18px",
                    border: "2.5px solid rgba(255, 255, 255, 0.3)",
                    borderTopColor: "#FFFFFF",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span>Submitting Your Application...</span>
              </>
            ) : (
              <span>
                {existingProfile ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    <Check size={16} /> Save &amp; Update Application Details
                  </span>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    Submit Volunteer Tutor Application <ArrowRight size={16} />
                  </span>
                )}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
