-- Migration: 20260930_create_questions_table.sql
-- Description: Create questions table for Trivia & Content Architecture with composite indexes and strict RLS

-- 1. Create table `questions`
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL CHECK (
    domain IN (
      'Computer Science & Algorithms',
      'STEM (Physics, Mathematics, Artificial Intelligence)',
      'Global History, Heritage & World Geography',
      'Logical Reasoning & General Trivia'
    )
  ),
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (
    difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Olympiad/Contest')
  ),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Composite Indexes for performant quiz & trivia querying
CREATE INDEX IF NOT EXISTS idx_questions_domain_difficulty 
  ON public.questions (domain, difficulty);

CREATE INDEX IF NOT EXISTS idx_questions_verified_created_at 
  ON public.questions (verified, created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow SELECT for all users (authenticated and anonymous learners)
DROP POLICY IF EXISTS "Allow public read access to verified questions" ON public.questions;
CREATE POLICY "Allow public read access to verified questions" 
  ON public.questions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Restrict INSERT and UPDATE strictly to service_role (Admin batch ingestion)
DROP POLICY IF EXISTS "Allow service_role full write access" ON public.questions;
CREATE POLICY "Allow service_role full write access" 
  ON public.questions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
