import { PrismaClient } from '@prisma/client';
import { PROGRAMS } from '../src/lib/programs';

const prisma = new PrismaClient();

async function main() {
  for (const program of PROGRAMS) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        title: program.title,
        shortDescription: program.shortDescription,
        longDescription: program.longDescription,
        emoji: program.emoji,
      },
      create: {
        slug: program.slug,
        title: program.title,
        shortDescription: program.shortDescription,
        longDescription: program.longDescription,
        emoji: program.emoji,
        format: program.format,
        duration: program.duration,
      },
    });
  }
  console.log("Seeded programs.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
