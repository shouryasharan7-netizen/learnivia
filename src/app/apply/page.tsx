import { auth } from "@/auth";
import styles from "./page.module.css";
import Image from "next/image";
import { submitApplication, updateReportCard } from "./actions";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Volunteer Tutor Application & Academic Credentials — Learnivia",
  description: "Apply to become a volunteer tutor on Learnivia or submit your academic report card and scores for review.",
};

export default async function ApplyPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <Image src="/images/become-a-tutor.png" alt="" width={120} height={150} className={styles.mascotImg} />
          <h1 className={styles.title}>Become a Volunteer Tutor</h1>
          <p className={styles.subtitle}>
            Help students learn for free. Earn verified volunteer hours. Make a genuine impact.
          </p>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.loginPrompt}>
            <div className={styles.loginPromptIcon} aria-hidden="true">🔐</div>
            <h2>Create a free account to apply</h2>
            <p>
              You need a Learnivia account to submit your volunteer application and upload your academic report card. It only takes a minute and it's completely free.
            </p>
            <div className={styles.loginActions}>
              <Link href="/signin?callbackUrl=/apply" className={styles.submitBtn}>
                Sign in or create account
              </Link>
            </div>
            <p className={styles.loginNote}>
              You'll be returned directly to this application form after signing in.
            </p>
          </div>

          <div className={styles.benefitsList}>
            <h3>What tutors get</h3>
            <ul>
              <li>✓ Verified record of volunteer hours</li>
              <li>✓ Experience to add to your portfolio or personal statement</li>
              <li>✓ The satisfaction of making a real difference</li>
              <li>✓ Flexible scheduling — you set your own availability</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  // Check if this user has already submitted an application
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      subjects: true,
      gradeLevels: true,
    },
  });

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/become-a-tutor.png" alt="" width={120} height={150} className={styles.mascotImg} />
        <h1 className={styles.title}>
          {tutorProfile ? "Your Tutor Application & Credentials" : "Volunteer Tutor Application"}
        </h1>
        <p className={styles.subtitle}>
          {tutorProfile
            ? "Manage your application status, upload your academic report card, and provide your verified scores."
            : "Tell us about yourself and upload your report card. Our academic board reviews every application to verify subject proficiency."}
        </p>
      </div>

      <div className={styles.formContainer}>
        {/* Existing Applicant Status & Report Card Manager */}
        {tutorProfile && (
          <div
            style={{
              background: "white",
              border: "1.5px solid var(--color-border)",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>📋</span>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-navy)", margin: 0 }}>
                    Application Status:{" "}
                    <span
                      style={{
                        color:
                          tutorProfile.status === "APPROVED"
                            ? "var(--color-success)"
                            : tutorProfile.status === "PENDING"
                            ? "#D97706"
                            : "var(--color-error)",
                      }}
                    >
                      {tutorProfile.status}
                    </span>
                  </h2>
                </div>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "0.25rem", marginBottom: 0 }}>
                  Submitted on {new Date(tutorProfile.createdAt).toLocaleDateString()} • School/Affiliation:{" "}
                  <strong>{tutorProfile.school || "Independent"}</strong>
                </p>
              </div>

              <span
                style={{
                  background:
                    tutorProfile.status === "APPROVED"
                      ? "var(--color-success-bg)"
                      : tutorProfile.status === "PENDING"
                      ? "#FEF3C7"
                      : "var(--color-error-bg)",
                  color:
                    tutorProfile.status === "APPROVED"
                      ? "var(--color-success)"
                      : tutorProfile.status === "PENDING"
                      ? "#92400E"
                      : "var(--color-error)",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {tutorProfile.status === "PENDING" ? "🟡 Under Board Review" : tutorProfile.status}
              </span>
            </div>

            {/* Academic Report Card Status Card */}
            <div
              style={{
                background: tutorProfile.reportCardUrl ? "#F0FDF4" : "#FFFBEB",
                border: `1.5px solid ${tutorProfile.reportCardUrl ? "#86EFAC" : "#FCD34D"}`,
                borderRadius: "12px",
                padding: "1.25rem",
              }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-navy)", margin: "0 0 0.5rem 0" }}>
                📑 Academic Report Card & Grade Scores
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-navy)" }}>
                <div>
                  <strong>Recorded Academic Scores:</strong>{" "}
                  {tutorProfile.academicScores ? (
                    <span style={{ color: "#0E8345", fontWeight: 700 }}>{tutorProfile.academicScores}</span>
                  ) : (
                    <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>No scores specified yet</span>
                  )}
                </div>

                <div>
                  <strong>Report Card Document:</strong>{" "}
                  {tutorProfile.reportCardUrl ? (
                    <span style={{ color: "#0E8345", fontWeight: 600 }}>
                      ✅ Attached ({tutorProfile.reportCardName || "Official Document"})
                    </span>
                  ) : (
                    <span style={{ color: "#B45309", fontWeight: 600 }}>
                      ⚠️ No document uploaded yet — please upload below so our team can approve you!
                    </span>
                  )}
                </div>

                {tutorProfile.reportCardUrl && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <a
                      href={tutorProfile.reportCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "#0E8345",
                        color: "white",
                        padding: "0.45rem 0.9rem",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      📄 Open / View Submitted Report Card
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Form to Upload / Update Report Card */}
            <form action={updateReportCard} className={styles.formSection} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-navy)", margin: 0 }}>
                {tutorProfile.reportCardUrl ? "Update Your Report Card & Scores" : "Upload Your Report Card & Academic Scores"}
              </h3>
              <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", margin: 0 }}>
                Submit your official report card, transcript, or exam results (e.g. CBSE mark sheet, GCSE results, high school transcript) so our team can verify your scores.
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="academicScores">Academic Results / Scores (CGPA, Percentage, or Subject Marks) *</label>
                <input
                  id="academicScores"
                  type="text"
                  name="academicScores"
                  defaultValue={tutorProfile.academicScores || ""}
                  placeholder="e.g. Class 10 CGPA: 8.7, English: 95%, Social Studies: 92%"
                  required
                />
                <span className={styles.fieldHint}>Summarize your latest official grades and scores</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reportCardFile">Upload Report Card / Marksheet Document (PDF or Image)</label>
                <input
                  id="reportCardFile"
                  type="file"
                  name="reportCardFile"
                  accept=".pdf,image/png,image/jpeg,image/webp,image/jpg"
                  style={{
                    padding: "0.5rem",
                    border: "1px dashed var(--color-border)",
                    borderRadius: "8px",
                    background: "var(--color-cream)",
                  }}
                />
                <span className={styles.fieldHint}>Supports PDF, JPG, PNG, or WEBP (up to 10MB)</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reportCardLink">Or Provide Document Link (Google Drive / Cloud Share URL)</label>
                <input
                  id="reportCardLink"
                  type="url"
                  name="reportCardLink"
                  defaultValue={tutorProfile.reportCardUrl?.startsWith("http") ? tutorProfile.reportCardUrl : ""}
                  placeholder="https://drive.google.com/file/d/..."
                />
                <span className={styles.fieldHint}>Make sure sharing is set to "Anyone with the link can view"</span>
              </div>

              <button
                type="submit"
                style={{
                  background: "var(--color-teal)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                💾 Save &amp; Submit Report Card
              </button>
            </form>
          </div>
        )}

        {/* Full Application Form (For new applicants or updating general details) */}
        <div style={{ marginTop: tutorProfile ? "2rem" : "0" }}>
          {tutorProfile && (
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "1rem" }}>
              Update Application Details
            </h3>
          )}

          <form action={submitApplication} className={styles.form}>
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>1. Your Details</h2>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" value={session.user.name || ""} disabled className={styles.disabledInput} />
                <span className={styles.fieldHint}>From your account</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="school">School / University (optional)</label>
                <input
                  id="school"
                  type="text"
                  name="school"
                  defaultValue={tutorProfile?.school || ""}
                  placeholder="e.g. MVN / Imperial College London"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="timezone">Your timezone *</label>
                <select id="timezone" name="timezone" required defaultValue="Asia/Kolkata">
                  <option value="">Select your timezone</option>
                  <optgroup label="Asia & Pacific">
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="Asia/Dubai">Gulf Standard Time (UAE)</option>
                    <option value="Asia/Singapore">Singapore / Malaysia</option>
                    <option value="Asia/Tokyo">Japan / Korea</option>
                    <option value="Australia/Sydney">Sydney (AEST)</option>
                  </optgroup>
                  <optgroup label="Americas">
                    <option value="America/New_York">Eastern Time (US)</option>
                    <option value="America/Chicago">Central Time (US)</option>
                    <option value="America/Denver">Mountain Time (US)</option>
                    <option value="America/Los_Angeles">Pacific Time (US)</option>
                    <option value="America/Toronto">Eastern Time (Canada)</option>
                  </optgroup>
                  <optgroup label="Europe">
                    <option value="Europe/London">London (GMT/BST)</option>
                    <option value="Europe/Paris">Paris / Berlin (CET)</option>
                    <option value="Europe/Moscow">Moscow (MSK)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Academic Credentials & Report Card Section */}
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>2. Academic Scores &amp; Report Card (Transcript)</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
                Our academic verification team reviews your report card/transcript to ensure quality peer tutoring for our learners.
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="appAcademicScores">Your Academic Scores / Results (Grades &amp; CGPA) *</label>
                <input
                  id="appAcademicScores"
                  type="text"
                  name="academicScores"
                  defaultValue={tutorProfile?.academicScores || ""}
                  placeholder="e.g. Class 10 CGPA: 8.7, or 95% in CBSE / GCSE 9s"
                  required
                />
                <span className={styles.fieldHint}>List your marks, CGPA, GPA, or exam scores in the subjects you plan to tutor</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="appReportCardFile">Upload Report Card / Academic Marksheet (PDF or Image)</label>
                <input
                  id="appReportCardFile"
                  type="file"
                  name="reportCardFile"
                  accept=".pdf,image/png,image/jpeg,image/webp,image/jpg"
                  style={{
                    padding: "0.5rem",
                    border: "1px dashed var(--color-border)",
                    borderRadius: "8px",
                    background: "var(--color-cream)",
                  }}
                />
                <span className={styles.fieldHint}>Upload your official school report card or exam certificate (PDF, JPG, PNG)</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="appReportCardLink">Or Provide Document Link (Google Drive / Cloud Share)</label>
                <input
                  id="appReportCardLink"
                  type="url"
                  name="reportCardLink"
                  defaultValue={tutorProfile?.reportCardUrl?.startsWith("http") ? tutorProfile.reportCardUrl : ""}
                  placeholder="https://drive.google.com/file/d/..."
                />
                <span className={styles.fieldHint}>Shareable link to your verified mark sheet or transcript</span>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>3. What You'll Teach</h2>
              <div className={styles.formGroup}>
                <label>Grade levels you can support *</label>
                <div className={styles.checkboxGroup} role="group" aria-required="true">
                  {[
                    { value: "kindergarten", label: "Kindergarten" },
                    { value: "grade-1-2", label: "Grade 1–2" },
                    { value: "grade-3-5", label: "Grade 3–5" },
                    
                    { value: "grade-6-8", label: "Grade 6–8" },
                    { value: "grade-9-10", label: "Grade 9–10" },
                    
                  ].map((g) => (
                    <label key={g.value} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="grades"
                        value={g.value}
                        defaultChecked={tutorProfile?.gradeLevels.some((gl) =>
                          gl.name.toLowerCase().includes(g.value.replace("-", " "))
                        )}
                      />
                      {g.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subjects">Subjects you can teach *</label>
                <input
                  id="subjects"
                  type="text"
                  name="subjects"
                  defaultValue={tutorProfile?.subjects.map((s) => s.name).join(", ") || ""}
                  placeholder="e.g. Maths, Biology, English Literature, Social Studies"
                  required
                />
                <span className={styles.fieldHint}>Comma-separated list</span>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>4. About You</h2>
              <div className={styles.formGroup}>
                <label htmlFor="bio">Tell students about yourself *</label>
                <textarea
                  id="bio"
                  name="bio"
                  required
                  rows={5}
                  defaultValue={tutorProfile?.bio || ""}
                  placeholder="Share your background, teaching approach, and what you love about your subject."
                  maxLength={600}
                />
                <span className={styles.fieldHint}>Max 600 characters</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="experience">Relevant experience (optional)</label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={3}
                  defaultValue={tutorProfile?.experience || ""}
                  placeholder="Any tutoring, mentoring, or teaching experience — paid or unpaid"
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>5. Acknowledgements</h2>
              <div className={styles.checkboxGroup} role="group">
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="guidelines" required defaultChecked />
                  I have read and agree to the{" "}
                  <Link href="/safety" target="_blank" rel="noreferrer">
                    Community Guidelines
                  </Link>
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="safeguarding" required defaultChecked />
                  I understand that sessions are with real students and I will treat all learners with respect and professionalism
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="privacy" required defaultChecked />
                  I agree to the{" "}
                  <Link href="/privacy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <div className={styles.formNote}>
              <strong>What happens next:</strong> Our academic team will review your application, verified scores, and report card. Your profile will be approved within 24–48 hours.
            </div>

            <button type="submit" className={styles.submitBtn}>
              {tutorProfile ? "Update Full Application" : "Submit Volunteer Application"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
