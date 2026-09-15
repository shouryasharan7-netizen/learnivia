import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await prisma.program.findUnique({ where: { slug } });
  if (!program) return { title: "Program not found" };
  return {
    title: program.title,
    description: program.shortDescription,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await prisma.program.findUnique({ 
    where: { slug },
    include: { faqs: true } 
  });
  
  if (!program) notFound();

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.inner}>
          <Link href="/learn" className={styles.backLink}>← All programs</Link>
          <div className={styles.heroEmoji} aria-hidden="true">{program.emoji}</div>
          <h1 className={styles.title}>{program.title}</h1>
          <p className={styles.subtitle}>{program.longDescription}</p>
          <div className={styles.heroCtas}>
            <Link href="/find" className={styles.primaryBtn}>Find a tutor for this program</Link>
            <Link href="/apply" className={styles.secondaryBtn}>Volunteer as a tutor</Link>
          </div>
        </div>
      </section>

      {/* Details grid */}
      <section className={styles.detailsSection}>
        <div className={styles.inner}>
          <div className={styles.detailsGrid}>
            {/* Left: details */}
            <div>
              <div className={styles.detailCard}>
                <h2 className={styles.detailTitle}>Session details</h2>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Format</span>
                  <span className={styles.detailValue}>{program.format}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Duration</span>
                  <span className={styles.detailValue}>{program.duration}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Cost</span>
                  <span className={`${styles.detailValue} ${styles.free}`}>Free</span>
                </div>
              </div>

              <div className={styles.detailCard}>
                <h2 className={styles.detailTitle}>Subjects covered</h2>
                <div className={styles.tagList}>
                  {program.subjects.map(s => (
                    <span key={s} className={styles.tag}>{s}</span>
                  ))}
                </div>
              </div>

              <div className={styles.detailCard}>
                <h2 className={styles.detailTitle}>Grade levels</h2>
                <div className={styles.tagList}>
                  {program.gradeLevels.map(g => (
                    <span key={g} className={styles.gradeTag}>{g}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: outcomes + FAQ */}
            <div>
              <div className={styles.detailCard}>
                <h2 className={styles.detailTitle}>What you&apos;ll get</h2>
                <ul className={styles.outcomeList}>
                  {program.outcomes.map(o => (
                    <li key={o} className={styles.outcomeItem} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Check size={14} color="var(--color-forest, #234B3B)" style={{ flexShrink: 0 }} /> {o}
                    </li>
                  ))}
                </ul>
              </div>

              {program.faqs && program.faqs.length > 0 && (
                <div className={styles.detailCard}>
                  <h2 className={styles.detailTitle}>Common questions</h2>
                  <div className={styles.faqList}>
                    {program.faqs.map(q => (
                      <details key={q.question} className={styles.faqItem}>
                        <summary className={styles.faqQuestion}>{q.question}</summary>
                        <p className={styles.faqAnswer}>{q.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.ctaCard}>
                <h3>Ready to get started?</h3>
                <p>Sessions are free. Pick a tutor and book a time that works for you.</p>
                <Link href="/find" className={styles.primaryBtn}>Find a tutor →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
