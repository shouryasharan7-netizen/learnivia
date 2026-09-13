import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTutorAvailabilityReminder } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Tutor Availability Inactivity & Reminder Job
 * 
 * Rules:
 * 1. Tutors with 0 availability slots who were approved/signed up >= 21 days ago (3 weeks)
 *    are suspended ("kicked out" for inactivity).
 * 2. Tutors with 0 availability slots who were approved/signed up >= 4 days ago receive
 *    a reminder email every 4 days alerting them to add weekly availability slots.
 */
export async function GET(request: Request) {
  try {
    const now = new Date();
    const nowMs = now.getTime();
    const fourDaysMs = 4 * 24 * 60 * 60 * 1000;

    // Find all approved tutors who have no availability slots set
    const inactiveTutors = await prisma.tutorProfile.findMany({
      where: {
        status: "APPROVED",
        availabilities: {
          none: {},
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    const results = {
      checked: inactiveTutors.length,
      suspended: [] as string[],
      remindersSent: [] as string[],
    };

    for (const tutor of inactiveTutors) {
      const refDate = tutor.approvedAt || tutor.createdAt;
      const daysSinceRef = Math.floor((nowMs - new Date(refDate).getTime()) / (1000 * 60 * 60 * 24));

      // Rule 1: 3-week (21 days) cutoff -> Kick out / Suspend
      if (daysSinceRef >= 21) {
        await prisma.tutorProfile.update({
          where: { id: tutor.id },
          data: { status: "SUSPENDED" },
        });
        results.suspended.push(tutor.user.email || tutor.id);
        continue;
      }

      // Rule 2: Every 4 days reminder
      if (daysSinceRef >= 4 && tutor.user.email) {
        const lastSentMs = tutor.lastReminderSentAt ? new Date(tutor.lastReminderSentAt).getTime() : 0;
        if (nowMs - lastSentMs >= fourDaysMs) {
          const daysRemaining = Math.max(1, 21 - daysSinceRef);
          await sendTutorAvailabilityReminder(
            tutor.user.email,
            tutor.user.name || "Volunteer Educator",
            daysRemaining
          );

          await prisma.tutorProfile.update({
            where: { id: tutor.id },
            data: { lastReminderSentAt: now },
          });

          results.remindersSent.push(tutor.user.email);
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      summary: {
        totalInactiveWithNoSlots: results.checked,
        suspendedCount: results.suspended.length,
        remindersSentCount: results.remindersSent.length,
      },
      details: results,
    });
  } catch (err: any) {
    console.error("Tutor availability cron error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Allow manual invocation via POST as well
  return GET(request);
}
