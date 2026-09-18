import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountSuspended: true,
      suspendedReason: true,
      points: true,
      tutorProfile: {
        select: {
          id: true,
          status: true,
          volunteerHours: true,
        },
      },
    },
  });

  console.log("Found users count:", users.length);
  for (const u of users) {
    console.log(`User: ${u.name} | ${u.email} | Role: ${u.role} | Suspended: ${u.accountSuspended} (${u.suspendedReason}) | Points: ${u.points} | Tutor: ${u.tutorProfile ? `${u.tutorProfile.status} (${u.tutorProfile.volunteerHours}h)` : "none"}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
