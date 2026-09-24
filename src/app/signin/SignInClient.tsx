"use client";

import { useState, Suspense } from "react";
import { loginWithEmail, loginWithGoogle } from "./actions";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, BookOpen, Users, Shield, CheckCircle2 } from "lucide-react";

/* ── Google Icon ─────────────────────────────────────────── */
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

const STUDENT_FEATURES = [
  { icon: BookOpen, text: "Free 1-on-1 Zoom sessions with verified tutors" },
  { icon: Users, text: "K-10 students supported across CBSE, ICSE, IB & more" },
  { icon: Shield, text: "Supervised, safe learning environment" },
  { icon: CheckCircle2, text: "No subscriptions, no fees — ever" },
];

const TUTOR_FEATURES = [
  { icon: BookOpen, text: "Share your knowledge with K-10 students" },
  { icon: CheckCircle2, text: "Earn certified volunteer service hours" },
  { icon: Users, text: "Build your teaching portfolio & skills" },
  { icon: Shield, text: "Verified & background-screened program" },
];

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
    if (isRegister) formData.append("role", selectedRole);

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

  const features = selectedRole === "TUTOR" ? TUTOR_FEATURES : STUDENT_FEATURES;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
    }}>

      {/* ── Top brand bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <Image src="/images/logo.png" alt="Learnivia" width={32} height={32} style={{ borderRadius: "8px" }} />
          <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#0C1B33", letterSpacing: "-0.02em" }}>
            Learnivia
          </span>
        </Link>
        <span style={{ fontSize: "0.875rem", color: "#64748B" }}>
          {isRegister ? "Already have an account? " : "New to Learnivia? "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: "none",
              border: "none",
              color: "#0D9488",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.875rem",
              padding: 0,
            }}
          >
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </span>
      </div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        padding: "3rem 2rem",
        gap: "4rem",
        alignItems: "center",
      }}>

        {/* ── Left: Info panel ── */}
        <div>
          {/* Role toggle — visible only on signup */}
          {isRegister && (
            <div style={{
              display: "inline-flex",
              background: "#E2E8F0",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "2rem",
              gap: "4px",
            }}>
              {(["STUDENT", "TUTOR"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "9px",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 180ms",
                    background: selectedRole === role ? "#fff" : "transparent",
                    color: selectedRole === role ? "#0C1B33" : "#64748B",
                    boxShadow: selectedRole === role ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {role === "STUDENT" ? "🎒 I'm a Learner" : "📚 I'm a Tutor"}
                </button>
              ))}
            </div>
          )}

          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontWeight: 800,
            color: "#0C1B33",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            margin: "0 0 1rem",
          }}>
            {isRegister
              ? selectedRole === "TUTOR"
                ? "Volunteer to teach. Make a real difference."
                : "Learn for free from verified peer tutors."
              : "Welcome back to Learnivia."}
          </h1>

          <p style={{
            fontSize: "1.05rem",
            color: "#475569",
            lineHeight: 1.65,
            margin: "0 0 2rem",
            maxWidth: "440px",
          }}>
            {isRegister
              ? selectedRole === "TUTOR"
                ? "Join hundreds of high school and college volunteers helping K-10 students build confidence in Math, Science, and English."
                : "Connect with verified volunteer tutors for free 1-on-1 Zoom sessions. No subscriptions, no fees — ever."
              : "Sign in to continue your learning journey or manage your tutoring sessions."}
          </p>

          {/* Features list */}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {features.map(({ icon: Icon, text }) => (
              <li key={text} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "#F0FDFA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={16} color="#0D9488" strokeWidth={2} />
                </div>
                <span style={{ fontSize: "0.9rem", color: "#334155", fontWeight: 500 }}>{text}</span>
              </li>
            ))}
          </ul>

          {/* Trust badges */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "2.5rem",
            flexWrap: "wrap",
          }}>
            {["100% Free", "K–10 Students", "Verified Tutors", "Safe & Supervised"].map((b) => (
              <span key={b} style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "9999px",
                background: "#F0FDFA",
                color: "#0D9488",
                fontSize: "0.775rem",
                fontWeight: 700,
                border: "1px solid #99F6E4",
              }}>{b}</span>
            ))}
          </div>
        </div>

        {/* ── Right: Form card ── */}
        <div style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: "20px",
          padding: "2.5rem 2.25rem",
          boxShadow: "0 4px 24px rgba(12,27,51,0.07)",
        }}>
          <h2 style={{
            fontSize: "1.375rem",
            fontWeight: 800,
            color: "#0C1B33",
            margin: "0 0 0.35rem",
            letterSpacing: "-0.02em",
          }}>
            {isRegister
              ? selectedRole === "TUTOR" ? "Create tutor account" : "Create learner account"
              : "Sign in to your account"}
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#64748B", margin: "0 0 1.5rem" }}>
            {isRegister ? "Free forever. No credit card required." : "Enter your credentials to continue."}
          </p>

          {/* ── Google button ── */}
          <form onSubmit={handleGoogleSignIn}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button
              type="submit"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.65rem",
                padding: "0.75rem 1.5rem",
                border: "1.5px solid #E2E8F0",
                borderRadius: "10px",
                background: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "#0C1B33",
                cursor: "pointer",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1";
                (e.currentTarget as HTMLElement).style.background = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                (e.currentTarget as HTMLElement).style.background = "#fff";
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          {/* ── Divider ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "1.25rem 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
            <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 500 }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
          </div>

          {/* ── Email form ── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }} noValidate>
            {error && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 0.875rem",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "8px",
                fontSize: "0.8375rem",
                color: "#DC2626",
              }} role="alert">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            {isRegister && (
              <>
                <input type="hidden" name="role" value={selectedRole} />
                <Field id="name" label="Full Name" type="text"
                  placeholder={selectedRole === "TUTOR" ? "e.g. Arjun Mehta" : "e.g. Maya Lin"}
                  required autoComplete="name"
                />

                {selectedRole === "STUDENT" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <Field id="age" label="Age" type="number"
                      placeholder="e.g. 12" required
                      min="5" max="18"
                      value={studentAge}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentAge(e.target.value)}
                    />
                    <div>
                      <label htmlFor="grade" style={labelStyle}>Grade</label>
                      <select id="grade" name="grade" required style={inputStyle}>
                        <option value="">Select grade…</option>
                        <option>Kindergarten</option>
                        <option>Grade 1-2</option>
                        <option>Grade 3-5</option>
                        <option>Grade 6-8</option>
                        <option>Grade 9</option>
                        <option>Grade 10</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="educationLevel" style={labelStyle}>Education Level</label>
                    <select id="educationLevel" name="educationLevel" required style={inputStyle}>
                      <option value="">Select standing…</option>
                      <option>High School (Grades 11-12)</option>
                      <option>Undergraduate / College</option>
                      <option>Graduate / Master&apos;s / PhD</option>
                      <option>Certified Educator</option>
                    </select>
                  </div>
                )}

                {/* Under-13 parent email */}
                {studentAge && parseInt(studentAge, 10) < 13 && (
                  <div>
                    <label htmlFor="parentEmail" style={{ ...labelStyle, color: "#0D9488" }}>
                      Parent / Guardian Email <span style={{ fontWeight: 400, color: "#64748B" }}>(required for under 13)</span>
                    </label>
                    <input id="parentEmail" name="parentEmail" type="email"
                      required placeholder="parent@example.com"
                      autoComplete="email" style={inputStyle}
                    />
                  </div>
                )}
              </>
            )}

            <Field id="email" label="Email address" type="email"
              placeholder="you@example.com" required autoComplete="email"
            />

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <label htmlFor="password" style={labelStyle}>Password</label>
                {!isRegister && (
                  <Link href="/forgot-password" style={{ fontSize: "0.8rem", color: "#0D9488", fontWeight: 600, textDecoration: "none" }}>
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder={isRegister ? "Create a strong password" : "Enter your password"}
                required
                minLength={isRegister ? 8 : 1}
                autoComplete={isRegister ? "new-password" : "current-password"}
                style={inputStyle}
              />
              {isRegister && (
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#94A3B8" }}>
                  Minimum 8 characters
                </p>
              )}
            </div>

            {/* Terms checkbox on signup */}
            {isRegister && (
              <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" name="terms" required style={{ marginTop: "2px", accentColor: "#0D9488" }} />
                <span style={{ fontSize: "0.8rem", color: "#64748B", lineHeight: 1.5 }}>
                  I agree to Learnivia&apos;s{" "}
                  <Link href="/terms" style={{ color: "#0D9488", fontWeight: 600 }}>Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" style={{ color: "#0D9488", fontWeight: 600 }}>Privacy Policy</Link>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.8rem",
                background: loading ? "#5EEAD4" : "#0D9488",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 150ms",
                marginTop: "0.25rem",
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#0F766E"; }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#0D9488"; }}
            >
              {loading
                ? "Please wait…"
                : isRegister
                ? `Create ${selectedRole === "TUTOR" ? "Tutor" : "Learner"} Account`
                : "Sign In"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.8375rem", color: "#64748B", margin: "0.25rem 0 0" }}>
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0D9488",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.8375rem",
                  padding: 0,
                }}
              >
                {isRegister ? "Sign in" : "Create free account"}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* ── Mobile layout override ── */}
      <style>{`
        @media (max-width: 768px) {
          .sh-auth-grid { grid-template-columns: 1fr !important; gap: 2rem !important; padding: 1.5rem !important; }
          .sh-auth-left { display: none; }
        }
      `}</style>
    </div>
  );
}

/* ── Shared input styles ── */
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8375rem",
  fontWeight: 600,
  color: "#334155",
  marginBottom: "0.35rem",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.6rem 0.85rem",
  border: "1.5px solid #E2E8F0",
  borderRadius: "8px",
  fontSize: "0.9rem",
  color: "#0C1B33",
  background: "#fff",
  outline: "none",
  transition: "border-color 150ms",
  boxSizing: "border-box",
};

function Field({
  id,
  label,
  type,
  placeholder,
  required,
  autoComplete,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  min?: string;
  max?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={inputStyle}
        onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#0D9488"; }}
        onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; }}
      />
    </div>
  );
}

export default function SignInClient(props: SignInClientProps) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F8FAFC" }} />}>
      <SignInClientInner {...props} />
    </Suspense>
  );
}
