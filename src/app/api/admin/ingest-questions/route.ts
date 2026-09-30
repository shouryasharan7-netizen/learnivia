import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_DOMAINS = new Set([
  "Computer Science & Algorithms",
  "STEM (Physics, Mathematics, Artificial Intelligence)",
  "Global History, Heritage & World Geography",
  "Logical Reasoning & General Trivia",
]);

const ALLOWED_DIFFICULTIES = new Set([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Olympiad/Contest",
]);

interface QuestionInput {
  id?: string;
  domain: string;
  topic: string;
  difficulty: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  verified?: boolean;
}

/**
 * POST /api/admin/ingest-questions
 * Protected Batch Question Ingestion Endpoint.
 * Authenticated via `x-learnivia-admin-key` header.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate secret header
    const providedKey = req.headers.get("x-learnivia-admin-key");
    const configuredKey =
      process.env.ADMIN_API_KEY ||
      process.env.AUTH_SECRET ||
      "learnivia-super-admin-2026";

    if (!providedKey || providedKey !== configuredKey) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing x-learnivia-admin-key header." },
        { status: 401 },
      );
    }

    // 2. Parse & validate JSON payload
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Payload must be a JSON array of question objects." },
        { status: 400 },
      );
    }

    if (body.length === 0) {
      return NextResponse.json(
        { error: "Payload array must contain at least 1 question." },
        { status: 400 },
      );
    }

    if (body.length > 50) {
      return NextResponse.json(
        { error: "Payload exceeds maximum batch limit of 50 questions." },
        { status: 400 },
      );
    }

    // 3. Validate every question object against schema & invariants
    const sanitizedQuestions: any[] = [];
    const validationErrors: string[] = [];

    for (let i = 0; i < body.length; i++) {
      const q: Partial<QuestionInput> = body[i];
      const prefix = `Item [${i}]`;

      if (!q.domain || !ALLOWED_DOMAINS.has(q.domain)) {
        validationErrors.push(
          `${prefix}: 'domain' must be one of: ${Array.from(ALLOWED_DOMAINS).join(", ")}.`,
        );
      }

      if (!q.topic || typeof q.topic !== "string" || !q.topic.trim()) {
        validationErrors.push(`${prefix}: 'topic' is required and must be non-empty.`);
      }

      if (!q.difficulty || !ALLOWED_DIFFICULTIES.has(q.difficulty)) {
        validationErrors.push(
          `${prefix}: 'difficulty' must be one of: ${Array.from(ALLOWED_DIFFICULTIES).join(", ")}.`,
        );
      }

      if (!q.question_text || typeof q.question_text !== "string" || !q.question_text.trim()) {
        validationErrors.push(`${prefix}: 'question_text' is required and must be non-empty.`);
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        validationErrors.push(`${prefix}: 'options' must be an array of exactly 4 choices.`);
      } else {
        const uniqueOpts = new Set(q.options.map((o) => (typeof o === "string" ? o.trim() : "")));
        if (uniqueOpts.size !== 4 || uniqueOpts.has("")) {
          validationErrors.push(`${prefix}: 'options' must contain 4 distinct, non-empty strings.`);
        }
      }

      if (!q.correct_answer || typeof q.correct_answer !== "string" || !q.correct_answer.trim()) {
        validationErrors.push(`${prefix}: 'correct_answer' is required.`);
      } else if (Array.isArray(q.options) && !q.options.includes(q.correct_answer.trim())) {
        validationErrors.push(
          `${prefix}: 'correct_answer' ("${q.correct_answer}") must exactly match one of the 4 options.`,
        );
      }

      if (!q.explanation || typeof q.explanation !== "string" || !q.explanation.trim()) {
        validationErrors.push(`${prefix}: 'explanation' is required and must be non-empty.`);
      }

      if (validationErrors.length > 0) {
        continue;
      }

      const cleanItem: any = {
        domain: q.domain,
        topic: q.topic!.trim(),
        difficulty: q.difficulty,
        question_text: q.question_text!.trim(),
        options: q.options,
        correct_answer: q.correct_answer!.trim(),
        explanation: q.explanation!.trim(),
        verified: q.verified !== undefined ? Boolean(q.verified) : true,
      };

      if (q.id && typeof q.id === "string" && q.id.trim()) {
        cleanItem.id = q.id.trim();
      }

      sanitizedQuestions.push(cleanItem);
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed for batch ingestion.",
          details: validationErrors,
        },
        { status: 422 },
      );
    }

    // 4. Idempotent Upsert into Supabase
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "https://shsgqluaqexqwoxuakzr.supabase.co";
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "";

    let upsertedCount = 0;
    let insertedIds: string[] = [];

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase
          .from("questions")
          .upsert(sanitizedQuestions, { onConflict: "id" })
          .select("id");

        if (error) {
          throw error;
        }

        upsertedCount = data?.length || sanitizedQuestions.length;
        insertedIds = (data || []).map((row: any) => row.id);
      } catch (sbErr: any) {
        console.warn("Supabase REST upsert fallback to Prisma/SQL:", sbErr.message);

        // Fallback to direct SQL execution via Prisma if available
        try {
          for (const item of sanitizedQuestions) {
            const res: any = await prisma.$queryRawUnsafe(
              `INSERT INTO public.questions (id, domain, topic, difficulty, question_text, options, correct_answer, explanation, verified)
               VALUES (COALESCE($1::uuid, gen_random_uuid()), $2, $3, $4, $5, $6::jsonb, $7, $8, $9)
               ON CONFLICT (id) DO UPDATE SET
                 domain = EXCLUDED.domain,
                 topic = EXCLUDED.topic,
                 difficulty = EXCLUDED.difficulty,
                 question_text = EXCLUDED.question_text,
                 options = EXCLUDED.options,
                 correct_answer = EXCLUDED.correct_answer,
                 explanation = EXCLUDED.explanation,
                 verified = EXCLUDED.verified
               RETURNING id`,
              item.id || null,
              item.domain,
              item.topic,
              item.difficulty,
              item.question_text,
              JSON.stringify(item.options),
              item.correct_answer,
              item.explanation,
              item.verified,
            );
            if (res && res[0]?.id) {
              insertedIds.push(res[0].id);
            }
          }
          upsertedCount = insertedIds.length;
        } catch (dbErr: any) {
          console.error("Database upsert failed:", dbErr);
          return NextResponse.json(
            { error: "Database upsert failed: " + dbErr.message },
            { status: 500 },
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      count: upsertedCount,
      ids: insertedIds,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Batch question ingestion error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error during ingestion." },
      { status: 500 },
    );
  }
}
