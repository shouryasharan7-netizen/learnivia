import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import {
  Search,
  Users,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import SessionsFilter from "./SessionsFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import LearnerMatchmaker from "@/components/discovery/LearnerMatchmaker";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    subject?: string;
    grade?: string;
    sort?: string;
  }>;
};

function getSessionUrgency(startTime: Date, endTime: Date) {
  const now = Date.now();
  const startMs = startTime.getTime();
  const endMs = endTime.getTime();

  // If live now (started within 10 min window and not ended)
  if (now >= startMs - 10 * 60 * 1000 && now <= endMs) {
    return {
      type: "live",
      label: "LIVE NOW",
      urgent: true,
    };
  }

  const diffMs = startMs - now;
  const diffMins = Math.round(diffMs / (60 * 1000));

  if (diffMins > 0 && diffMins <= 60) {
    return {
      type: "urgent",
      label: `Starts in ${diffMins}m`,
      urgent: true,
    };
  }

  const startDate = new Date(startTime);
  const today = new Date();
  const isToday =
    startDate.getDate() === today.getDate() &&
    startDate.getMonth() === today.getMonth() &&
    startDate.getFullYear() === today.getFullYear();

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow =
    startDate.getDate() === tomorrow.getDate() &&
    startDate.getMonth() === tomorrow.getMonth() &&
    startDate.getFullYear() === tomorrow.getFullYear();

  const timeStr = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) {
    return {
      type: "today",
      label: `Today at ${timeStr}`,
      urgent: false,
    };
  }

  if (isTomorrow) {
    return {
      type: "tomorrow",
      label: `Tomorrow at ${timeStr}`,
      urgent: false,
    };
  }

  const dateStr = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return {
    type: "future",
    label: `${dateStr} • ${timeStr}`,
    urgent: false,
  };
}

export default async function FindSessionsPage({ searchParams }: Props) {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("Session lookup error in /find:", e);
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const { q, subject, grade, sort } = resolvedParams;

  // Build Workshop Query
  const workshopWhere: any = {
    status: "UPCOMING",
    startTime: { gte: new Date() },
  };

  if (q && q.trim()) {
    workshopWhere.title = { contains: q.trim(), mode: "insensitive" };
  }
  if (subject && subject.trim() && subject !== "All") {
    workshopWhere.subject = { contains: subject.trim(), mode: "insensitive" };
  }
  if (grade && grade.trim() && grade !== "All") {
    workshopWhere.OR = [
      { grade: { contains: grade.trim(), mode: "insensitive" } },
      { description: { contains: grade.trim(), mode: "insensitive" } },
      { title: { contains: grade.trim(), mode: "insensitive" } },
    ];
  }

  // Fetch workshops
  let workshops: any[] = [];
  try {
    workshops = await prisma.workshop.findMany({
      where: workshopWhere,
      include: {
        tutor: { include: { user: true } },
        enrollments: true,
      },
      orderBy: { startTime: sort === "newest" ? "desc" : "asc" },
      take: 60,
    });
  } catch (err) {
    console.error("Failed to fetch workshops:", err);
  }

  // Get all unique subjects for the pills
  let allSubjects: string[] = [];
  try {
    const uniqueSubjects = await prisma.workshop.groupBy({
      by: ["subject"],
      where: { status: "UPCOMING", startTime: { gte: new Date() } },
      orderBy: { _count: { subject: "desc" } },
    });
    allSubjects = uniqueSubjects.map((s) => s.subject).filter(Boolean);
  } catch (err) {}

  // Spotlight Workshop: Next upcoming session
  const spotlightWorkshop = workshops.length > 0 ? workshops[0] : null;

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {/* Editorial Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.categoryBadge}>Live Academic Catalog</span>
            <div className={styles.safetyBadge}>
              <ShieldCheck size={14} />
              <span>Certified Peer Tutors • 100% Free</span>
            </div>
          </div>
          <h1 className={styles.title}>All Academic Sessions & Workshops</h1>
          <p className={styles.subtitle}>
            Small-group interactive workshops run by verified Learnivia peer tutors.
            Drop in for live problem sets, exam reviews, and concept deep-dives.
          </p>
        </div>

        {/* 30-Second Learner Matchmaker Drawer */}
        <LearnerMatchmaker />

        {/* Discovery Filter Controls */}
        <SessionsFilter
          currentQ={q || ""}
          currentSubject={subject || "All"}
          currentGrade={grade || "All"}
          currentSort={sort || "soon"}
          availableSubjects={allSubjects}
        />

        {workshops.length > 0 ? (
          <div className={styles.grid}>
            {workshops.map((w) => {
              const enrollments = Array.isArray(w.enrollments) ? w.enrollments : [];
              const maxCapacity = w.maxCapacity ?? 10;
              const seatsLeft = maxCapacity - enrollments.length;
              const fillPercentage = Math.min(100, Math.round((enrollments.length / maxCapacity) * 100));
              const isEnrolled = session?.user?.id
                ? enrollments.some((e: any) => e.studentId === session?.user?.id)
                : false;

              // Tutor info & initials
              const tutorName = w.tutor?.user?.name || "Peer Tutor";
              const tutorImage = w.tutor?.user?.image;
              const initials =
                tutorName
                  .split(" ")
                  .filter(Boolean)
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "T";

              // Timing urgency
              const startDate = w.startTime ? new Date(w.startTime) : new Date();
              const endDate = w.endTime ? new Date(w.endTime) : new Date(startDate.getTime() + 60 * 60 * 1000);
              const urgency = getSessionUrgency(startDate, endDate);

              const description = w.description || "";
              const descText =
                description.length > 110
                  ? description.substring(0, 110) + "..."
                  : description;

              return (
                <div key={w.id} className={styles.card}>
                  {/* Top Urgency Header */}
                  <div className={styles.cardHeaderStrip}>
                    <div className={styles.timingPillWrapper}>
                      {urgency.type === "live" ? (
                        <span className={styles.liveBadge}>
                          <span className={styles.liveDot} />
                          LIVE NOW
                        </span>
                      ) : urgency.urgent ? (
                        <span className={styles.urgentBadge}>
                          <Clock size={12} />
                          {urgency.label}
                        </span>
                      ) : (
                        <span className={styles.scheduledBadge}>
                          <Clock size={12} />
                          {urgency.label}
                        </span>
                      )}
                    </div>

                    <div className={styles.tagChips}>
                      <span className={styles.gradeBadge}>
                        {w.grade || "All Grades"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <span className={styles.cardSubject}>{w.subject}</span>
                    <h3 className={styles.cardTitle}>
                      <Link href={`/workshop/${w.id}`} className={styles.titleLink}>
                        {w.title || "Academic Workshop"}
                      </Link>
                    </h3>

                    <p className={styles.cardDesc}>{descText}</p>

                    {/* Capacity Progress Bar */}
                    <div className={styles.capacitySection}>
                      <div className={styles.capacityMeta}>
                        <span className={styles.capacityLabel}>
                          <Users size={13} />
                          {enrollments.length}/{maxCapacity} Enrolled
                        </span>
                        {seatsLeft <= 0 ? (
                          <span className={styles.seatsFull}>Session Full</span>
                        ) : seatsLeft <= 2 ? (
                          <span className={styles.seatsUrgent}>Only {seatsLeft} seat{seatsLeft === 1 ? "" : "s"} left!</span>
                        ) : (
                          <span className={styles.seatsAvailable}>{seatsLeft} seats open</span>
                        )}
                      </div>
                      <div className={styles.capacityTrack}>
                        <div
                          className={`${styles.capacityFill} ${
                            seatsLeft <= 2 ? styles.capacityFillUrgent : ""
                          }`}
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className={styles.cardAction}>
                      <Link
                        href={`/workshop/${w.id}`}
                        className={isEnrolled ? styles.actionBtnEnrolled : styles.actionBtn}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 size={16} />
                            View Registered Session
                          </>
                        ) : seatsLeft <= 0 ? (
                          "View Full Session"
                        ) : (
                          <>
                            Register for Free
                            <ArrowRight size={15} />
                          </>
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* High-Trust Tutor Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.tutorInfo}>
                      {tutorImage ? (
                        <img
                          src={tutorImage}
                          alt={tutorName}
                          className={styles.avatar}
                        />
                      ) : (
                        <div className={styles.avatarFallback}>{initials}</div>
                      )}
                      <div className={styles.tutorText}>
                        <span className={styles.tutorName}>{tutorName}</span>
                        <span className={styles.tutorCred}>
                          <CheckCircle2 size={11} className={styles.verifiedCheck} />
                          Verified Peer Tutor
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/workshop/${w.id}`}
                      className={styles.quickViewLink}
                      title="View full syllabus and Zoom details"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Search size={24} />}
            title="No workshops found matching your filters"
            description="Try switching subjects, expanding grade bands, or using the 30-second matchmaker."
            action={
              <Link href="/find" className={styles.clearBtn}>
                Clear All Filters
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
