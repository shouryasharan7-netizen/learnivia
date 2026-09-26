import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendTutorAvailabilityReminder,
  sendTutorTrainingReminder,
} from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Tutor Inactivity, Availability & Training Compliance Audit Job
 *
 * Rules:
 * 1. 3-Day Availability Rule:
 *    Tutors with 0 availability slots whose approval/joining date was >= 3 days ago (72 hours)
 *    are deactivated/suspended.
 *    Tutors with 0 availability slots between 1 and 2 days old receive a reminder email.
 *
 * 2. 15-Day Mandatory Training Rule:
 *    Tutors who have NOT completed all 5 required training modules within 15 days of joining
 *    are deactivated/suspended.
 *    Tutors with incomplete training between 10 and 14 days old receive a reminder email.
 */
export async function GET(request: Request) {
  try {
    const now = new Date();
    const nowMs = now.getTime();

    const EXEMPT_EMAILS = [
      "shouryasharan7@gmail.com",
      "ahmedashfaqfarooqui@gmail.com",
    ];

    function isTutorExempt(tutor: {
      user: { email?: string | null; role?: string | null };
    }) {
      if (tutor.user?.role === "ADMIN") return true;
      if (
        tutor.user?.email &&
        EXEMPT_EMAILS.includes(tutor.user.email.toLowerCase())
      )
        return true;
      return false;
    }

    const inactiveAvailabilityTutors = await prisma.tutorProfile.findMany({
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
            role: true,
          },
        },
      },
      take: 50,
    });

    const availabilityResults = {
      checked: inactiveAvailabilityTutors.length,
      suspended: [] as string[],
      remindersSent: [] as string[],
    };

    for (const tutor of inactiveAvailabilityTutors) {
      if (isTutorExempt(tutor)) continue;

      const refDate = tutor.approvedAt || tutor.createdAt;
      const daysSinceRef =
        (nowMs - new Date(refDate).getTime()) / (1000 * 60 * 60 * 24);

      // Rule 1: 3-day cutoff -> Suspend / Deactivate
      if (daysSinceRef >= 3) {
        await prisma.tutorProfile.update({
          where: { id: tutor.id },
          data: { status: "SUSPENDED" },
        });
        availabilityResults.suspended.push(tutor.user.email || tutor.id);
        continue;
      }

      // Rule 1 Reminder: Day 1 or 2 reminder
      if (daysSinceRef >= 1 && tutor.user.email) {
        const lastSentMs = tutor.lastReminderSentAt
          ? new Date(tutor.lastReminderSentAt).getTime()
          : 0;
        // Don't spam: at most once every 24 hours
        if (nowMs - lastSentMs >= 24 * 60 * 60 * 1000) {
          const daysRemaining = Math.max(1, Math.ceil(3 - daysSinceRef));
          await sendTutorAvailabilityReminder(
            tutor.user.email,
            tutor.user.name || "Volunteer Educator",
            daysRemaining,
          );

          await prisma.tutorProfile.update({
            where: { id: tutor.id },
            data: { lastReminderSentAt: now },
          });

          availabilityResults.remindersSent.push(tutor.user.email);
        }
      }
    }

    const pendingTrainingTutors = await prisma.tutorProfile.findMany({
      where: {
        status: { in: ["APPROVED", "PENDING"] },
      },
      include: {
        trainingModules: {
          where: { quizPassed: true },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      take: 50,
    });

    const trainingResults = {
      checked: 0,
      suspended: [] as string[],
      remindersSent: [] as string[],
    };

    for (const tutor of pendingTrainingTutors) {
      if (isTutorExempt(tutor)) continue;

      const passedCount = (tutor.trainingModules || []).length;
      if (passedCount >= 5) continue; // Training fully satisfied

      trainingResults.checked++;
      const refDate = tutor.createdAt;
      const daysSinceRef =
        (nowMs - new Date(refDate).getTime()) / (1000 * 60 * 60 * 24);

      // Rule 2: 15-day cutoff -> Suspend / Remove
      if (daysSinceRef >= 15) {
        await prisma.tutorProfile.update({
          where: { id: tutor.id },
          data: { status: "SUSPENDED" },
        });
        trainingResults.suspended.push(tutor.user.email || tutor.id);
        continue;
      }

      // Rule 2 Reminder: Day 10 to 14 reminder
      if (daysSinceRef >= 10 && tutor.user.email) {
        const lastSentMs = tutor.lastReminderSentAt
          ? new Date(tutor.lastReminderSentAt).getTime()
          : 0;
        // At most once every 48 hours
        if (nowMs - lastSentMs >= 48 * 60 * 60 * 1000) {
          const daysRemaining = Math.max(1, Math.ceil(15 - daysSinceRef));
          await sendTutorTrainingReminder(
            tutor.user.email,
            tutor.user.name || "Volunteer Educator",
            passedCount,
            daysRemaining,
          );

          await prisma.tutorProfile.update({
            where: { id: tutor.id },
            data: { lastReminderSentAt: now },
          });

          trainingResults.remindersSent.push(tutor.user.email);
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      summary: {
        totalInactiveWithNoSlots: availabilityResults.checked,
        suspendedForMissingAvailability: availabilityResults.suspended.length,
        availabilityRemindersSent: availabilityResults.remindersSent.length,
        totalIncompleteTraining: trainingResults.checked,
        suspendedForIncompleteTraining: trainingResults.suspended.length,
        trainingRemindersSent: trainingResults.remindersSent.length,
        // Compatibility counters
        suspendedCount:
          availabilityResults.suspended.length +
          trainingResults.suspended.length,
        remindersSentCount:
          availabilityResults.remindersSent.length +
          trainingResults.remindersSent.length,
      },
      details: {
        availability: availabilityResults,
        training: trainingResults,
      },
    });
  } catch (err: any) {
    console.error("Tutor compliance cron error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
