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
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const { update } = useSession();

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
      formData.append("age", age);
      formData.append("grade", grade);
      formData.append("curriculum", curriculum);
      
      const res = await completeOnboarding(formData);
      if (res?.success) {
        await update({ onboardingCompleted: true });
        router.push("/dashboard");
        router.refresh(); // Force a hard refresh of Server Components
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

        {/* Step 1: Goals & Student Info */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Let's customize your peer learning profile!</h1>
            <p className={styles.subtitle}>This allows us to automatically match you with peer tutors and sessions suited for your exact grade, age, and curriculum.</p>
            
            <div className={styles.formGroup}>
              <label>What's the main reason you're here? <span className={styles.required}>*</span></label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
                <option value="" disabled>Select goal...</option>
                <option value="test_prep">Standardized Test Prep (SAT, AP, ACT)</option>
                <option value="homework">Homework Help & Problem Sets</option>
                <option value="become_tutor">Become a Volunteer Peer Tutor</option>
                <option value="general_learning">General Academic Mentorship</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div className={styles.formGroup}>
                <label>Your Age <span className={styles.required}>*</span></label>
                <input
                  type="number"
                  min="6"
                  max="30"
                  placeholder="e.g. 15"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "0.95rem" }}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Your Grade Level <span className={styles.required}>*</span></label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} required>
                  <option value="" disabled>Select grade...</option>
                  <option value="Primary (Years 1-6)">Primary (Years 1–6)</option>
                  <option value="Middle School (Grades 6-8)">Middle School (Grades 6–8)</option>
                  <option value="Grade 9">Grade 9 / Freshman</option>
                  <option value="Grade 10">Grade 10 / Sophomore</option>
                  <option value="Grade 11">Grade 11 / Junior</option>
                  <option value="Grade 12">Grade 12 / Senior</option>
                  <option value="University">University / College</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
              <label>Your Curriculum / System <span className={styles.required}>*</span></label>
              <select value={curriculum} onChange={(e) => setCurriculum(e.target.value)} required>
                <option value="" disabled>Select curriculum...</option>
                <option value="IB">IB (International Baccalaureate)</option>
                <option value="AP">AP (Advanced Placement)</option>
                <option value="US Common Core">US Common Core / State Standard</option>
                <option value="CBSE">CBSE (India)</option>
                <option value="ICSE">ICSE (India)</option>
                <option value="IGCSE">IGCSE / GCSE (UK)</option>
                <option value="A-Level">A-Levels (UK)</option>
                <option value="Other">Other National Curriculum</option>
              </select>
            </div>
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
              disabled={step === 1 && (!goal || !grade || !age)}
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
              {loading ? "Finishing..." : "Complete Setup"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
