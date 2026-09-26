/**
 * Student Dashboard — Schoolhouse-style layout
 * Hero banner → Program card row → User stats → 2-col (sessions + tasks)
 *
 * IMPORTANT: This is a React Server Component. No event handlers allowed.
 * All hover effects are done via CSS classes defined in dashboard.module.css.
 */
import styles from "./dashboard.module.css";
import { getCurrentUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import SessionsContent from "./SessionsContent";
import {
  Trophy,
  Clock,
  Users,
  ArrowRight,
  Search,
  GraduationCap,
  HelpCircle,
  BookOpen,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Dashboard | Learnivia",
  description:
    "Your Learnivia dashboard — find sessions, track your progress, and connect with peer tutors.",
};

// Program cards — horizontal scroll row
const PROGRAMS = [
  {
    id: "maths",
    label: "Mathematics",
    sublabel: "Algebra, Geometry & more",
    bg: "#7C3AED",
    abbr: "MTH",
    href: "/find?subject=Mathematics",
  },
  {
    id: "science",
    label: "Science",
    sublabel: "Physics, Biology, Chemistry",
    bg: "#0D9488",
    abbr: "SCI",
    href: "/find?subject=Science",
  },
  {
    id: "english",
    label: "English & Writing",
    sublabel: "Grammar, essays, comprehension",
    bg: "#2563EB",
    abbr: "ENG",
    href: "/find?subject=English",
  },
  {
    id: "community",
    label: "Community Sessions",
    sublabel: "Group Q&A with peers",
    bg: "#059669",
    abbr: "COM",
    href: "/community",
  },
  {
    id: "homework",
    label: "Homework Help",
    sublabel: "Get quick subject help",
    bg: "#D97706",
    abbr: "HWK",
    href: "/homework-help",
  },
  {
    id: "standardized-testing",
    label: "Standardized Testing",
    sublabel: "SAT, TOEFL, AP Prep",
    bg: "#DB2777",
    abbr: "ST",
    href: "/find?subject=Standardized+Testing",
  },
];

// Task cards data
const TASK_CARDS = [
  {
    category: "FIND A TUTOR",
    color: "#7C3AED",
    title: "Book your first free session",
    href: "/find",
  },
  {
    category: "PROGRAMS",
    color: "#0D9488",
    title: "Explore K-10 sessions",
    href: "/learn",
  },
  {
    category: "VOLUNTEER",
    color: "#D97706",
    title: "Become a Tutor",
    subtitle: "3 steps to get started",
    href: "/apply",
  },
  {
    category: "SAFETY",
    color: "#64748B",
    title: "Review our safeguarding standards",
    href: "/safety",
  },
];

export default async function StudentDashboard({ searchParams }: { searchParams: Promise<any> }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.auth.signIn);
  }

  const now = new Date();
  const initials = (user.name || "L")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Fetch upcoming bookings — fail safely
  let upcomingBookings: any[] = [];
  let completedCount = 0;
  let totalMinutes = 0;

  try {
    const [upcoming, completed] = await Promise.all([
      prisma.booking.findMany({
        where: {
          studentId: user.id,
          status: "CONFIRMED",
          endTime: { gte: now },
        },
        include: {
          tutor: {
            include: { user: { select: { name: true } } },
          },
        },
        orderBy: { startTime: "asc" },
        take: 3,
      }),
      prisma.booking.findMany({
        where: {
          studentId: user.id,
          OR: [
            { status: "COMPLETED" },
            { status: "CONFIRMED", endTime: { lt: now } },
          ],
        },
        orderBy: { startTime: "desc" },
        take: 10,
      }),
    ]);
    upcomingBookings = upcoming;
    completedCount = completed.length;
    totalMinutes = completed.length * 45;
  } catch {
    // DB unavailable — show zero-state UI gracefully
  }

  const isTutor = Boolean(user.isTutor || user.role === "TUTOR");
  const canApplyTutor = !isTutor;

  return (
    <div className={styles.dashRoot}>
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <p className={styles.heroKicker}>Learnivia — Free K-10 Tutoring</p>
          <h1 className={styles.heroTitle}>
            Connect with K-10 peer tutors across every board
          </h1>
          <p className={styles.heroDesc}>
            Get matched with verified tutors for CBSE, ICSE, IGCSE, and more.
            Every session is 100% free and happens live on Zoom.
          </p>
          <Link href={ROUTES.find} className={styles.heroBtn}>
            <Search size={15} />
            Find a Tutor
          </Link>
        </div>
        <div className={styles.heroIllustration} aria-hidden="true">
          <Image src="/images/logo.png" alt="Learnivia Fox" width={90} height={90} style={{ objectFit: 'contain' }} />
        </div>
      </div>

      <div className={styles.programRow}>
        {PROGRAMS.map((prog) => (
          <Link key={prog.id} href={prog.href} className={styles.programCard}>
            <div
              className={styles.programBadge}
              style={{ background: prog.bg }}
            >
              {prog.abbr}
            </div>
            <div>
              <p className={styles.programLabel}>{prog.label}</p>
              <p className={styles.programSub}>{prog.sublabel}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statsIdentity}>
          <div className={styles.statsAvatar}>{initials}</div>
          <div>
            <p className={styles.statsName}>{user.name || "Learner"}</p>
            <div className={styles.statsLinks}>
              <Link href="/sessions" className={styles.statsLink}>
                My Sessions
              </Link>
              {isTutor && (
                <Link href="/tutor" className={styles.statsLink}>
                  Tutor Profile
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className={styles.statsPills}>
          <div className={styles.statsPill}>
            <Trophy size={18} color="#F59E0B" />
            <div>
              <span className={styles.statValue}>{completedCount}</span>
              <span className={styles.statLabel}>Sessions</span>
            </div>
          </div>
          <div className={styles.statsPill}>
            <Clock size={18} color="#0D9488" />
            <div>
              <span className={styles.statValue}>{totalMinutes}</span>
              <span className={styles.statLabel}>Learning mins</span>
            </div>
          </div>
          <div className={styles.statsPill}>
            <Users size={18} color="#7C3AED" />
            <div>
              <span className={styles.statValue}>K-10</span>
              <span className={styles.statLabel}>Grade band</span>
            </div>
          </div>
        </div>
      </div>

      <SessionsContent searchParams={searchParams} />
    </div>
  );
}
