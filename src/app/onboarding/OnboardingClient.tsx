"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import { completeOnboarding } from "./actions";

export default function OnboardingClient() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [educationLevel, setEducationLevel] = useState("High School (Grade 11–12)");
  const [school, setSchool] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const { update } = useSession();

  const isTutor = goal === "become_tutor";
  const isStep1Valid = isTutor
    ? Boolean(goal && educationLevel && school.trim())
    : Boolean(goal && grade && age);

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
        formData.append("school", school);
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
        setErrorMsg(res?.error || "Unknown server error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Onboarding failed", error);
      setErrorMsg("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={`${styles.progressLine} ${step > 1 ? styles.activeLine : ""}`}></div>
          <div className={`${styles.progressLine} ${step > 2 ? styles.activeLine : ""}`}></div>
          
          <div className={`${styles.stepCircle} ${step >= 1 ? styles.activeCircle : ""}`}></div>
          <div className={`${styles.stepCircle} ${step >= 2 ? styles.activeCircle : ""}`}></div>
          <div className={`${styles.stepCircle} ${step >= 3 ? styles.activeCircle : ""}`}></div>
        </div>

        {/* Step 1: Goals & Adaptive Profile Info */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Welcome to Learnivia!</h1>
            <p className={styles.subtitle}>
              {isTutor
                ? "Welcome prospective volunteer tutor! Tell us about your educational background so we can guide you to our application and credential review."
                : "Tell us about your student (K-10) so we can match them with the right volunteer tutors. Everything is 100% free."}
            </p>
            
            <div className={styles.formGroup}>
              <label>Who is learning? <span className={styles.required}>*</span></label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
                <option value="" disabled>Select account type...</option>
                <option value="parent_child">Parent / Guardian managing a child's account</option>
                <option value="student_9_10">Independent Student (Grade 9–10)</option>
                <option value="become_tutor">I want to become a volunteer tutor</option>
              </select>
            </div>

            {isTutor ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label>Your Current Education Level <span className={styles.required}>*</span></label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      required
                    >
                      <option value="High School (Grade 11–12)">High School (Grade 11–12)</option>
                      <option value="Undergraduate College / University">Undergraduate College / University</option>
                      <option value="Graduate Student">Graduate Student</option>
                      <option value="Educator / Working Professional">Educator / Working Professional</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Your School / Institution <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Lincoln High School or UC Berkeley"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      required
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "0.95rem" }}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Curriculum Familiarity / Specialty <span className={styles.required}>*</span></label>
                  <select value={curriculum} onChange={(e) => setCurriculum(e.target.value)} required>
                    <option value="" disabled>Select curriculum expertise...</option>
                    <option value="US Common Core">US Common Core / State Standards</option>
                    <option value="CBSE">CBSE (India)</option>
                    <option value="ICSE">ICSE (India)</option>
                    <option value="IGCSE">IGCSE / GCSE (UK)</option>
                    <option value="IB">IB (International Baccalaureate K–10)</option>
                    <option value="All Curricula">All K–10 Core Subjects</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label>Student Age <span className={styles.required}>*</span></label>
                    <input
                      type="number"
                      min="5"
                      max="16"
                      placeholder="e.g. 10"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Student Grade Level <span className={styles.required}>*</span></label>
                    <select value={grade} onChange={(e) => setGrade(e.target.value)} required>
                      <option value="" disabled>Select grade...</option>
                      <option value="Kindergarten">Kindergarten (Age 5–6)</option>
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
                </div>

                <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                  <label>Curriculum / School System <span className={styles.required}>*</span></label>
                  <select value={curriculum} onChange={(e) => setCurriculum(e.target.value)} required>
                    <option value="" disabled>Select curriculum...</option>
                    <option value="US Common Core">US Common Core / State Standard</option>
                    <option value="CBSE">CBSE (India)</option>
                    <option value="ICSE">ICSE (India)</option>
                    <option value="IGCSE">IGCSE / GCSE (UK)</option>
                    <option value="IB">IB (International Baccalaureate K–10)</option>
                    <option value="Other">Other National Curriculum</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Welcome */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Welcome to Learnivia!</h1>
            <p className={styles.subtitle}>Learnivia is a volunteer-run community of learners around the world who help each other learn. With Learnivia, you can:</p>
            
            <div className={styles.featuresBox}>
              <div className={styles.featureItem}>
                <span className={styles.icon}>📚</span>
                <p>Participate in small-group tutoring sessions, 1:1 homework help, and more.</p>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.icon}>🎓</span>
                <p>Become a tutor to earn volunteer hours, build your portfolio, and make an impact.</p>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.icon}>💬</span>
                <p>Grow and learn with peers from all over the world.</p>
              </div>
            </div>
            
            <p className={styles.guidelinesIntro}>
              Learnivia is a global community with members of all ages, cultures, and backgrounds. We ask that you adhere to our community guidelines to keep Learnivia safe.
            </p>
          </div>
        )}

        {/* Step 3: Guidelines */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Community Guidelines</h1>
            
            <div className={styles.guidelinesBox}>
              <div className={styles.guideItem}>
                <span className={styles.iconPink}>🤝</span>
                <div>
                  <h3>Be respectful.</h3>
                  <p>Think about how your words and actions will affect others, and keep interactions classroom-appropriate.</p>
                </div>
              </div>
              <div className={styles.guideItem}>
                <span className={styles.iconGreen}>🛡️</span>
                <div>
                  <h3>Be safe.</h3>
                  <p>Remember to keep your personal boundaries—avoid sharing your personal contact information.</p>
                </div>
              </div>
              <div className={styles.guideItem}>
                <span className={styles.iconBlue}>😊</span>
                <div>
                  <h3>Be kind.</h3>
                  <p>Find ways to help out; whether that's pointing another learner in the right direction, or giving a tutor helpful feedback!</p>
                </div>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span className={styles.checkboxText}>Do you agree to uphold the community guidelines? <span className={styles.required}>*</span></span>
              </label>
            </div>
          </div>
        )}

        {errorMsg && (
          <div style={{ color: "var(--color-error)", background: "var(--color-error-bg)", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.875rem", fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={styles.navButtons}>
          {step > 1 ? (
            <button onClick={handleBack} className={styles.backBtn} type="button">Back</button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button 
              onClick={handleNext} 
              className={styles.nextBtn} 
              disabled={step === 1 && !isStep1Valid}
              type="button"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className={styles.nextBtn}
              disabled={!agreed || loading}
            >
              {loading ? "Finishing..." : isTutor ? "Proceed to Application →" : "Complete Setup"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
