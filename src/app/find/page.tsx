import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { Search, Users, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { enrollInWorkshop } from "@/app/actions/workshops";
import SessionsFilter from "./SessionsFilter";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    subject?: string;
    sort?: string;
  }>;
};

export default async function FindSessionsPage({ searchParams }: Props) {
  const session = await auth();
  const { q, subject, sort } = await searchParams;

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
      by: ['subject'],
      where: { status: "UPCOMING", startTime: { gte: new Date() } },
      orderBy: { _count: { subject: 'desc' } }
    });
    allSubjects = uniqueSubjects.map(s => s.subject).filter(Boolean);
  } catch (err) {}

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Sessions</h1>
          <p className={styles.subtitle}>
            These are small-group sessions run by Learnivia peer tutors on topics of their choosing! They are typically shorter and more focused than programs, and you can join them at any time.
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
              const seatsLeft = w.maxCapacity - w.enrollments.length;
              const isEnrolled = session?.user?.id
                ? w.enrollments.some((e: any) => e.studentId === session.user.id)
                : false;
              
              // Get initials for avatar
              const initials = (w.tutor.user.name || "T")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              // Date formatting
              const startDate = new Date(w.startTime);
              const dateString = startDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
              const timeString = startDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });
              const displayDate = `Starts ${dateString}, ${timeString}`;

              return (
                <div key={w.id} className={styles.card}>
                  <div className={styles.cardTopBar}></div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{w.title}</h3>
                    <p className={styles.cardTime}>{displayDate}</p>
                    
                    <p className={styles.cardDesc}>
                      {w.description.length > 120 
                        ? w.description.substring(0, 120) + "..." 
                        : w.description}
                    </p>

                    {/* Action Area */}
                    <div className={styles.cardAction}>
                      {!session?.user ? (
                        <Link href="/signin?callbackUrl=/find" className={styles.actionBtn}>
                          Sign In to Register
                        </Link>
                      ) : isEnrolled ? (
                        <div className={styles.enrolledState}>
                          <CheckCircle2 size={16} style={{ marginRight: '4px' }} />
                          Registered
                        </div>
                      ) : seatsLeft > 0 ? (
                        <form action={enrollInWorkshop} style={{ width: '100%' }}>
                          <input type="hidden" name="workshopId" value={w.id} />
                          <button type="submit" className={styles.actionBtn}>
                            Register Free Seat
                          </button>
                        </form>
                      ) : (
                        <button disabled className={styles.disabledBtn}>
                          Workshop Full
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <div className={styles.tutorInfo}>
                      {w.tutor.user.image ? (
                        <img src={w.tutor.user.image} alt={w.tutor.user.name || "Tutor"} className={styles.avatar} />
                      ) : (
                        <div className={styles.avatarFallback}>{initials}</div>
                      )}
                      <span className={styles.tutorName}>{w.tutor.user.name}</span>
                    </div>
                    <div className={styles.attendance}>
                      <Users size={16} />
                      <span>{w.enrollments.length}/{w.maxCapacity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Calendar size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No sessions found</h3>
            <p className={styles.emptyText}>Try adjusting your search or selecting a different subject.</p>
            <Link href="/find" className={styles.clearBtn}>Clear Filters</Link>
          </div>
        )}
      </div>
    </div>
  );
}
