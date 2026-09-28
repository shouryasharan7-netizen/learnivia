import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import {
  Search,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { enrollInWorkshop } from "@/app/actions/workshops";
import SessionsFilter from "./SessionsFilter";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    subject?: string;
    sort?: string;
  }>;
};

export default async function FindSessionsPage({ searchParams }: Props) {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("Session lookup error in /find:", e);
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const { q, subject, sort } = resolvedParams;

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
      take: 50,
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

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Sessions</h1>
          <p className={styles.subtitle}>
            These are small-group sessions run by Learnivia peer tutors on
            topics of their choosing! They are typically shorter and more
            focused than programs, and you can join them at any time.
          </p>
        </div>

        <SessionsFilter
          currentQ={q || ""}
          currentSubject={subject || "All"}
          currentSort={sort || "soon"}
          availableSubjects={allSubjects}
        />

        {workshops.length > 0 ? (
          <div className={styles.grid}>
            {workshops.map((w) => {
              const enrollments = Array.isArray(w.enrollments) ? w.enrollments : [];
              const maxCapacity = w.maxCapacity ?? 10;
              const seatsLeft = maxCapacity - enrollments.length;
              const isEnrolled = session?.user?.id
                ? enrollments.some(
                    (e: any) => e.studentId === session?.user?.id,
                  )
                : false;

              // Tutor info & initials
              const tutorName = w.tutor?.user?.name || "Tutor";
              const tutorImage = w.tutor?.user?.image;
              const initials = tutorName
                .split(" ")
                .filter(Boolean)
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "T";

              // Date formatting
              const startDate = w.startTime ? new Date(w.startTime) : new Date();
              const dateString = isNaN(startDate.getTime())
                ? "Upcoming"
                : startDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
              const timeString = isNaN(startDate.getTime())
                ? ""
                : startDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  });
              const displayDate = timeString
                ? `Starts ${dateString}, ${timeString}`
                : `Starts ${dateString}`;

              const description = w.description || "";
              const descText =
                description.length > 120
                  ? description.substring(0, 120) + "..."
                  : description;

              return (
                <div key={w.id} className={styles.card}>
                  <div className={styles.cardTopBar}></div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{w.title || "Untitled Session"}</h3>
                    <p className={styles.cardTime}>{displayDate}</p>

                    <p className={styles.cardDesc}>{descText}</p>

                    {/* Action Area */}
                    <div className={styles.cardAction}>
                      <Link
                        href={`/workshop/${w.id}`}
                        className={styles.actionBtn}
                      >
                        {isEnrolled
                          ? "View Registered Session"
                          : "View Details & Register"}
                      </Link>
                    </div>
                  </div>

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
                      <span className={styles.tutorName}>{tutorName}</span>
                    </div>
                    <div className={styles.attendance}>
                      <Users size={16} />
                      <span>
                        {enrollments.length}/{maxCapacity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No sessions found"
            description="Try adjusting your search or selecting a different subject."
            action={
              <Link href="/find" className={styles.clearBtn}>
                Clear Filters
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
