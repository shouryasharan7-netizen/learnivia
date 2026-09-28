# OreoAI-Inspired Interactive Transitions & Academic Observatory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement tactile spring-based micro-interactions and blueprint accents across the production website (Approach 3) while building a dedicated local Academic Observatory prototype (Approach 1) at `/observatory` featuring an interactive knowledge reactor, 3D credential flip cards, and a tactile curriculum scrubber.

**Architecture:** Global CSS tokens and utility classes for spring physics and hairline coordinate tags applied across the live app. A standalone route (`src/app/observatory`) with modular client components for the HTML5 canvas physics graph, tactile difficulty slider, and 3D perspective flip cards.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS (CSS Modules & Global Tokens), HTML5 Canvas 2D API.

**Spec:** [`docs/superpowers/specs/2026-09-29-oreoai-transitions-and-observatory-design.md`](file:///Users/shouryasharan/.gemini/antigravity-ide/scratch/learnivia/docs/superpowers/specs/2026-09-29-oreoai-transitions-and-observatory-design.md)

---

## Global Constraints

- Retain warm academic editorial styling (`#FAFAF8` paper canvas, `#0F172A` deep navy, `#059669` forest green). No neon AI slop.
- Zero external runtime animation libraries (use native CSS transitions, CSS transforms, and requestAnimationFrame Canvas 2D).
- Complete accessibility compliance with `@media (prefers-reduced-motion: reduce)`.
- Full TypeScript typing and zero SSR hydration mismatches.

## Review Focus

1. **Canvas Window Resize**: Canvas redraws smoothly on viewport resize without stretching or memory leaks.
2. **Touch Screen Compatibility**: Tactile slider and 3D card flips respond cleanly to touch events on iOS/Android.
3. **Reduced Motion Graceful Fallback**: Disables continuous canvas particle floating when reduced motion is preferred.
4. **Card Flip State Integrity**: 3D flip stays in synced state and works with keyboard navigation (Enter/Space).
5. **Production Build Zero Regressions**: All 39+ routes compile cleanly without type or build errors.

---

### Task 1: Production Kinetic Tokens & Micro-Interactions (Approach 3)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/Button.tsx` (or primary button classes)

**Interfaces:**
- Consumes: Existing CSS custom properties in `globals.css`
- Produces: `--ease-spring`, `--ease-smooth`, `.btn-tactile`, `.card-blueprint`, `.tag-mono` classes

- [ ] **Step 1: Add kinetic spring tokens and blueprint utility classes in `src/app/globals.css`**
  - Add `--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)`
  - Add `--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)`
  - Add tactile interactive button states (`:hover { transform: translateY(-2px); }`, `:active { transform: scale(0.98); }`)
  - Add hairline blueprint border utilities (`.border-blueprint-dashed`)
- [ ] **Step 2: Verify CSS parsing and build**
  - Run: `npm run build`
  - Expected: PASS
- [x] **Step 3: Commit**
  - Command: `git add src/app/globals.css && git commit -m "feat(ui): add kinetic spring tokens and blueprint utility styles"`

---

### Task 2: Tactile Curriculum & Difficulty Scrubber Component

**Files:**
- Create: `src/app/observatory/CurriculumScrubber.tsx`
- Create: `src/app/observatory/observatory.module.css`

**Interfaces:**
- Consumes: `onChange: (level: 'FOUNDATIONAL' | 'BALANCED' | 'OLYMPIAD') => void`
- Produces: `<CurriculumScrubber currentLevel={level} onChange={setLevel} />`

- [x] **Step 1: Write `CurriculumScrubber.tsx`**
  - Implement 3-way tactile slider with soundless haptic feedback visual, indicator bar, and metric tags (`T = 0.1`, `T = 1.0`, `T = 10.0`).
- [x] **Step 2: Add styles in `observatory.module.css`**
  - Hairline dashed tracks, pill indicator with spring easing.
- [x] **Step 3: Verify component renders and handles click/drag**
- [x] **Step 4: Commit**
  - Command: `git add src/app/observatory/CurriculumScrubber.tsx src/app/observatory/observatory.module.css && git commit -m "feat(observatory): add tactile curriculum scrubber component"`

---

### Task 3: 3D Credential & Report Card Flip Card Component

**Files:**
- Create: `src/app/observatory/CredentialFlipCard.tsx`

**Interfaces:**
- Consumes: Tutor profile data (name, school, verified GPA, AP/IB scores, volunteer hours)
- Produces: `<CredentialFlipCard tutor={tutor} />`

- [x] **Step 1: Implement 3D flip card with mouse tilt mechanics**
  - CSS 3D perspective (`preserve-3d`, `backface-visibility: hidden`).
  - Front: Tutor photo, bio, subjects, rating.
  - Back: AI-verified marksheet audit score (`100/100`), 5-point safeguarding stamp, and PVSA certified hours.
  - Keyboard accessible toggle (`tabIndex={0}`, `onKeyDown`).
- [x] **Step 2: Verify flip animation and backface display**
- [x] **Step 3: Commit**
  - Command: `git add src/app/observatory/CredentialFlipCard.tsx && git commit -m "feat(observatory): add 3D credential flip card component"`

---

### Task 4: Interactive Knowledge Reactor Canvas Engine

**Files:**
- Create: `src/app/observatory/KnowledgeReactorCanvas.tsx`

**Interfaces:**
- Consumes: `activeLevel: 'FOUNDATIONAL' | 'BALANCED' | 'OLYMPIAD'`
- Produces: `<KnowledgeReactorCanvas activeLevel={level} onSelectSubject={handleSelect} />`

- [x] **Step 1: Implement HTML5 Canvas 2D particle/node simulation**
  - Nodes for Core Subjects: Mathematics, Physics, Computer Science, Literature, Biology.
  - Interactive spring connections with animated pulsing packets.
  - Mouse hover repulsion and line highlight.
  - Automatic adaptation when `activeLevel` changes (nodes pulse and rewire connections).
- [x] **Step 2: Add window resize and high-DPI retina display scaling**
- [x] **Step 3: Commit**
  - Command: `git add src/app/observatory/KnowledgeReactorCanvas.tsx && git commit -m "feat(observatory): add knowledge reactor physics canvas engine"`

---

### Task 5: Assemble Local Observatory Page & Wire Up State

**Files:**
- Create: `src/app/observatory/ObservatoryClient.tsx`
- Create: `src/app/observatory/page.tsx`

**Interfaces:**
- Consumes: Tasks 2, 3, 4 components
- Produces: Route at `/observatory`

- [x] **Step 1: Build `ObservatoryClient.tsx`**
  - Technical blueprint header (`[ OBSERVATORY • ACTIVE NODES: 42 ]`, `[ UTC-5 EST ]`, live pulse indicator).
  - Integrates `KnowledgeReactorCanvas`, `CurriculumScrubber`, and a showcase grid of `CredentialFlipCard`s.
- [x] **Step 2: Build `page.tsx` with SEO metadata**
- [x] **Step 3: Verify local route at `http://localhost:3000/observatory`**
- [x] **Step 4: Commit**
  - Command: `git add src/app/observatory/ObservatoryClient.tsx src/app/observatory/page.tsx && git commit -m "feat(observatory): assemble academic observatory interactive route"`

---

### Task 6: Verification, Production Build & Deployment

**Files:**
- None (system-wide verification)

- [x] **Step 1: Run production build `npm run build`**
  - Verify all 40+ routes compile cleanly.
- [x] **Step 2: Test locally on `http://localhost:3000` and `http://localhost:3000/observatory`**
- [x] **Step 3: Commit, push to GitHub `main`, and deploy to Vercel production**
  - `git push origin main`
  - `CI=1 vercel --prod --yes`
- [x] **Step 4: Verify production HTTP 200 on live URL**
