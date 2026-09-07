"use client";

import { useState, Suspense } from "react";
import { loginWithEmail, loginWithGoogle } from "./actions";
import styles from "./page.module.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Google Icon SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
  </svg>
);

interface SignInClientProps {
  initialIsRegister?: boolean;
}

function SignInClientInner({ initialIsRegister = false }: SignInClientProps) {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toLowerCase();

  const [isRegister, setIsRegister] = useState(initialIsRegister || roleParam === "tutor");
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TUTOR">(
    roleParam === "tutor" ? "TUTOR" : "STUDENT"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("action", isRegister ? "register" : "login");
    formData.append("callbackUrl", callbackUrl);
    if (isRegister) {
      formData.append("role", selectedRole);
    }

    const result = await loginWithEmail(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      window.location.href = result.redirectUrl || callbackUrl;
    }
  }

  async function handleGoogleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    await loginWithGoogle(fd);
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Image src="/images/logo.png" alt="Learnivia" width={52} height={52} className={styles.logoImg} />
        <h1 className={styles.title}>
          {isRegister
            ? (selectedRole === "TUTOR" ? "Join as Volunteer Tutor" : "Create Student Account")
            : "Sign in to Learnivia"}
        </h1>
        <p className={styles.lead}>
          {isRegister
            ? (selectedRole === "TUTOR"
                ? "Share your knowledge with K–10 students and earn certified service hours."
                : "Free peer-to-peer tutoring and learning for all students.")
            : "Welcome back! Continue learning and tutoring."}
        </p>

        <div className={styles.card}>
          {/* Role Selection Cards on Register */}
          {isRegister && (
            <div className={styles.roleSelectorContainer}>
              <div className={styles.roleSelectorLabel}>I want to join Learnivia as:</div>
              <div className={styles.roleCardsGrid} role="radiogroup" aria-label="Account type">
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedRole === "STUDENT"}
                  className={`${styles.roleCard} ${selectedRole === "STUDENT" ? styles.roleCardActive : ""}`}
                  onClick={() => setSelectedRole("STUDENT")}
                >
                  <span className={styles.roleIcon}>🎓</span>
                  <div className={styles.roleInfo}>
                    <span className={styles.roleTitle}>Student / Parent</span>
                    <span className={styles.roleDesc}>Get free 1-on-1 tutoring, homework help & workshops (K–10)</span>
                  </div>
                  <span className={styles.roleCheck} aria-hidden="true">✓</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedRole === "TUTOR"}
                  className={`${styles.roleCard} ${selectedRole === "TUTOR" ? styles.roleCardActive : ""}`}
                  onClick={() => setSelectedRole("TUTOR")}
                >
                  <span className={styles.roleIcon}>🌱</span>
                  <div className={styles.roleInfo}>
                    <span className={styles.roleTitle}>Volunteer Tutor</span>
                    <span className={styles.roleDesc}>Tutor K–10 students, earn certified service hours & lead</span>
                  </div>
                  <span className={styles.roleCheck} aria-hidden="true">✓</span>
                </button>
              </div>
            </div>
          )}

          {/* Google Sign In */}
          <form onSubmit={handleGoogleSignIn}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button type="submit" className={styles.googleBtn}>
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <div className={styles.divider} role="separator">
            <span>or continue with email</span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className={styles.emailForm} noValidate>
            {error && (
              <div className={styles.errorBanner} role="alert" aria-live="polite">
                <span>⚠️</span> {error}
              </div>
            )}

            {isRegister && (
              <>
                <input type="hidden" name="role" value={selectedRole} />

                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder={selectedRole === "TUTOR" ? "e.g. Alex Morgan" : "e.g. Maya Lin"}
                    required={isRegister}
                    autoComplete="name"
                  />
                </div>

                {selectedRole === "STUDENT" ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="age">Student Age</label>
                        <input
                          id="age"
                          type="number"
                          name="age"
                          min="5"
                          max="18"
                          placeholder="e.g. 11"
                          required={isRegister}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="grade">Grade Level (K–10)</label>
                        <select
                          id="grade"
                          name="grade"
                          required={isRegister}
                          style={{ width: "100%", padding: "0.625rem", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "0.9rem", background: "#FFF" }}
                        >
                          <option value="">Select grade...</option>
                          <option value="Kindergarten">Kindergarten</option>
                          <option value="Grade 1-2">Grade 1–2 (Early Elementary)</option>
                          <option value="Grade 3-5">Grade 3–5 (Upper Elementary)</option>
                          <option value="Grade 6-8">Grade 6–8 (Middle School)</option>
                          <option value="Grade 9">Grade 9 (High School Freshman)</option>
                          <option value="Grade 10">Grade 10 (High School Sophomore)</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="curriculum">Curriculum / Program</label>
                      <select
                        id="curriculum"
                        name="curriculum"
                        required={isRegister}
                        style={{ width: "100%", padding: "0.625rem", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "0.9rem", background: "#FFF" }}
                      >
                        <option value="">Select curriculum...</option>
                        <option value="US Common Core">US Common Core / State Standards</option>
                        <option value="UK National Curriculum">UK National Curriculum / Key Stages</option>
                        <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                        <option value="ICSE">ICSE (Indian Certificate of Secondary Education)</option>
                        <option value="IB">IB (Primary / Middle Years Programme)</option>
                        <option value="IGCSE">IGCSE / Cambridge Secondary</option>
                        <option value="Canadian">Canadian Provincial Curriculum</option>
                        <option value="Australian">Australian National Curriculum</option>
                        <option value="Other">Other National / State Curriculum</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.inputGroup}>
                      <label htmlFor="educationLevel">Current Education Standing</label>
                      <select
                        id="educationLevel"
                        name="educationLevel"
                        required={isRegister}
                        style={{ width: "100%", padding: "0.625rem", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "0.9rem", background: "#FFF" }}
                      >
                        <option value="">Select your standing...</option>
                        <option value="High School (Grades 11-12)">High School (Grades 11–12)</option>
                        <option value="Undergraduate / College Student">Undergraduate / College Student</option>
                        <option value="Graduate / Master's / PhD">Graduate / Master&apos;s / PhD Student</option>
                        <option value="Certified Educator / Professional">Certified Educator / Professional</option>
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="school">School / University / Organization</label>
                      <input
                        id="school"
                        type="text"
                        name="school"
                        placeholder="e.g. University of Toronto or Lincoln High"
                        required={isRegister}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder={isRegister ? "Minimum 8 characters" : "Your password"}
                required
                autoComplete={isRegister ? "new-password" : "current-password"}
                minLength={8}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading} aria-busy={loading}>
              {loading
                ? "Please wait…"
                : isRegister
                ? (selectedRole === "TUTOR" ? "Join as Volunteer Tutor →" : "Create Student Account →")
                : "Sign In"}
            </button>
          </form>

          <div className={styles.footerLinks}>
            <p className={styles.toggleText}>
              {isRegister ? "Already have an account?" : "New to Learnivia?"}
              <button
                className={styles.toggleBtn}
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
              >
                {isRegister ? "Sign in" : "Create a free account"}
              </button>
            </p>
          </div>
        </div>

        <p className={styles.termsNote}>
          By continuing, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}

export default function SignInClient({ initialIsRegister = false }: SignInClientProps) {
  return (
    <Suspense>
      <SignInClientInner initialIsRegister={initialIsRegister} />
    </Suspense>
  );
}
