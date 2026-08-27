import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function FindTutorPage() {
  const tutors = await prisma.tutorProfile.findMany({
    where: { status: "APPROVED" },
    include: { 
      user: true,
      subjects: { include: { subject: true } }
    }
  });

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/find-a-tutor.png" alt="Find a tutor mascot" width={120} height={150} className={styles.mascotImg} />
        <h1 className={styles.title}>Find a Volunteer Tutor</h1>
        <p className={styles.subtitle}>Browse our amazing volunteer tutors and book a free session.</p>
      </div>

      {/* Simple MVP Filters (Visual Only for now) */}
      <div className={styles.filters}>
        <input type="text" placeholder="Search by subject or name..." className={styles.searchInput} />
        <select className={styles.filterSelect}>
          <option value="">All Grade Levels</option>
          <option value="elementary">Elementary School</option>
          <option value="middle">Middle School</option>
          <option value="high">High School</option>
        </select>
      </div>

      <div className={styles.tutorGrid}>
        {tutors.length === 0 ? (
          <p className={styles.noTutors}>No tutors are currently available. Check back soon!</p>
        ) : (
          tutors.map(tutor => (
            <div key={tutor.id} className={styles.tutorCard}>
              <div className={styles.tutorHeader}>
                <div className={styles.avatarPlaceholder}>
                  {tutor.user.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <h2 className={styles.tutorName}>{tutor.user.name}</h2>
                  <p className={styles.tutorTimezone}>🌍 {tutor.user.timezone || "UTC"}</p>
                </div>
              </div>
              <p className={styles.tutorBio}>
                {tutor.bio.length > 100 ? `${tutor.bio.substring(0, 100)}...` : tutor.bio}
              </p>
              
              <div className={styles.tags}>
                {/* Fallback tags if no subjects are mapped yet */}
                <span className={styles.tag}>Math</span>
                <span className={styles.tag}>Science</span>
              </div>

              <Link href={`/tutor/${tutor.id}`} className={styles.viewProfileBtn}>
                View Profile & Book
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
