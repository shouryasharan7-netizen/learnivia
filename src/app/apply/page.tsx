import styles from "./page.module.css";
import Image from "next/image";

export default function ApplyPage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/become-a-tutor.png" alt="Become a tutor mascot" width={120} height={150} className={styles.mascotImg} />
        <h1 className={styles.title}>Become a Volunteer Tutor</h1>
        <p className={styles.subtitle}>Fill out the application below to join our team of amazing volunteers!</p>
      </div>
      
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input type="text" required placeholder="Jane" />
          </div>
          
          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input type="text" required placeholder="Doe" />
          </div>

          <div className={styles.formGroup}>
            <label>Timezone</label>
            <select required>
              <option value="">Select your timezone</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="America/Denver">Mountain Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Kolkata">India Standard Time</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Grade Levels You Want to Teach</label>
            <div className={styles.checkboxGroup}>
              <label><input type="checkbox" name="grades" value="elementary" /> Elementary School</label>
              <label><input type="checkbox" name="grades" value="middle" /> Middle School</label>
              <label><input type="checkbox" name="grades" value="high" /> High School</label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>About Me (Bio)</label>
            <textarea required rows={4} placeholder="Tell students a little about yourself..."></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>Submit Application</button>
        </form>
      </div>
    </main>
  );
}
