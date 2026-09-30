import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

test("Task 1: Production Edge Health Check Endpoint verification", () => {
  const healthRoutePath = path.join(ROOT, "src", "app", "api", "health", "route.ts");
  assert.ok(fs.existsSync(healthRoutePath), "Health route file must exist");

  const content = fs.readFileSync(healthRoutePath, "utf-8");
  assert.ok(
    content.includes("export const runtime = \"edge\"") || content.includes("export const runtime = 'edge'"),
    "Health route must explicitly run on Vercel Edge runtime",
  );
  assert.ok(content.includes("latency_ms"), "Payload must contain latency_ms");
  assert.ok(content.includes("learnivia-core"), "Service must be learnivia-core");
  assert.ok(content.includes("healthy"), "Payload must declare status");
});

test("Task 2: Supabase Content & Trivia Schema Migration verification", () => {
  const migrationPath = path.join(
    ROOT,
    "supabase",
    "migrations",
    "20260930_create_questions_table.sql",
  );
  assert.ok(fs.existsSync(migrationPath), "Migration SQL file must exist");

  const sql = fs.readFileSync(migrationPath, "utf-8");
  assert.ok(sql.includes("CREATE TABLE IF NOT EXISTS public.questions"), "Must create questions table");
  assert.ok(sql.includes("gen_random_uuid()"), "Must use gen_random_uuid() for primary key id");
  assert.ok(sql.includes("Computer Science & Algorithms"), "Must check domain constraints");
  assert.ok(sql.includes("Olympiad/Contest"), "Must check difficulty constraints");
  assert.ok(sql.includes("options JSONB NOT NULL"), "Must define options as JSONB NOT NULL");
  assert.ok(sql.includes("idx_questions_domain_difficulty"), "Must index domain and difficulty");
  assert.ok(sql.includes("idx_questions_verified_created_at"), "Must index verified and created_at");
  assert.ok(sql.includes("ENABLE ROW LEVEL SECURITY"), "Must enable RLS");
  assert.ok(sql.includes("service_role"), "Must grant write permissions to service_role");
});

test("Task 3: Content Batch Ingestion Route verification", () => {
  const ingestRoutePath = path.join(
    ROOT,
    "src",
    "app",
    "api",
    "admin",
    "ingest-questions",
    "route.ts",
  );
  assert.ok(fs.existsSync(ingestRoutePath), "Ingest route file must exist");

  const content = fs.readFileSync(ingestRoutePath, "utf-8");
  assert.ok(content.includes("x-learnivia-admin-key"), "Must enforce x-learnivia-admin-key header");
  assert.ok(content.includes("ALLOWED_DOMAINS"), "Must validate domain against domain constraints");
  assert.ok(content.includes("ALLOWED_DIFFICULTIES"), "Must validate difficulty against constraints");
  assert.ok(content.includes("q.options.length !== 4"), "Must validate exactly 4 options");
  assert.ok(content.includes("correct_answer"), "Must validate correct_answer in options");
  assert.ok(content.includes("upsert"), "Must execute idempotent batch upsert");
});

test("Task 4: Next.js Performance & Guardrails verification", () => {
  // Check TopBar for zero empty hrefs
  const topBarPath = path.join(ROOT, "src", "components", "TopBar.tsx");
  const topBarContent = fs.readFileSync(topBarPath, "utf-8");
  assert.ok(!topBarContent.includes('href="#"'), "TopBar must not contain empty href='#' links");

  // Check next.config.ts image cache TTL and headers
  const nextConfigPath = path.join(ROOT, "next.config.ts");
  const nextConfigContent = fs.readFileSync(nextConfigPath, "utf-8");
  assert.ok(nextConfigContent.includes("minimumCacheTTL"), "next.config.ts must configure image cache TTL");
  assert.ok(nextConfigContent.includes("max-age=31536000"), "next.config.ts must set aggressive caching for static media");
});

test("UI/UX & Bugfixes: Tutor Workspace, Server Redirect & Dynamic Profile Stats", () => {
  // Tutor Workspace header actions should NOT have Training Modules link
  const tutorPagePath = path.join(ROOT, "src", "app", "tutor", "page.tsx");
  const tutorPageContent = fs.readFileSync(tutorPagePath, "utf-8");
  assert.ok(
    !tutorPageContent.includes("Training Modules</span>"),
    "Tutor workspace header actions must not clutter with redundant Training Modules button",
  );

  // Training page must be a server component with instant redirect for approved tutors
  const trainingPagePath = path.join(ROOT, "src", "app", "tutor", "training", "page.tsx");
  const trainingPageContent = fs.readFileSync(trainingPagePath, "utf-8");
  assert.ok(
    !trainingPageContent.startsWith('"use client"'),
    "Training page must be a server component for zero-flash redirects",
  );
  assert.ok(
    trainingPageContent.includes("redirect(\"/tutor\")"),
    "Training page must redirect approved tutors to /tutor immediately",
  );

  // Public tutor profile must compute dynamic member year and use interactive message button
  const tutorProfilePath = path.join(ROOT, "src", "app", "tutor", "[id]", "page.tsx");
  const tutorProfileContent = fs.readFileSync(tutorProfilePath, "utf-8");
  assert.ok(
    !tutorProfileContent.includes("<strong className={styles.statValue}>2024</strong>"),
    "Must not hardcode 2024 for member since",
  );
  assert.ok(
    tutorProfileContent.includes("TutorMessageButton"),
    "Tutor profile must use interactive TutorMessageButton",
  );

  // Color grading of Pathway 2 in how-it-works must not be dark navy box
  const howItWorksCssPath = path.join(ROOT, "src", "app", "how-it-works", "page.module.css");
  const howItWorksCss = fs.readFileSync(howItWorksCssPath, "utf-8");
  assert.ok(
    !howItWorksCss.includes(".altSection {\n  background-color: var(--navy);"),
    "Pathway 2 must not use jarring dark navy background that breaks color grading",
  );
});
