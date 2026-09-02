"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import styles from "./stories.module.css";
import { STORIES_AND_BLOG, type ArticleOrStory } from "./data";

interface DbStory {
  id: string;
  name: string;
  subject: string;
  quote: string;
}

interface StoriesClientProps {
  initialDbStories: DbStory[];
}

const CATEGORIES = [
  { id: "ALL", label: "🌟 All Stories & Guides" },
  { id: "STUDENT_SUCCESS", label: "🎓 Student Success" },
  { id: "TUTOR_SPOTLIGHT", label: "🧑‍🏫 Tutor Spotlights" },
  { id: "STUDY_GUIDE", label: "📝 Study Guides & Blog" },
  { id: "COMMUNITY_NEWS", label: "📢 Platform News" },
] as const;

export default function StoriesClient({ initialDbStories }: StoriesClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<ArticleOrStory | null>(null);

  // Community user-submitted stories state
  const [dbStories, setDbStories] = useState<DbStory[]>(initialDbStories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [subject, setSubject] = useState("");
  const [quote, setQuote] = useState("");

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveArticle(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter articles based on active category & search query
  const filteredArticles = useMemo(() => {
    return STORIES_AND_BLOG.filter((item) => {
      const matchesCategory =
        activeCategory === "ALL" || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Find the featured article
  const featuredArticle = useMemo(() => {
    return (
      filteredArticles.find((a) => a.featured) ||
      (filteredArticles.length > 0 ? filteredArticles[0] : null)
    );
  }, [filteredArticles]);

  // Non-featured articles for the grid
  const gridArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    return filteredArticles.filter((a) => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle]);

  async function handleStorySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quote.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: authorName || "Community Member",
          subject: subject || "Peer Learning",
          quote: quote.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDbStories((prev) => [data.story, ...prev]);
        setSubmissionSuccess(true);
        setQuote("");
        setAuthorName("");
        setSubject("");
      }
    } catch (err) {
      console.error("Failed to submit story:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.main}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgePulse} />
            <span>Stories, Insights & Guides</span>
          </div>

          <h1 className={styles.title}>Learnivia Stories & Blog</h1>
          <p className={styles.subtitle}>
            Explore real student breakthroughs, tutor journeys, test prep masterclasses, and college admissions advice from peer mentors around the globe.
          </p>

          {/* Search Bar */}
          <div className={styles.searchWrap}>
            <svg
              className={styles.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search articles, subjects, or tutor tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search stories and articles"
            />
          </div>
        </div>
      </section>

      {/* 2. Category Filter Navigation Bar */}
      <div className={styles.filterSection}>
        <div className={styles.categoryPills} role="tablist" aria-label="Article categories">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === "ALL"
                ? STORIES_AND_BLOG.length
                : STORIES_AND_BLOG.filter((item) => item.category === cat.id).length;

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`${styles.categoryBtn} ${
                  activeCategory === cat.id ? styles.categoryBtnActive : ""
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className={styles.itemCount}>{count}</span>
              </button>
            );
          })}
        </div>

        <a
          href="#share-story"
          className={styles.shareActionBtn}
        >
          ✍️ Share Your Story
        </a>
      </div>

      <div className={styles.container}>
        {/* 3. Featured Spotlight Story Card */}
        {featuredArticle && !searchQuery && (
          <article
            className={styles.featuredCard}
            onClick={() => setActiveArticle(featuredArticle)}
            tabIndex={0}
            role="button"
            aria-label={`Read featured story: ${featuredArticle.title}`}
            onKeyDown={(e) => e.key === "Enter" && setActiveArticle(featuredArticle)}
          >
            <div className={styles.featuredHeader}>
              <div className={styles.featuredTagRow}>
                <span className={styles.featuredPill}>Featured Story</span>
                <span
                  className={styles.categoryBadge}
                  style={{
                    backgroundColor: featuredArticle.categoryBg,
                    color: featuredArticle.categoryColor,
                  }}
                >
                  {featuredArticle.categoryLabel}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#64748B" }}>
                  {featuredArticle.badge}
                </span>
              </div>
              <span className={styles.readTime}>⏱️ {featuredArticle.readTime}</span>
            </div>

            <h2 className={styles.featuredTitle}>{featuredArticle.title}</h2>
            <p className={styles.featuredExcerpt}>{featuredArticle.excerpt}</p>

            <div className={styles.authorRow}>
              <div className={styles.authorMeta}>
                <div className={styles.avatar}>{featuredArticle.authorAvatar}</div>
                <div>
                  <div className={styles.authorName}>{featuredArticle.authorName}</div>
                  <div className={styles.authorRole}>
                    {featuredArticle.authorRole} • {featuredArticle.authorInstitution}
                  </div>
                </div>
              </div>

              <span className={styles.readMoreBtn}>
                Read full story <span>→</span>
              </span>
            </div>
          </article>
        )}

        {/* 4. Article & Story Grid */}
        <section aria-label="Articles list">
          {gridArticles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B" }}>No matching stories found</h3>
              <p style={{ color: "#64748B", marginTop: "0.5rem" }}>
                Try searching for different keywords or clear your category filter.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("ALL");
                  setSearchQuery("");
                }}
                style={{
                  marginTop: "1.25rem",
                  background: "#14243B",
                  color: "#FFFFFF",
                  padding: "0.6rem 1.25rem",
                  borderRadius: "9999px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {gridArticles.map((item) => (
                <article
                  key={item.id}
                  className={styles.card}
                  onClick={() => setActiveArticle(item)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Read story: ${item.title}`}
                  onKeyDown={(e) => e.key === "Enter" && setActiveArticle(item)}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.tagRow}>
                      <span
                        className={styles.categoryBadge}
                        style={{
                          backgroundColor: item.categoryBg,
                          color: item.categoryColor,
                        }}
                      >
                        {item.categoryLabel}
                      </span>
                      <span className={styles.readTime}>{item.readTime}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardExcerpt}>{item.excerpt}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.authorMeta}>
                      <div className={styles.avatar} style={{ width: 34, height: 34, fontSize: "1.1rem" }}>
                        {item.authorAvatar}
                      </div>
                      <div>
                        <div className={styles.authorName} style={{ fontSize: "0.875rem" }}>
                          {item.authorName}
                        </div>
                        <div className={styles.authorRole} style={{ fontSize: "0.75rem" }}>
                          {item.authorInstitution || item.authorRole}
                        </div>
                      </div>
                    </div>

                    <span className={styles.readMoreBtn} style={{ fontSize: "0.85rem" }}>
                      Read <span>→</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 5. Community Testimonials & Voices */}
        {dbStories.length > 0 && (
          <section className={styles.testimonialsSection} aria-label="Community voices">
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Community Voices</h2>
                <p style={{ color: "#64748B", fontSize: "0.95rem", marginTop: "0.25rem" }}>
                  Short notes and experiences sent in directly by students, tutors, and parents.
                </p>
              </div>
            </div>

            <div className={styles.quoteGrid}>
              {dbStories.map((s) => (
                <div key={s.id} className={styles.quoteCard}>
                  <p className={styles.quoteText}>{s.quote}</p>
                  <div className={styles.quoteAuthor}>
                    <span className={styles.quoteName}>{s.name}</span>
                    <span className={styles.quoteSubject}>{s.subject}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Interactive "Share Your Story" Form */}
        <section id="share-story" className={styles.shareStoryBox}>
          <h2 className={styles.shareStoryTitle}>Have a Learnivia Experience to Share?</h2>
          <p className={styles.shareStorySub}>
            Whether you reached a new personal best on an exam, found mentorship with an inspiring tutor, or loved volunteering, your story inspires thousands of fellow learners worldwide.
          </p>

          {submissionSuccess ? (
            <div style={{ background: "rgba(14, 131, 69, 0.2)", border: "1.5px solid #0E8345", borderRadius: "1rem", padding: "2rem", maxWidth: 540, margin: "0 auto" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</div>
              <h3 style={{ color: "#FFFFFF", fontSize: "1.25rem", fontWeight: 700 }}>Thank You for Sharing!</h3>
              <p style={{ color: "#E2E8F0", marginTop: "0.5rem", fontSize: "0.95rem" }}>
                Your story has been added to our community voices. Thank you for making peer learning welcoming for everyone!
              </p>
              <button
                type="button"
                onClick={() => setSubmissionSuccess(false)}
                style={{
                  marginTop: "1.25rem",
                  background: "#0E8345",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "0.6rem 1.25rem",
                  borderRadius: "9999px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Submit another note
              </button>
            </div>
          ) : (
            <form onSubmit={handleStorySubmit} className={styles.submissionForm}>
              <div className={styles.formRow}>
                <div>
                  <label className={styles.formLabel}>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus or Anya R."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Subject or Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Digital SAT or Peer Tutor"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Story or Quote *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share how a tutoring session, workshop, or volunteer teaching experience impacted you..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !quote.trim()}
                className={styles.submitBtn}
              >
                {isSubmitting ? "Sharing..." : "Publish My Story to Community"}
              </button>
            </form>
          )}
        </section>
      </div>

      {/* 7. Full Article / Story Reader Modal */}
      {activeArticle && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveArticle(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-article-title"
        >
          <div className={styles.modalContent}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setActiveArticle(null)}
              aria-label="Close reader"
            >
              ✕
            </button>

            <span
              className={styles.modalCategoryBadge}
              style={{
                backgroundColor: activeArticle.categoryBg,
                color: activeArticle.categoryColor,
              }}
            >
              {activeArticle.categoryLabel}
            </span>

            <h2 id="modal-article-title" className={styles.modalTitle}>
              {activeArticle.title}
            </h2>

            <div className={styles.modalAuthorStrip}>
              <div className={styles.authorMeta}>
                <div className={styles.avatar}>{activeArticle.authorAvatar}</div>
                <div>
                  <div className={styles.authorName}>{activeArticle.authorName}</div>
                  <div className={styles.authorRole}>
                    {activeArticle.authorRole} • {activeArticle.authorInstitution}
                  </div>
                </div>
              </div>
              <div style={{ color: "#64748B", fontSize: "0.85rem", fontWeight: 500 }}>
                📅 {activeArticle.publishedDate} • ⏱️ {activeArticle.readTime}
              </div>
            </div>

            <div className={styles.modalBody}>
              {activeArticle.fullContent.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
              <div className={styles.takeawaysCard}>
                <div className={styles.takeawaysTitle}>
                  <span>💡</span> Key Takeaways & Action Points
                </div>
                <ul className={styles.takeawaysList}>
                  {activeArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.modalCtaRow}>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "9999px",
                  fontWeight: 600,
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                ← Back to Stories & Blog
              </button>

              {activeArticle.ctaLink && (
                <Link
                  href={activeArticle.ctaLink}
                  className={styles.modalCtaBtn}
                  onClick={() => setActiveArticle(null)}
                >
                  {activeArticle.ctaText || "Explore Sessions →"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
