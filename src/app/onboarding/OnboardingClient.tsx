"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import { completeOnboarding } from "./actions";

export default function OnboardingClient() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
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

        {/* Step 1: Goals */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Let's find the best program for you!</h1>
            <p className={styles.subtitle}>This helps us point you to the right place to start. You can always access all Learnivia functionality.</p>
            
            <div className={styles.formGroup}>
              <label>What's the main reason you're here? <span className={styles.required}>*</span></label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
                <option value="" disabled>Select...</option>
                <option value="test_prep">Standardized Test Prep</option>
                <option value="homework">Homework Help</option>
                <option value="become_tutor">Become a Volunteer Tutor</option>
                <option value="general_learning">General Learning</option>
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
              disabled={step === 1 && !goal}
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
