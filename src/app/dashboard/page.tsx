import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cancelBooking } from "@/app/actions/sessions";
import { cancelWorkshopEnrollment } from "@/app/actions/workshops";

export const metadata = {
  title: "Dashboard — Learnivia",
  description: "Your personalized Learnivia peer learning dashboard.",
};

const FAST_CARDS = [
  {
    id: "sat",
    badge: "SAT",
    badgeBg: "#7C3AED",
    badgeText: "SAT BOOTCAMP",
    hasDot: true,
    title: "SAT",
    desc: "Join intensive SAT prep sessions",
    href: "/sessions",
  },
  {
    id: "caw",
    badge: "CAW",
    badgeBg: "#2563EB",
    badgeText: "CAW WORKSHOP",
    hasDot: true,
    title: "College Admissions Workshops",
    desc: "Get advice from college students",
    href: "/sessions",
  },
  {
    id: "dia",
    badge: "DIA",
    badgeBg: "#D97706",
    badgeText: "DIA DIALOGUE",
    hasDot: true,
    title: "Dialogues",
    desc: "Discuss interesting topics with peers",
    href: "/community",
  },
  {
    id: "comm",
    icon: "search",
    iconBg: "#E6F4EA",
    iconColor: "#0E8345",
    title: "Community Sessions",
    desc: "Choose a subject to learn",
    href: "/sessions",
  },
  {
    id: "hw",
    icon: "chat",
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
    title: "Homework Help",
    desc: "Get instant help with your work",
    href: "/homework-help",
  },
];

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className={styles.main}>
        <div className={styles.unauthCard}>
          <h1>Please Sign In</h1>
          <p>You need to sign in to access your dashboard.</p>
          <Link href="/signin" className={styles.primaryBtn}>Sign In</Link>
        </div>
      </main>
    );
  }

  const [upcomingBookings, completedBookings, enrolledWorkshops] = await Promise.all([
    prisma.booking.findMany({
      where: { 
        studentId: session.user.id,
        status: "CONFIRMED"
      },
      include: {
        tutor: { include: { user: true } }
      },
      orderBy: { startTime: "asc" }
    }),
    prisma.booking.findMany({
      where: { 
        studentId: session.user.id,
        status: "COMPLETED"
      },
      include: {
        tutor: { include: { user: true } }
      },
      orderBy: { startTime: "desc" },
      take: 5,
    }),
    prisma.workshopEnrollment.findMany({
      where: { studentId: session.user.id },
      include: {
        workshop: {
          include: {
            tutor: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const userName = session.user.name || "Learner";
  const userInitials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* 1. Hero Promo Banner (Sky blue illustrated) */}
        <section className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <h1 className={styles.promoTitle}>
              Sign up for college admissions workshops
            </h1>
            <p className={styles.promoSubtitle}>
              Work with a current college student to create your college list, fill out your college apps, and write your college essays!
            </p>
            <Link href="/sessions" className={styles.promoBtn}>
              See available workshops
            </Link>
          </div>

          <div className={styles.promoIllustration} aria-hidden="true">
            <div className={styles.deskIllustration}>
              <span className={styles.deskMascot}>👩‍🎓</span>
              <span className={styles.deskLaptop}>💻</span>
              <span className={styles.deskBooks}>📚</span>
            </div>
            <div className={styles.carouselDots}>
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
            </div>
          </div>
        </section>

        {/* 2. Fast-Access Feature Cards (Row of 5 cards) */}
        <section className={styles.fastCardsGrid} aria-label="Learning pathways">
          {FAST_CARDS.map((card) => (
            <Link key={card.id} href={card.href} className={styles.fastCard}>
              {card.hasDot && <span className={styles.blueDot} aria-hidden="true" />}
              {card.badge ? (
                <div className={styles.squareBadge} style={{ background: card.badgeBg }}>
                  <span>{card.badgeText}</span>
                </div>
              ) : (
                <div className={styles.circleBadge} style={{ background: card.iconBg, color: card.iconColor }}>
                  {card.icon === "search" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  )}
                </div>
              )}
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDesc}>{card.desc}</p>
            </Link>
          ))}
        </section>

        {/* 3. User Progress & Stats Strip */}
        <section className={styles.userStrip} aria-label="Student progress">
          <div className={styles.userProfileBlock}>
            <div className={styles.avatarCircle}>{userInitials}</div>
            <div className={styles.userMeta}>
              <h2 className={styles.userDisplayName}>{userName}</h2>
              <div className={styles.userLinks}>
                <Link href="/tutor/transcript" className={styles.metaLink}>Portfolio</Link>
                <Link href="/tutor/transcript" className={styles.metaLink}>Certifications</Link>
              </div>
            </div>
          </div>

          <div className={styles.statsBlock}>
            <div className={styles.statPill}>
              <span className={styles.statIcon}>🏆</span>
              <div className={styles.statValueCol}>
                <span className={styles.statNumber}>186</span>
                <span className={styles.statUnit}>SP</span>
              </div>
            </div>

            <div className={styles.statPill}>
              <span className={styles.statIcon}>⏱️</span>
              <div className={styles.statValueCol}>
                <span className={styles.statNumber}>2,233</span>
                <span className={styles.statUnit}>Learning minutes</span>
              </div>
            </div>

            <Link href="/community" className={styles.leaderboardLink}>
              <span className={styles.leaderboardIcons}>🥇 👥 🥈</span>
              <span>Leaderboards</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>

        {/* 4. Two Columns: Upcoming Sessions & Tasks */}
        <div className={styles.twoColGrid}>
          {/* Left Column: Upcoming Sessions */}
          <section className={styles.sessionsCol}>
            <div className={styles.colHeader}>
              <h2 className={styles.colTitle}>Upcoming Sessions</h2>
              <Link href="/sessions" className={styles.viewAllLink}>
                View All &gt;
              </Link>
            </div>

            {upcomingBookings.length === 0 && enrolledWorkshops.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon} aria-hidden="true">🗓️</div>
                <h3 className={styles.emptyTitle}>No upcoming sessions</h3>
                <p className={styles.emptyText}>
                  Explore live sessions starting this week or book a 1-on-1 session with a volunteer tutor.
                </p>
                <Link href="/sessions" className={styles.browseBtn}>
                  Find a Session →
                </Link>
              </div>
            ) : (
              <div className={styles.sessionsList}>
                {/* 1-on-1 bookings */}
                {upcomingBookings.map((b) => (
                  <div key={b.id} className={styles.bookingCard}>
                    <div className={styles.bookingDetails}>
                      <span className={styles.sessionTypeBadge}>1-on-1 Tutoring</span>
                      <h3 className={styles.bookingTitle}>{b.subject} with {b.tutor.user.name}</h3>
                      <p className={styles.bookingTime}>
                        📅 {new Date(b.startTime).toLocaleDateString()} at{" "}
                        {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {b.topic && <p className={styles.bookingTopic}>Topic: {b.topic}</p>}
                    </div>

                    <div className={styles.bookingActions}>
                      <a href={b.zoomLink || "#"} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                        🎥 Join Zoom
                      </a>
                      <form action={cancelBooking}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <button type="submit" className={styles.cancelLink}>Cancel</button>
                      </form>
                    </div>
                  </div>
                ))}

                {/* Enrolled workshops */}
                {enrolledWorkshops.map((e) => (
                  <div key={e.id} className={styles.bookingCard}>
                    <div className={styles.bookingDetails}>
                      <span className={styles.workshopBadge}>Group Workshop</span>
                      <h3 className={styles.bookingTitle}>{e.workshop.title}</h3>
                      <p className={styles.bookingTime}>
                        Host: {e.workshop.tutor.user.name} • 📅 {new Date(e.workshop.startTime).toLocaleDateString()} at{" "}
                        {new Date(e.workshop.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className={styles.bookingActions}>
                      {e.workshop.zoomLink && (
                        <a href={e.workshop.zoomLink} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                          🎥 Join Zoom
                        </a>
                      )}
                      <form action={cancelWorkshopEnrollment}>
                        <input type="hidden" name="workshopId" value={e.workshop.id} />
                        <button type="submit" className={styles.cancelLink}>Leave</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed sessions */}
            {completedBookings.length > 0 && (
              <div className={styles.completedBlock}>
                <h3 className={styles.subHeading}>Past Completed Sessions</h3>
                <div className={styles.completedList}>
                  {completedBookings.map((b) => (
                    <div key={b.id} className={styles.completedRow}>
                      <div>
                        <strong>{b.subject}</strong> with {b.tutor.user.name}
                        <span className={styles.completedDate}>
                          ✓ {new Date(b.startTime).toLocaleDateString()}
                        </span>
                      </div>
                      <Link href={`/tutor/${b.tutorId}`} className={styles.viewTutorBtn}>
                        View Tutor
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right Column: Tasks */}
          <section className={styles.tasksCol}>
            <div className={styles.colHeader}>
              <h2 className={styles.colTitle}>Tasks</h2>
            </div>

            <div className={styles.tasksCard}>
              <ul className={styles.taskList}>
                <li className={styles.taskItem}>
                  <span className={styles.checkCircle}>✓</span>
                  <div>
                    <strong className={styles.taskTitle}>Welcome to Learnivia!</strong>
                    <p className={styles.taskDesc}>Your account is active and ready for peer learning.</p>
                  </div>
                </li>
                <li className={styles.taskItem}>
                  <span className={styles.pendingCircle}>○</span>
                  <div>
                    <strong className={styles.taskTitle}>RSVP for a Study Room</strong>
                    <p className={styles.taskDesc}>Browse upcoming math and science workshops.</p>
                    <Link href="/sessions" className={styles.taskActionLink}>
                      Browse sessions →
                    </Link>
                  </div>
                </li>
                <li className={styles.taskItem}>
                  <span className={styles.pendingCircle}>○</span>
                  <div>
                    <strong className={styles.taskTitle}>Explore Study Guides</strong>
                    <p className={styles.taskDesc}>Review cheat sheets and problem sets in Tutoring Resources.</p>
                    <Link href="/resources/study-guides" className={styles.taskActionLink}>
                      Open guides →
                    </Link>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Links Card */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle}>Need Help or Safety Support?</h3>
              <p className={styles.sideCardText}>
                Our student safety and moderation team is available around the clock.
              </p>
              <div className={styles.sideCardLinks}>
                <Link href="/safety/report" className={styles.reportLink}>
                  🛡️ Report an Issue →
                </Link>
                <Link href="/resources" className={styles.resourcesLink}>
                  📖 Tutoring Resources →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
