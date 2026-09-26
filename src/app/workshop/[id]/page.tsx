import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import styles from "./page.module.css";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import WorkshopActionClient from "./WorkshopActionClient";
import WorkshopClientDates from "./WorkshopClientDates";
import WorkshopSidebarDates from "./WorkshopSidebarDates";

export const dynamic = "force-dynamic";

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
  const isWithinJoinWindow =
    now >= startTimeMs - 15 * 60 * 1000 && now <= endTimeMs;
  const isLive = isWithinJoinWindow && joinUrl;

  const initials = (workshop.tutor.user.name || "T")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const startTimeStr = workshop.startTime.toISOString();
  const endTimeStr = workshop.endTime.toISOString();

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {/* Top bar / Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/find" className={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Sessions
          </Link>
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
                    <h3 className={styles.tutorName}>
                      {workshop.tutor.user.name}
                    </h3>
                    <div className={styles.tutorBadge}>
                      <CheckCircle2 size={12} /> Certified Tutor
                    </div>
                  </div>
                  <Link
                    href={`/tutor/${workshop.tutor.id}`}
                    className={styles.viewProfileBtn}
                  >
                    View Profile
                  </Link>
                </div>
                {workshop.tutor.bio && (
                  <div className={styles.bioBubble}>
                    <p>{workshop.tutor.bio}</p>
                  </div>
                )}
              </div>
            </section>

            <WorkshopClientDates
              startTime={startTimeStr}
              endTime={endTimeStr}
              title={workshop.title}
              description={workshop.description}
            />

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Public Discussion</h2>
              <div className={styles.discussionBox}>
                <textarea
                  className={styles.discussionInput}
                  placeholder="Add a comment..."
                ></textarea>
                <div className={styles.discussionAction}>
                  <button className={styles.commentBtn} disabled>
                    Add Comment
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.stickyCard}>
              <WorkshopSidebarDates
                startTime={startTimeStr}
                endTime={endTimeStr}
              />

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
