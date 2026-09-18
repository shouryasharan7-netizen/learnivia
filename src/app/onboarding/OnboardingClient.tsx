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
        {/* Folio Archival Header */}
        <header className={styles.folioHeader}>
          <div className={styles.folioBadge}>
            <Sparkles size={12} />
            <span>Matriculation Registry • Folio 2026</span>
          </div>
          <h1 className={styles.folioTitle}>
            {step === 1 && "Define Your Academic Journey"}
            {step === 2 && "Our Pedagogical Commitment"}
            {step === 3 && "The Fellowship Covenant"}
          </h1>
          <p className={styles.folioSubtitle}>
            {step === 1 &&
              "Tell us who will be learning so we can curate matching volunteer tutors, verified materials, and appropriate grade standards."}
            {step === 2 &&
              "Learnivia is a non-profit peer tutoring salon run by dedicated student scholars worldwide. Zero bots, zero hidden fees, ever."}
            {step === 3 &&
              "We maintain a safe, welcoming academic environment protected by parent notifications, verified Zoom rooms, and a clear honor code."}
          </p>
        </header>

        {/* 3-Step Archival Ribbon */}
        <nav className={styles.stepsRibbon} aria-label="Onboarding Progress">
          <div
            className={`${styles.stepTab} ${step === 1 ? styles.activeStepTab : step > 1 ? styles.completedStepTab : ""}`}
          >
            <div className={styles.stepTabNum}>
              {step > 1 ? <Check size={14} /> : "01"}
            </div>
            <div className={styles.stepTabLabel}>
              <span className={styles.stepTabTitle}>Academic Identity</span>
              <span className={styles.stepTabSubtitle}>Role & Grade Focus</span>
            </div>
          </div>

          <div
            className={`${styles.stepTab} ${step === 2 ? styles.activeStepTab : step > 2 ? styles.completedStepTab : ""}`}
          >
            <div className={styles.stepTabNum}>
              {step > 2 ? <Check size={14} /> : "02"}
            </div>
            <div className={styles.stepTabLabel}>
              <span className={styles.stepTabTitle}>Our Pedagogy</span>
              <span className={styles.stepTabSubtitle}>Peer-to-Peer Ethos</span>
            </div>
          </div>

          <div
            className={`${styles.stepTab} ${step === 3 ? styles.activeStepTab : ""}`}
          >
            <div className={styles.stepTabNum}>
              03
            </div>
            <div className={styles.stepTabLabel}>
              <span className={styles.stepTabTitle}>Honor Covenant</span>
              <span className={styles.stepTabSubtitle}>Community & Safety</span>
            </div>
          </div>
        </nav>

        {/* Main Folio Card Surface */}
        <div className={styles.folioCard}>
          {/* ── STEP 1: Academic Identity ── */}
          {step === 1 && (
            <>
              {/* Role Selection */}
              <div className={styles.fieldSection}>
                <span className={styles.fieldLabel}>
                  <span>Select Your Academic Persona <span className={styles.requiredStar}>*</span></span>
                  <span className={styles.fieldHint}>Choose your primary workspace role</span>
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

                  {/* Option 2: Independent Learner */}
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
                    <h3 className={styles.roleTitle}>Independent Scholar</h3>
                    <p className={styles.roleDesc}>
                      Enrolled in Grades 7–10 seeking homework guidance, exam prep, or enrichment.
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
                      High school senior, undergraduate or educator ready to teach peers & earn service hours.
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
                  <strong>Our Scholarly Compact:</strong> Whether you are conquering quadratic formulas or writing your first literary essay, you learn at your own pace in an encouraging, non-judgmental salon.
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 3: Community Covenant ── */}
          {step === 3 && (
            <div className={styles.covenantFrame}>
              <div className={styles.covenantPillars}>
                <div className={styles.pillarItem}>
                  <div className={styles.pillarHeader}>
                    <HeartHandshake size={16} color="var(--wa-crimson, #8B263E)" />
                    <span>Mutual Respect</span>
                  </div>
                  <p className={styles.pillarText}>
                    Treat every learner and tutor with dignity, patience, and warmth. Language is always classroom-appropriate.
                  </p>
                </div>

                <div className={styles.pillarItem}>
                  <div className={styles.pillarHeader}>
                    <Lock size={16} color="var(--wa-terra, #1E3A2F)" />
                    <span>Personal Privacy</span>
                  </div>
                  <p className={styles.pillarText}>
                    Never share phone numbers, social media handles, or home addresses. All interactions occur in verified rooms.
                  </p>
                </div>

                <div className={styles.pillarItem}>
                  <div className={styles.pillarHeader}>
                    <Smile size={16} color="var(--wa-ochre, #C28B2B)" />
                    <span>Socratic Spirit</span>
                  </div>
                  <p className={styles.pillarText}>
                    Tutors guide students to discover answers themselves rather than doing homework for them. Growth over answers.
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
                    I pledge to uphold the Learnivia Academic Fellowship Covenant <span className={styles.requiredStar}>*</span>
                  </span>
                  <span className={styles.agreementSubtext}>
                    By ticking this pledge, you agree to abide by our Child Safeguarding Standards, Community Honor Code, and Session Guidelines.
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

          {/* Bottom Folio Navigation */}
          <footer className={styles.folioNav}>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className={styles.backBtn}
              >
                <ArrowLeft size={16} /> Return
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
                <span>Continue to {step === 1 ? "Pedagogy" : "Covenant"}</span>
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
                    ? "Inscribing Registry..."
                    : isTutor
                    ? "Proceed to Tutor Application"
                    : "Matriculate & Enter Study Desk"}
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
