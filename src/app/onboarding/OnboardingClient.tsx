"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Users,
  BookOpen,
  GraduationCap,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  HeartHandshake,
  Smile,
  Compass,
  Sparkles,
  Lock,
} from "lucide-react";
import styles from "./page.module.css";
import { completeOnboarding } from "./actions";

const GRADES = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
];

const CURRICULA = [
  { id: "US Common Core", label: "US Common Core / State" },
  { id: "CBSE", label: "CBSE (India)" },
  { id: "ICSE", label: "ICSE (India)" },
  { id: "IGCSE", label: "IGCSE / GCSE (UK)" },
  { id: "IB", label: "IB (International Baccalaureate)" },
  { id: "Other", label: "Other National System" },
];

const TUTOR_LEVELS = [
  "High School (Grade 11–12)",
  "Undergraduate College / University",
  "Graduate Student",
  "Educator / Working Professional",
];

export default function OnboardingClient() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("parent_child");
  const [age, setAge] = useState("12");
  const [grade, setGrade] = useState("Grade 7");
  const [curriculum, setCurriculum] = useState("US Common Core");
  const [educationLevel, setEducationLevel] = useState("Undergraduate College / University");
  const [school, setSchool] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const { update } = useSession();

  const isTutor = goal === "become_tutor";
  const isStep1Valid = isTutor
    ? Boolean(goal && educationLevel && school.trim())
    : Boolean(goal && grade && age && parseInt(age, 10) >= 5);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("primaryGoal", goal);

      if (isTutor) {
        formData.append("educationLevel", educationLevel);
        formData.append("school", school.trim());
        formData.append("curriculum", curriculum || "US Common Core");
      } else {
        formData.append("age", age);
        formData.append("grade", grade);
        formData.append("curriculum", curriculum);
      }

      const res = await completeOnboarding(formData);
      if (res?.success) {
        await update({ onboardingCompleted: true });
        if (isTutor) {
          router.push("/apply");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setErrorMsg(res?.error || "Unknown server error occurred");
        setLoading(false);
      }
    } catch (error) {
      console.error("Onboarding failed", error);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Modern Welcome Header */}
        <header className={styles.folioHeader}>
          <div className={styles.folioBadge}>
            <Sparkles size={12} />
            <span>Welcome to Learnivia • Let&apos;s get you set up</span>
          </div>
          <h1 className={styles.folioTitle}>
            {step === 1 && "Tell us a bit about yourself"}
            {step === 2 && "How Learnivia works"}
            {step === 3 && "Community rules & safety"}
          </h1>
          <p className={styles.folioSubtitle}>
            {step === 1 &&
              "Whether you're looking for help in math, science, or English, we'll connect you with friendly peer tutors and great resources."}
            {step === 2 &&
              "Learnivia is 100% free peer-to-peer tutoring led by high school and university students worldwide. No subscriptions, zero fees, ever."}
            {step === 3 &&
              "We keep learning safe, supportive, and kind with parent notifications, verified video rooms, and a clear student code of conduct."}
          </p>
        </header>

        {/* 3-Step Progress Ribbon */}
        <nav className={styles.stepsRibbon} aria-label="Onboarding Progress">
          <div
            className={`${styles.stepTab} ${step === 1 ? styles.activeStepTab : step > 1 ? styles.completedStepTab : ""}`}
          >
            <div className={styles.stepTabNum}>
              {step > 1 ? <Check size={14} /> : "01"}
            </div>
            <div className={styles.stepTabLabel}>
              <span className={styles.stepTabTitle}>About You</span>
              <span className={styles.stepTabSubtitle}>Role &amp; Grade</span>
            </div>
          </div>

          <div
            className={`${styles.stepTab} ${step === 2 ? styles.activeStepTab : step > 2 ? styles.completedStepTab : ""}`}
          >
            <div className={styles.stepTabNum}>
              {step > 2 ? <Check size={14} /> : "02"}
            </div>
            <div className={styles.stepTabLabel}>
              <span className={styles.stepTabTitle}>How It Works</span>
              <span className={styles.stepTabSubtitle}>Peer Learning</span>
            </div>
          </div>

          <div
            className={`${styles.stepTab} ${step === 3 ? styles.activeStepTab : ""}`}
          >
            <div className={styles.stepTabNum}>
              03
            </div>
            <div className={styles.stepTabLabel}>
              <span className={styles.stepTabTitle}>Community &amp; Safety</span>
              <span className={styles.stepTabSubtitle}>Safety Guidelines</span>
            </div>
          </div>
        </nav>

        {/* Main Card Surface */}
        <div className={styles.folioCard}>
          {/* ── STEP 1: Profile & Role ── */}
          {step === 1 && (
            <>
              {/* Role Selection */}
              <div className={styles.fieldSection}>
                <span className={styles.fieldLabel}>
                  <span>How will you be using Learnivia? <span className={styles.requiredStar}>*</span></span>
                  <span className={styles.fieldHint}>Choose your primary role</span>
                </span>

                <div className={styles.roleGrid}>
                  {/* Option 1: Parent */}
                  <div
                    className={`${styles.roleCard} ${goal === "parent_child" ? styles.activeRoleCard : ""}`}
                    onClick={() => setGoal("parent_child")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setGoal("parent_child")}
                  >
                    <div className={styles.roleIndicator}>
                      {goal === "parent_child" && <div className={styles.roleIndicatorDot} />}
                    </div>
                    <div className={styles.roleIconWrap}>
                      <Users size={20} />
                    </div>
                    <h3 className={styles.roleTitle}>Parent / Guardian</h3>
                    <p className={styles.roleDesc}>
                      Managing 1-on-1 tutoring for a student (K–10) with verified progress reports.
                    </p>
                  </div>

                  {/* Option 2: Student */}
                  <div
                    className={`${styles.roleCard} ${goal === "student_9_10" ? styles.activeRoleCard : ""}`}
                    onClick={() => setGoal("student_9_10")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setGoal("student_9_10")}
                  >
                    <div className={styles.roleIndicator}>
                      {goal === "student_9_10" && <div className={styles.roleIndicatorDot} />}
                    </div>
                    <div className={styles.roleIconWrap}>
                      <BookOpen size={20} />
                    </div>
                    <h3 className={styles.roleTitle}>Student (K–10)</h3>
                    <p className={styles.roleDesc}>
                      Looking for friendly homework help, exam prep, or concept reviews from peer tutors.
                    </p>
                  </div>

                  {/* Option 3: Volunteer Tutor */}
                  <div
                    className={`${styles.roleCard} ${goal === "become_tutor" ? styles.activeRoleCard : ""}`}
                    onClick={() => setGoal("become_tutor")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setGoal("become_tutor")}
                  >
                    <div className={styles.roleIndicator}>
                      {goal === "become_tutor" && <div className={styles.roleIndicatorDot} />}
                    </div>
                    <div className={styles.roleIconWrap}>
                      <GraduationCap size={20} />
                    </div>
                    <h3 className={styles.roleTitle}>Volunteer Tutor</h3>
                    <p className={styles.roleDesc}>
                      High school senior, university student or educator ready to teach peers &amp; earn service hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditional Inputs: Tutor vs Student */}
              {isTutor ? (
                <>
                  {/* Education Level */}
                  <div className={styles.fieldSection}>
                    <span className={styles.fieldLabel}>
                      <span>Your Current Education Level <span className={styles.requiredStar}>*</span></span>
                    </span>
                    <div className={styles.chipGrid}>
                      {TUTOR_LEVELS.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          className={`${styles.chipBtn} ${educationLevel === lvl ? styles.activeChipBtn : ""}`}
                          onClick={() => setEducationLevel(lvl)}
                        >
                          {educationLevel === lvl && <Check size={13} />}
                          <span>{lvl}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* School / University */}
                  <div className={styles.fieldSection}>
                    <span className={styles.fieldLabel}>
                      <span>Your School or Institution <span className={styles.requiredStar}>*</span></span>
                      <span className={styles.fieldHint}>Verified on your tutor transcript</span>
                    </span>
                    <input
                      type="text"
                      className={styles.paperInput}
                      placeholder="e.g. Oxford High School, UC Berkeley, St. Xavier's"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      required
                    />
                  </div>

                  {/* Curriculum Expertise */}
                  <div className={styles.fieldSection}>
                    <span className={styles.fieldLabel}>
                      <span>Curriculum Specialty <span className={styles.requiredStar}>*</span></span>
                    </span>
                    <div className={styles.chipGrid}>
                      {CURRICULA.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className={`${styles.chipBtn} ${curriculum === c.id ? styles.activeChipBtn : ""}`}
                          onClick={() => setCurriculum(c.id)}
                        >
                          {curriculum === c.id && <Check size={13} />}
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Grade Level Chips */}
                  <div className={styles.fieldSection}>
                    <span className={styles.fieldLabel}>
                      <span>Student Grade Level <span className={styles.requiredStar}>*</span></span>
                      <span className={styles.fieldHint}>Matches curriculum standards</span>
                    </span>
                    <div className={styles.chipGrid}>
                      {GRADES.map((g) => (
                        <button
                          key={g}
                          type="button"
                          className={`${styles.chipBtn} ${grade === g ? styles.activeChipBtn : ""}`}
                          onClick={() => setGrade(g)}
                        >
                          {grade === g && <Check size={13} />}
                          <span>{g}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age Input & Curriculum Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem" }}>
                    <div className={styles.fieldSection}>
                      <span className={styles.fieldLabel}>
                        <span>Age <span className={styles.requiredStar}>*</span></span>
                        <span className={styles.fieldHint}>5 to 16 yrs</span>
                      </span>
                      <input
                        type="number"
                        min="5"
                        max="16"
                        className={styles.paperInput}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.fieldSection}>
                      <span className={styles.fieldLabel}>
                        <span>Curriculum Framework <span className={styles.requiredStar}>*</span></span>
                      </span>
                      <div className={styles.chipGrid}>
                        {CURRICULA.slice(0, 4).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className={`${styles.chipBtn} ${curriculum === c.id ? styles.activeChipBtn : ""}`}
                            onClick={() => setCurriculum(c.id)}
                          >
                            {curriculum === c.id && <Check size={13} />}
                            <span>{c.id}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── STEP 2: Pedagogy & Ethos ── */}
          {step === 2 && (
            <div className={styles.pedagogyDeck}>
              <div className={styles.pedagogyCard}>
                <div className={styles.pedagogyIcon}>
                  <HeartHandshake size={22} />
                </div>
                <div className={styles.pedagogyBody}>
                  <h3 className={styles.pedagogyTitle}>100% Free & Peer-to-Peer</h3>
                  <p className={styles.pedagogyDesc}>
                    Learnivia is built on pure volunteer stewardship. We never charge subscription fees, sell study packs, or trade in virtual coins. Knowledge is shared freely between curious learners and passionate student tutors.
                  </p>
                </div>
              </div>

              <div className={styles.pedagogyCard}>
                <div className={styles.pedagogyIcon}>
                  <Compass size={22} />
                </div>
                <div className={styles.pedagogyBody}>
                  <h3 className={styles.pedagogyTitle}>Real Humans, Zero AI Substitutes</h3>
                  <p className={styles.pedagogyDesc}>
                    Every tutoring session happens in a live, monitored 1-on-1 Zoom study room with an authentic volunteer mentor. We encourage real discussion, screen sharing, notebook diagrams, and patient step-by-step guidance.
                  </p>
                </div>
              </div>

              <div className={styles.pedagogyCard}>
                <div className={styles.pedagogyIcon}>
                  <ShieldCheck size={22} />
                </div>
                <div className={styles.pedagogyBody}>
                  <h3 className={styles.pedagogyTitle}>Strict Child Safeguarding</h3>
                  <p className={styles.pedagogyDesc}>
                    Minor protection is fundamental: parents receive session confirmations, volunteer tutors undergo safety training, and personal contact exchanges outside the platform are strictly prohibited.
                  </p>
                </div>
              </div>

              <div className={styles.fellowshipNote}>
                <Sparkles size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Our Promise:</strong> Whether you are working through quadratic equations or drafting an essay, you learn at your own pace with encouraging, patient student mentors.
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 3: Community Code & Safety ── */}
          {step === 3 && (
            <div className={styles.covenantFrame}>
              <div className={styles.covenantPillars}>
                <div className={styles.pillarItem}>
                  <div className={styles.pillarHeader}>
                    <HeartHandshake size={16} color="var(--wa-green, #2563EB)" />
                    <span>Mutual Respect</span>
                  </div>
                  <p className={styles.pillarText}>
                    Treat every learner and tutor with dignity, patience, and warmth. Language is always classroom-appropriate.
                  </p>
                </div>

                <div className={styles.pillarItem}>
                  <div className={styles.pillarHeader}>
                    <Lock size={16} color="var(--wa-green, #2563EB)" />
                    <span>Personal Privacy</span>
                  </div>
                  <p className={styles.pillarText}>
                    Never share phone numbers, social media handles, or home addresses. All sessions occur in secure video rooms.
                  </p>
                </div>

                <div className={styles.pillarItem}>
                  <div className={styles.pillarHeader}>
                    <Smile size={16} color="var(--wa-green, #2563EB)" />
                    <span>Active Learning</span>
                  </div>
                  <p className={styles.pillarText}>
                    Tutors guide students to discover solutions themselves rather than simply giving answers. Effort and growth come first.
                  </p>
                </div>
              </div>

              {/* Agreement Pledge Card */}
              <label className={styles.covenantAgreementCard}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className={styles.agreementCheckbox}
                />
                <div className={styles.agreementTextWrap}>
                  <span className={styles.agreementTitle}>
                    I agree to Learnivia&apos;s Community Guidelines &amp; Safety Standards <span className={styles.requiredStar}>*</span>
                  </span>
                  <span className={styles.agreementSubtext}>
                    By checking this box, you agree to follow our Child Safeguarding Standards, Community Honor Code, and Session Guidelines.
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Error Advisory */}
          {errorMsg && (
            <div
              style={{
                color: "var(--wa-error, #9E2A2B)",
                background: "var(--wa-error-bg, #FDF2F2)",
                border: "1px solid rgba(158, 42, 43, 0.25)",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Bottom Navigation */}
          <footer className={styles.folioNav}>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className={styles.backBtn}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className={styles.nextBtn}
                disabled={step === 1 && !isStep1Valid}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className={styles.nextBtn}
                disabled={!agreed || loading}
              >
                <span>
                  {loading
                    ? "Setting up your account..."
                    : isTutor
                    ? "Continue to Tutor Application"
                    : "Complete Setup & Go to Dashboard"}
                </span>
                <ArrowRight size={16} />
              </button>
            )}
          </footer>
        </div>
      </div>
    </main>
  );
}
