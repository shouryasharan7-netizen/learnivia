import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Starting founder restoration and hours reset...");

  // 1. Unsuspend and elevate Shourya Sharan
  const shourya = await prisma.user.findFirst({
    where: {
      email: {
        in: ["shouryasharan7@gmail.com", "shouryasharan27@gmail.com"],
      },
    },
  });

  if (shourya) {
    await prisma.user.update({
      where: { id: shourya.id },
      data: {
        role: "ADMIN",
        accountSuspended: false,
        suspendedReason: null,
        emailVerified: new Date(),
        onboardingCompleted: true,
        points: 0,
      },
    });

    await prisma.tutorProfile.upsert({
      where: { userId: shourya.id },
      create: {
        userId: shourya.id,
        status: "APPROVED",
        volunteerHours: 0.0,
      },
      update: {
        status: "APPROVED",
        volunteerHours: 0.0,
      },
    });
    console.log("Restored Shourya Sharan as ADMIN and APPROVED tutor.");
  }

  // Also check if both shourya emails exist
  const shourya2 = await prisma.user.findUnique({
    where: { email: "shouryasharan7@gmail.com" },
  });
  if (shourya2) {
    await prisma.user.update({
      where: { id: shourya2.id },
      data: {
        role: "ADMIN",
        accountSuspended: false,
        suspendedReason: null,
        emailVerified: new Date(),
        onboardingCompleted: true,
        points: 0,
      },
    });
    await prisma.tutorProfile.upsert({
      where: { userId: shourya2.id },
      create: {
        userId: shourya2.id,
        status: "APPROVED",
        volunteerHours: 0.0,
      },
      update: {
        status: "APPROVED",
        volunteerHours: 0.0,
      },
    });
    console.log("Restored shouryasharan7@gmail.com as ADMIN and APPROVED tutor.");
  }

  // 2. Unsuspend and elevate Ahmed Ashfaq Farooqui
  const ahmed = await prisma.user.findUnique({
    where: { email: "ahmedashfaqfarooqui@gmail.com" },
  });

  if (ahmed) {
    await prisma.user.update({
      where: { id: ahmed.id },
      data: {
        role: "ADMIN",
        accountSuspended: false,
        suspendedReason: null,
        emailVerified: new Date(),
        onboardingCompleted: true,
        points: 0,
      },
    });

    await prisma.tutorProfile.upsert({
      where: { userId: ahmed.id },
      create: {
        userId: ahmed.id,
        status: "APPROVED",
        volunteerHours: 0.0,
      },
      update: {
        status: "APPROVED",
        volunteerHours: 0.0,
      },
    });
    console.log("Restored Ahmed Ashfaq Farooqui as ADMIN and APPROVED tutor.");
  }

  // 3. Reset all volunteer hours taught for everyone to 0.0
  const updatedTutors = await prisma.tutorProfile.updateMany({
    data: {
      volunteerHours: 0.0,
    },
  });
  console.log(`Reset volunteer hours for ${updatedTutors.count} tutors to 0.0.`);

  // 4. Reset points for all users
  const updatedPoints = await prisma.user.updateMany({
    data: {
      points: 0,
    },
  });
  console.log(`Reset points for ${updatedPoints.count} users to 0.`);

  // 5. Reset hoursCredited on bookings
  const updatedBookings = await prisma.booking.updateMany({
    data: {
      hoursCredited: false,
    },
  });
  console.log(`Reset hoursCredited for ${updatedBookings.count} bookings.`);
}

main()
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
