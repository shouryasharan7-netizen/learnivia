"use client";

import { useState, Suspense } from "react";
import { loginWithEmail, loginWithGoogle } from "./actions";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Leaf } from "lucide-react";

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
  const [studentAge, setStudentAge] = useState<string>("");
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
      {/* ── Left decorative panel ── */}
      <aside className={styles.leftPanel} aria-hidden="true">
        <div className={styles.leftPanelBg} />

        {/* Brand */}
        <div className={styles.leftBrandRow}>
          <Image src="/images/logo.png" alt="Learnivia" width={36} height={36} style={{ borderRadius: "8px" }} />
          <span className={styles.leftBrandName}>Learnivia</span>
        </div>

        {/* Central message */}
        <div className={styles.leftContent}>
          <p className={styles.leftTagline}>Free tutoring.</p>
          <p className={styles.leftTagline}>Real humans.</p>
          <p className={styles.leftTaglineAccent}>Zoom calls that click.</p>
          <p className={styles.leftSubtext}>
            Verified volunteer tutors guide K–10 students through private 1-on-1 Zoom sessions — no cost, no sign-up fees, ever.
          </p>

          {/* How it works — 3 simple steps */}
          <ol className={styles.leftSteps}>
            <li className={styles.leftStep}>
              <span className={styles.leftStepNum}>1</span>
              <span className={styles.leftStepText}>Find a verified tutor by subject & grade</span>
            </li>
            <li className={styles.leftStep}>
              <span className={styles.leftStepNum}>2</span>
              <span className={styles.leftStepText}>Book a free private Zoom session</span>
            </li>
            <li className={styles.leftStep}>
              <span className={styles.leftStepNum}>3</span>
              <span className={styles.leftStepText}>Learn 1-on-1 — at your own pace</span>
            </li>
          </ol>
        </div>

        {/* Bottom trust line */}
        <div className={styles.leftFooter}>
          <span className={styles.leftFooterPill}>100% Free</span>
          <span className={styles.leftFooterPill}>K–10 Students</span>
          <span className={styles.leftFooterPill}>140+ Tutors</span>
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>

          {/* Mobile brand (hidden on desktop where left panel shows) */}
          <div className={styles.mobileHeader}>
            <Image src="/images/logo.png" alt="Learnivia" width={40} height={40} style={{ borderRadius: "8px" }} />
            <span className={styles.mobileBrandName}>Learnivia</span>
          </div>

          <h1 className={styles.title}>
            {isRegister
              ? (selectedRole === "TUTOR" ? "Become a volunteer tutor" : "Start learning, free")
              : "Welcome back"}
          </h1>
          <p className={styles.lead}>
            {isRegister
              ? (selectedRole === "TUTOR"
                  ? "Share your knowledge. Earn certified service hours."
                  : "Connect with a verified peer tutor. No cost, ever.")
              : "Sign in to your Learnivia account."}
          </p>

          {/* Role switch (register only) */}
          {isRegister && (
            <div className={styles.roleSwitcher}>
              <button
                type="button"
                className={`${styles.roleBtn} ${selectedRole === "STUDENT" ? styles.roleBtnActive : ""}`}
                onClick={() => setSelectedRole("STUDENT")}
              >
                <GraduationCap size={15} /> I&apos;m a Student
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${selectedRole === "TUTOR" ? styles.roleBtnActive : ""}`}
                onClick={() => setSelectedRole("TUTOR")}
              >
                <Leaf size={15} /> I&apos;m a Tutor
              </button>
            </div>
          )}

          {/* Google button */}
          <form onSubmit={handleGoogleSignIn}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button type="submit" className={styles.googleBtn}>
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <div className={styles.divider} role="separator">
            <span>or use email</span>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className={styles.emailForm} noValidate>
            {error && (
              <div className={styles.errorBanner} role="alert" aria-live="polite">
                <span aria-hidden="true">⚠</span> {error}
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
                          value={studentAge}
                          onChange={(e) => setStudentAge(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="grade">Grade Level</label>
                        <select id="grade" name="grade" required={isRegister} className={styles.selectInput}>
                          <option value="">Select grade…</option>
                          <option value="Kindergarten">Kindergarten</option>
                          <option value="Grade 1-2">Grade 1–2</option>
                          <option value="Grade 3-5">Grade 3–5</option>
                          <option value="Grade 6-8">Grade 6–8</option>
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 10">Grade 10</option>
                        </select>
                      </div>
                    </div>

                    {/* Age Gate & Guardian Acknowledgment for under-13 */}
                    {studentAge && parseInt(studentAge, 10) < 13 && (
                      <div className={styles.inputGroup} style={{ marginTop: "0.5rem" }}>
                        <label htmlFor="parentEmail" style={{ color: "#0E8345", fontWeight: 700 }}>
                          Parent / Guardian Email (Learners under 13)
                        </label>
                        <input
                          id="parentEmail"
                          type="email"
                          name="parentEmail"
                          required
                          placeholder="parent@example.com"
                        />
                        <span style={{ fontSize: "0.75rem", color: "#78716C", marginTop: "0.25rem", display: "block" }}>
                          Learnivia requires parent or guardian acknowledgment for learners under 13 before participating in sessions.
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.inputGroup}>
                    <label htmlFor="educationLevel">Your Education Level</label>
                    <select id="educationLevel" name="educationLevel" required={isRegister} className={styles.selectInput}>
                      <option value="">Select standing…</option>
                      <option value="High School (Grades 11-12)">High School (Grades 11–12)</option>
                      <option value="Undergraduate / College Student">Undergraduate / College</option>
                      <option value="Graduate / Master's / PhD">Graduate / Master's / PhD</option>
                      <option value="Certified Educator / Professional">Certified Educator</option>
                    </select>
                  </div>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="password">Password</label>
                {!isRegister && (
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: "0.8rem",
                      color: "#0E8345",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
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
                ? (selectedRole === "TUTOR" ? "Join as Volunteer Tutor →" : "Create Free Account →")
                : "Sign In →"}
            </button>
          </form>

          <div className={styles.footerLinks}>
            <p className={styles.toggleText}>
              {isRegister ? "Already have an account?" : "New to Learnivia?"}
              <button
                className={styles.toggleBtn}
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(""); }}
              >
                {isRegister ? "Sign in" : "Create a free account"}
              </button>
            </p>
          </div>

          <p className={styles.termsNote}>
            By continuing, you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
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
