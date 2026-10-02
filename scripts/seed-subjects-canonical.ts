/**
 * Canonical Subject & Grade Seed Script
 *
 * Idempotent: safe to run multiple times.
 * - Purges corrupted subjects ("and science")
 * - Upserts all subjects with correct category from SUBJECT_TAXONOMY
 * - Upserts all grades from CANONICAL_GRADES (K - Grade 12)
 *
 * Usage:
 *   npx tsx scripts/seed-subjects-canonical.ts
 */

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  SUBJECT_TAXONOMY,
  CANONICAL_GRADES,
  CORRUPTED_SUBJECTS,
  SUBJECT_CATEGORY_MAP,
} from "../src/lib/subject-taxonomy";

// Load env from .env.local if running outside Next.js
import * as fs from "fs";
import * as path from "path";
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");

const pool = new Pool({
  connectionString,
  ssl:
    connectionString.includes("supabase.co") ||
    connectionString.includes("supabase.com")
      ? { rejectUnauthorized: false }
      : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("--- Learnivia Canonical Subject Seed ---\n");

  // 1. Purge corrupted subjects
  if (CORRUPTED_SUBJECTS.length > 0) {
    const deleted = await prisma.subject.deleteMany({
      where: { name: { in: CORRUPTED_SUBJECTS } },
    });
    console.log(`Purged ${deleted.count} corrupted subject(s): ${CORRUPTED_SUBJECTS.join(", ")}`);
  }

  // 2. Upsert canonical subjects
  let upserted = 0;
  for (const [category, subjects] of Object.entries(SUBJECT_TAXONOMY)) {
    for (const name of subjects) {
      await prisma.subject.upsert({
        where: { name },
        update: { category },
        create: { name, category },
      });
      upserted++;
    }
  }
  console.log(`Upserted ${upserted} canonical subject(s) across ${Object.keys(SUBJECT_TAXONOMY).length} categories.`);

  // 3. Upsert canonical grade levels
  let gradesUpserted = 0;
  for (const grade of CANONICAL_GRADES) {
    await prisma.gradeLevel.upsert({
      where: { name: grade.name },
      update: { category: grade.category },
      create: { name: grade.name, category: grade.category },
    });
    gradesUpserted++;
  }
  console.log(`Upserted ${gradesUpserted} grade levels (Kindergarten through Grade 12).`);

  // 4. Verify DB state
  const subjectCount = await prisma.subject.count();
  const gradeCount = await prisma.gradeLevel.count();
  console.log(`\nDB state: ${subjectCount} subjects, ${gradeCount} grade levels.`);

  // 5. Warn about any non-canonical subjects in DB
  const allInDB = await prisma.subject.findMany({ select: { name: true } });
  const canonical = Object.values(SUBJECT_TAXONOMY).flat() as string[];
  const unknown = allInDB.map((s) => s.name).filter((n) => !canonical.includes(n));
  if (unknown.length > 0) {
    console.warn(`\nWARN: ${unknown.length} non-canonical subject(s) found in DB: ${unknown.join(", ")}`);
    console.warn("Consider reviewing these entries.");
  } else {
    console.log("All subjects in DB are canonical.");
  }

  console.log("\n--- Seed complete ---");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
