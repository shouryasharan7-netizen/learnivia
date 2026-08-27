import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning Programs",
  description: "Browse all Learnivia programs — free, one-on-one tutoring from homework help to exam prep.",
};

export default async function LearnPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>Explore learning programs</h1>
          <p className={styles.subtitle}>
            Every program is free. Every session is one-on-one with a volunteer tutor. Choose what you need.
          </p>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.inner}>
          <div className={styles.grid}>
            {programs.map(p => (
              <Link key={p.slug} href={`/learn/${p.slug}`} className={styles.card}>
                <span className={styles.emoji} aria-hidden="true">{p.emoji}</span>
                <h2 className={styles.cardTitle}>{p.title}</h2>
                <p className={styles.cardDesc}>{p.shortDescription}</p>
                <div className={styles.tags}>
                  {p.gradeLevels.slice(0, 2).map(g => (
                    <span key={g} className={styles.tag}>{g}</span>
                  ))}
                </div>
                <span className={styles.learnMore}>Explore program →</span>
              </Link>
            ))}
          </div>

          <div className={styles.findCta}>
            <p>Already know what you need?</p>
            <Link href="/find" className={styles.findBtn}>Browse all tutors directly →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
