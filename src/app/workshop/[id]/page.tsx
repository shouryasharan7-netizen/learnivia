import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import styles from "./page.module.css";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import WorkshopActionClient from "./WorkshopActionClient";

export const dynamic = "force-dynamic";

export default async function WorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const workshop = await prisma.workshop.findUnique({
    where: { id },
    include: {
      tutor: { include: { user: true } },
      enrollments: true,
    },
  });

  if (!workshop) notFound();

  const startDate = new Date(workshop.startTime);
  
  // Stats
  const seatsLeft = workshop.maxCapacity - workshop.enrollments.length;
  const isEnrolled = session?.user?.id
    ? workshop.enrollments.some((e) => e.studentId === session.user.id)
    : false;
    
  let joinUrl = null;
  const isHostTutor = workshop.tutor.userId === session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  if (isEnrolled || isHostTutor || isAdmin) {
    try {
      const urls = JSON.parse(workshop.zoomLink || "{}");
      if (isHostTutor) {
         joinUrl = urls.startUrl || urls.joinUrl;
      } else {
         joinUrl = urls.joinUrl;
      }
    } catch (e) {}
  }

  const now = Date.now();
  const startTimeMs = startDate.getTime();
  const endTimeMs = new Date(workshop.endTime).getTime();
  const isWithinJoinWindow = now >= (startTimeMs - 15 * 60 * 1000) && now <= endTimeMs;
  const isLive = isWithinJoinWindow && joinUrl;
  
  const initials = (workshop.tutor.user.name || "T")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const dateString = startDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  const timeString = startDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        
        {/* Top bar / Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/find" className={styles.backBtn}><ArrowLeft size={16} /> Back to Sessions</Link>
          <span className={styles.crumbDivider}>/</span>
          <span className={styles.crumbSubject}>{workshop.subject}</span>
          <span className={styles.crumbDivider}>/</span>
          <span className={styles.crumbTitle}>{workshop.title}</span>
        </div>

        {/* Header Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>{workshop.title}</h1>
          <div className={styles.metaInfo}>
            <span>1 SESSION</span>
            <span className={styles.dot}>•</span>
            <div className={styles.tutorAvatarSmall}>{initials}</div>
            <span className={styles.dot}>•</span>
            <span className={styles.spotsLeft}>🔥 {seatsLeft} spots left!</span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.layout}>
          
          {/* Main Content Column */}
          <div className={styles.mainColumn}>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.description}>{workshop.description}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Tutored by</h2>
              <div className={styles.tutorCard}>
                <div className={styles.tutorCardHeader}>
                  <div className={styles.tutorAvatarLarge}>{initials}</div>
                  <div className={styles.tutorDetails}>
                    <h3 className={styles.tutorName}>{workshop.tutor.user.name}</h3>
                    <div className={styles.tutorBadge}><CheckCircle2 size={12}/> Certified Tutor</div>
                  </div>
                  <Link href={`/tutor/${workshop.tutor.id}`} className={styles.viewProfileBtn}>View Profile</Link>
                </div>
                {workshop.tutor.bio && (
                  <div className={styles.bioBubble}>
                    <p>{workshop.tutor.bio}</p>
                  </div>
                )}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sessionsHeader}>
                <h2 className={styles.sectionTitle}>Sessions</h2>
                <div className={styles.sessionTabs}>
                  <span className={styles.activeTab}>Upcoming</span>
                  <span className={styles.inactiveTab}>All</span>
                </div>
              </div>

              <div className={styles.attendancePolicy}>
                <span className={styles.handEmoji}>✋</span> 
                <strong>ATTENDANCE POLICY</strong>
                <p>Free to attend or skip any sessions</p>
              </div>

              <div className={styles.sessionBox}>
                <div className={styles.sessionBoxLeft}>
                  <span className={styles.sessionLabel}>SESSION 1</span>
                  <span className={styles.sessionDateNum}>{startDate.getDate()}</span>
                  <span className={styles.sessionMonth}>{startDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</span>
                </div>
                <div className={styles.sessionBoxRight}>
                  <h4 className={styles.sessionTitle}>{workshop.title}</h4>
                  <p className={styles.sessionTime}>
                    {startDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()} {timeString}
                  </p>
                  <p className={styles.sessionDesc}>{workshop.description.length > 100 ? workshop.description.substring(0, 100) + "..." : workshop.description}</p>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Public Discussion</h2>
              <div className={styles.discussionBox}>
                <textarea className={styles.discussionInput} placeholder="Add a comment..."></textarea>
                <div className={styles.discussionAction}>
                  <button className={styles.commentBtn} disabled>Add Comment</button>
                </div>
              </div>
            </section>
            
          </div>

          {/* Right Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.stickyCard}>
              <div className={styles.cardHeader}>
                <h3>{startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</h3>
                <div className={styles.cardMeta}>
                  <span><Calendar size={12} /> 1 week</span>
                  <span><Clock size={12} /> 60 mins / session</span>
                </div>
                <p className={styles.nextSession}>Next session on {startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
              
              <div className={styles.scheduleBox}>
                <span className={styles.scheduleLabel}>SCHEDULE</span>
                <div className={styles.scheduleTime}>
                  <span>{dateString}</span>
                  <span>{timeString}</span>
                </div>
              </div>

              <div className={styles.actionBox}>
                <WorkshopActionClient 
                  workshopId={workshop.id}
                  isEnrolled={isEnrolled}
                  isLoggedIn={!!session?.user?.id}
                  seatsLeft={seatsLeft}
                  tutorName={workshop.tutor.user.name || "Tutor"}
                  tutorInitials={initials}
                  isLive={!!isLive}
                  joinUrl={joinUrl}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
