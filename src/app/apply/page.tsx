import { auth } from "@/auth";
import styles from "./page.module.css";
import Image from "next/image";
import { submitApplication } from "./actions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Volunteer Tutor",
  description: "Apply to become a volunteer tutor on Learnivia. Help students for free and earn verified volunteer hours.",
};

export default async function ApplyPage() {
  const session = await auth();

  if (!session?.user) {
    // Don't silently redirect — show the form, explain why sign-in is needed,
    // and send them back to /apply after sign-in
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
              You need a Learnivia account to submit your volunteer application. It only takes a minute and it's completely free.
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

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/become-a-tutor.png" alt="" width={120} height={150} className={styles.mascotImg} />
        <h1 className={styles.title}>Volunteer Tutor Application</h1>
        <p className={styles.subtitle}>
          Tell us about yourself. Our team reviews every application — we'll be in touch within a few days.
        </p>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.progressBar} aria-label="Application progress">
          <div className={styles.progressStep}>
            <div className={`${styles.progressDot} ${styles.progressDotActive}`}>1</div>
            <span>About you</span>
          </div>
          <div className={styles.progressLine} />
          <div className={styles.progressStep}>
            <div className={styles.progressDot}>2</div>
            <span>Review</span>
          </div>
        </div>

        <form action={submitApplication} className={styles.form}>
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Your details</h2>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input type="text" value={session.user.name || ""} disabled className={styles.disabledInput} />
              <span className={styles.fieldHint}>From your account</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="school">School / University (optional)</label>
              <input id="school" type="text" name="school" placeholder="e.g. University of Edinburgh" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timezone">Your timezone *</label>
              <select id="timezone" name="timezone" required>
                <option value="">Select your timezone</option>
                <optgroup label="Americas">
                  <option value="America/Los_Angeles">Pacific Time (US)</option>
                  <option value="America/Denver">Mountain Time (US)</option>
                  <option value="America/Chicago">Central Time (US)</option>
                  <option value="America/New_York">Eastern Time (US)</option>
                  <option value="America/Toronto">Eastern Time (Canada)</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Paris / Berlin (CET)</option>
                  <option value="Europe/Moscow">Moscow (MSK)</option>
                </optgroup>
                <optgroup label="Asia & Pacific">
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Dubai">Gulf Standard Time (UAE)</option>
                  <option value="Asia/Singapore">Singapore / Malaysia</option>
                  <option value="Asia/Tokyo">Japan / Korea</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>What you'll teach</h2>
            <div className={styles.formGroup}>
              <label>Grade levels you can support *</label>
              <div className={styles.checkboxGroup} role="group" aria-required="true">
                {[
                  { value: "primary", label: "Primary (Years 1–6)" },
                  { value: "lower-secondary", label: "Lower Secondary (Years 7–9)" },
                  { value: "gcse", label: "GCSE / O-Level" },
                  { value: "alevel", label: "A-Level / AP" },
                  { value: "university", label: "University (intro courses)" },
                ].map(g => (
                  <label key={g.value} className={styles.checkboxLabel}>
                    <input type="checkbox" name="grades" value={g.value} />
                    {g.label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subjects">Subjects you can teach *</label>
              <input id="subjects" type="text" name="subjects" placeholder="e.g. Maths, Biology, English Literature" required />
              <span className={styles.fieldHint}>Comma-separated list</span>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>About you</h2>
            <div className={styles.formGroup}>
              <label htmlFor="bio">Tell students about yourself *</label>
              <textarea
                id="bio"
                name="bio"
                required
                rows={5}
                placeholder="Share your background, teaching approach, and what you love about your subject. This will appear on your tutor profile."
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
                placeholder="Any tutoring, mentoring, or teaching experience — paid or unpaid"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Acknowledgements</h2>
            <div className={styles.checkboxGroup} role="group">
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="guidelines" required />
                I have read and agree to the{" "}
                <Link href="/safety" target="_blank" rel="noreferrer">Community Guidelines</Link>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="safeguarding" required />
                I understand that sessions are with real students and I will treat all learners with respect and professionalism
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="privacy" required />
                I agree to the{" "}
                <Link href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</Link>
              </label>
            </div>
          </div>

          <div className={styles.formNote}>
            <strong>What happens next:</strong> Our team will review your application and reply by email within 3–5 working days. Your profile will only appear to students after approval.
          </div>

          <button type="submit" className={styles.submitBtn}>
            Submit application
          </button>
        </form>
      </div>
    </main>
  );
}
