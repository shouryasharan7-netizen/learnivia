"use client";

import { useState } from "react";
import { loginWithEmail, loginWithGoogle } from "./actions";
import styles from "./page.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignInClient() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("action", isRegister ? "register" : "login");

    const result = await loginWithEmail(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      // Middleware will catch and redirect to onboarding if needed
      window.location.href = "/dashboard";
    }
  }

  return (
    <main className={styles.main}>
      {/* Background Shapes mimicking Schoolhouse */}
      <div className={styles.bgShape1}></div>
      <div className={styles.bgShape2}></div>
      <div className={styles.bgShape3}></div>

      <div className={styles.container}>
        <h1 className={styles.title}>{isRegister ? "Sign Up" : "Sign In"}</h1>
        
        <div className={styles.card}>
          <form action={loginWithGoogle}>
            <button type="submit" className={styles.googleBtn}>
              <Image src="/images/logo.png" alt="Google" width={20} height={20} className={styles.googleIcon} />
              Sign in with Google
            </button>
          </form>

          <div className={styles.divider}>
            <span>Or sign in with email</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.emailForm}>
            {error && <div className={styles.errorBanner}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" name="email" placeholder="Type your email address" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" name="password" placeholder="Your password" required />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Loading..." : (isRegister ? "Sign Up" : "Sign In")}
            </button>
          </form>

          <div className={styles.footerLinks}>
            {!isRegister && <a href="#" className={styles.forgotLink}>Don't remember your password?</a>}
            <p className={styles.toggleText}>
              {isRegister ? "Already have an account?" : "Need an account?"}
              <button className={styles.toggleBtn} onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
