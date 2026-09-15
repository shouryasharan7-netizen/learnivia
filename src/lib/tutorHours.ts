import { prisma } from "@/lib/prisma";

export interface VerifiedServiceHoursBreakdown {
  totalHours: number;
  bookingHours: number;
  workshopHours: number;
  auditAdjustmentHours: number;
  verifiedSessionsCount: number;
  completedWorkshopsCount: number;
  uniqueLearnersCount: number;
}

/**
 * Calculates the truthful, canonical accredited volunteer service hours for a tutor.
 * 
 * Unifies the source of truth across:
 * - Tutor Profile escrowed hours (TutorProfile.volunteerHours)
 * - Public & authenticated transcripts (/tutor/[id]/transcript)
 * - Admin tutor directories and audit ledgers (/admin/tutors)
 */
export async function getVerifiedServiceHours(tutorProfileId: string): Promise<VerifiedServiceHoursBreakdown> {
  const [tutor, verifiedBookings, completedWorkshops, audits] = await Promise.all([
    prisma.tutorProfile.findUnique({
      where: { id: tutorProfileId },
      select: { id: true, volunteerHours: true },
    }),
    prisma.booking.findMany({
      where: {
        tutorId: tutorProfileId,
        status: "COMPLETED",
        OR: [
          { hoursCredited: true },
          { studentAttended: true },
        ],
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        studentId: true,
      },
    }),
    prisma.workshop.findMany({
      where: {
        tutorId: tutorProfileId,
        status: "COMPLETED",
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    }),
    prisma.volunteerHourAudit.findMany({
      where: { tutorId: tutorProfileId },
      select: {
        id: true,
        oldHours: true,
        newHours: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!tutor) {
    return {
      totalHours: 0,
      bookingHours: 0,
      workshopHours: 0,
      auditAdjustmentHours: 0,
      verifiedSessionsCount: 0,
      completedWorkshopsCount: 0,
      uniqueLearnersCount: 0,
    };
  }

  // Calculate verified 1-on-1 booking hours
  const bookingMinutes = verifiedBookings.reduce((sum, b) => {
    const diffMs = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
    return sum + Math.max(15, Math.round(diffMs / (1000 * 60)));
  }, 0);
  const bookingHours = Math.round((bookingMinutes / 60) * 10) / 10;

  // Calculate completed workshop hours
  const workshopMinutes = completedWorkshops.reduce((sum, w) => {
    const diffMs = new Date(w.endTime).getTime() - new Date(w.startTime).getTime();
    return sum + Math.max(15, Math.round(diffMs / (1000 * 60)));
  }, 0);
  const workshopHours = Math.round((workshopMinutes / 60) * 10) / 10;

  // Total hours from the authoritative database profile escrow
  const totalHours = tutor.volunteerHours;
  const auditAdjustmentHours = Math.max(0, Math.round((totalHours - (bookingHours + workshopHours)) * 10) / 10);
  const uniqueLearners = new Set(verifiedBookings.map((b) => b.studentId)).size;

  return {
    totalHours,
    bookingHours,
    workshopHours,
    auditAdjustmentHours,
    verifiedSessionsCount: verifiedBookings.length,
    completedWorkshopsCount: completedWorkshops.length,
    uniqueLearnersCount: uniqueLearners,
  };
}
