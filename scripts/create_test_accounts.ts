import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const password = await bcrypt.hash('password123', 12)

  // 1. Student
  await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: { password, role: 'STUDENT' },
    create: {
      email: 'student@test.com',
      name: 'Test Student',
      password,
      role: 'STUDENT',
      onboardingCompleted: true,
    }
  })

  // 2. Tutor
  const tutor = await prisma.user.upsert({
    where: { email: 'tutor@test.com' },
    update: { password, role: 'TUTOR' },
    create: {
      email: 'tutor@test.com',
      name: 'Test Tutor',
      password,
      role: 'TUTOR',
      onboardingCompleted: true,
    }
  })

  await prisma.tutorProfile.upsert({
    where: { userId: tutor.id },
    update: { status: 'APPROVED' },
    create: {
      userId: tutor.id,
      status: 'APPROVED',
      school: 'Test University',
      bio: 'Test bio',
    }
  })

  // 3. Admin
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { password, role: 'ADMIN' },
    create: {
      email: 'admin@test.com',
      name: 'Test Admin',
      password,
      role: 'ADMIN',
      onboardingCompleted: true,
    }
  })
  
  console.log("Test accounts created successfully:")
  console.log("Student: student@test.com / password123")
  console.log("Tutor: tutor@test.com / password123")
  console.log("Admin: admin@test.com / password123")
}

main().catch(console.error).finally(() => prisma.$disconnect())
