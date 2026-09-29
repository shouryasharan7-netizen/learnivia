# Full-Stack Website Elevation & Modernization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans with TDD to implement this plan task-by-task. Tasks use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and modernize the Learnivia website into a state-of-the-art, high-prestige educational platform adhering to the **Editorial Academic Prestige** aesthetic (`#1B4D3E` forest green, `#FAFAF8` warm alabaster, `#E5DFD5` refined border, serif typography, spring micro-interactions), atomic component structure, rock-solid accessibility, and 100% passing tests.

**Branch:** `feature/website-elevation`  
**Tech Stack:** Next.js 16 (App Router + Turbopack), React 19, TypeScript 5, Prisma 7 / Postgres, Framer Motion, Vanilla CSS Modules & Design System Tokens.

---

## Task Breakdown

### Task 1: Unify Design System Tokens & Typography (TDD)
- [x] Unify global CSS tokens in `src/app/globals.css`:
  - `--primary`: `#1B4D3E` (Ivy forest primary)
  - `--primary-hover`: `#0F2F26` (Deep botanical ink)
  - `--primary-light`: `#EAF2EE` (Mint sage tint)
  - `--surface`: `#FAFAF8` (Warm alabaster background)
  - `--surface-raised`: `#FFFFFF` (Surface white)
  - `--surface-subtle`: `#F3EFE8` (Subtle warm stone container)
  - `--border`: `#E5DFD5` (Refined warm border)
  - `--text-primary`: `#1C1917` (Charcoal primary text)
  - `--text-muted`: `#78716C` (Warm secondary text)
  - Spring transitions: `--wa-spring: cubic-bezier(0.16, 1, 0.3, 1)`
  - Elevated shadows: `--wa-shadow-sm`, `--wa-shadow-md`, `--wa-shadow-lg`
- [x] Update regression assertion in `tests/phase0_phase1.test.ts` to assert token integrity so Phase 1 token test runs 100% green.

---

### Task 2: Polish Landing / Hero & Interactive Client Elements
- [x] Update hero badges and value proposition styling with Ivy forest green and mint accents.
- [x] Enhance CTA buttons with subtle micro-scale feedback (`:active { transform: scale(0.98); }`).
- [x] Ensure full mobile viewport ergonomics with 48px touch targets and fluid responsive scaling.

---

### Task 3: Elevate Tutor Discovery Experience (`/find`)
- [x] Filter pills with active state indicator pill styling and search form integration.
- [x] Refine session cards with Ivy green accents and spring hover elevation.
- [x] Maintain verified badge and subject mastery chips with subtle warm stone backgrounds.

---

### Task 4: Modernize Learner Dashboard (`/dashboard`)
- [x] Refine upcoming sessions card with Ivy green buttons and 1-click Google Calendar sync.
- [x] Live countdown and status indicators.
- [x] Clean empty states and direct link to `/find`.

---

### Task 5: Interactive Session Room Polish (`/sessions/[id]`)
- [x] Ensure 1-click Google Calendar sync button is prominently featured in session details.
- [x] Align SessionChat theme colors and resource drawer with Ivy forest green (`#1B4D3E`).
- [x] Reassurance security badges and responsive chat ergonomics.

---

### Task 6: Full Regression Test Suite & Production Build (Phase 5)
- [x] Run the full regression test suite (`npx ts-node -T tests/phase0_phase1.test.ts`) -> 12/12 PASSED (100% GREEN).
- [x] Run full production build (`npm run build`) -> 40/40 routes compiled cleanly with 0 errors.
- [x] Perform git commit and finish development branch workflow.
