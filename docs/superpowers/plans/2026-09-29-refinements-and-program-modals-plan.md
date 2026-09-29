# Refinements & Program Overview Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up unwanted Observatory banner from Home, build an interactive Program Overview modal for the Navbar "Explore Programs" menu (describing grade band curricula, tutor pacing, and learning goals without redirecting), replace empty placeholders on `/how-it-works` with genuine rich illustrations and smooth spring animations, and rebalance the awkward 7th card on the `/learn` page into a symmetrical 3×3 grid.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Framer Motion, Vanilla CSS (CSS Modules & Global Tokens).

---

## Task Breakdown

### Task 1: Remove Academic Observatory Banner from Home Page
**Files:**
- Modify: `src/app/HomeInteractiveClient.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

**Steps:**
- [x] Remove the Academic Observatory teaser card section from `HomeInteractiveClient.tsx`.
- [x] Remove `/observatory` links from `Navbar.tsx` and `Footer.tsx` to keep navigation clean and focused on core platform value.
- [x] Verify home page visually and ensure zero layout shift.

---

### Task 2: Interactive Program Overview Modal for "Explore Programs" (Navbar)
**Problem:** Clicking grade bands in "Explore Programs" immediately redirected users to `/find` or `/sessions` without explaining what the curriculum includes, what age it targets, or how sessions work.
**Files:**
- Create: `src/components/discovery/ProgramDetailsModal.tsx`
- Create: `src/components/discovery/ProgramDetailsModal.module.css`
- Modify: `src/components/Navbar.tsx`

**Details per Program Band:**
1. **Early Elementary (K–Grade 2 | Ages 5–8)**:
   - What's Included: Phonics decoding, guided story reading, basic numbers & arithmetic, spatial geometry, patient 30-min sessions with visual whiteboards.
   - Guardian Role: Parent/guardian check-in required, continuous gentle encouragement.
2. **Elementary (Grades 3–5 | Ages 8–11)**:
   - What's Included: Fraction arithmetic, word problem modeling, reading comprehension, introductory earth & life sciences, active note-taking.
   - Session Format: 45-minute interactive problem walkthroughs.
3. **Middle School (Grades 6–8 | Ages 11–14)**:
   - What's Included: Pre-Algebra, linear equations, PEEL essay writing, cell biology, introductory chemistry, study skills.
   - Session Format: 45-60 minute structured mentoring.
4. **Early High School (Grades 9–10 | Ages 14–16)**:
   - What's Included: Algebra I & II, Geometry proofs, Biology & Chemistry lab concept review, high school literature analysis.
   - Session Format: 60-minute rigorous peer coaching and test review.

**Steps:**
- [x] Create `ProgramDetailsModal.tsx` with Framer Motion backdrop blur, spring reveal animation (`scale: [0.95, 1]`, `opacity: [0, 1]`), tab/card navigation, key highlights, sample topics, and a "Browse Tutors for this Level" button.
- [x] Update `src/components/Navbar.tsx` so clicking any program in the dropdown opens this modal instead of redirecting away.
- [x] Add keyboard accessibility (Escape key to dismiss, focus trap, aria attributes).

---

### Task 3: Replace Placeholders with Real Illustrations on `/how-it-works`
**Problem:** The `/how-it-works` page displayed empty dashed outline boxes with faint search and calendar icons (`imagePlaceholder`) instead of real illustrations.
**Files:**
- Modify: `src/app/how-it-works/page.tsx`
- Modify: `src/app/how-it-works/page.module.css`

**Steps:**
- [x] Wire up real PNG assets from `public/images/`:
  - Student Step 1: `/images/find-a-tutor.png` ("Pick Your Subject")
  - Student Step 2: `/images/book-a-session.png` ("Book an Open Slot")
  - Student Step 3: `/images/join-zoom.png` ("Learn & Grow")
  - Tutor Step 1: `/images/become-a-tutor.png` ("Get Certified")
  - Tutor Step 2: `/images/session-complete.png` ("Host Sessions")
  - Tutor Step 3: `/images/volunteer-hours.png` ("Earn Verified Hours")
  - Parent Step: Generate or wire a dedicated safety/guardian oversight visual (`/images/parent-supervision.png` or curated visual).
- [x] Add smooth CSS/Framer Motion scroll-in animations for each row (alternating slide-ins, spring card hover elevations).
- [x] Ensure responsive image sizing with Next.js `<Image>` (aspect-ratio preserved, zero layout shift).

---

### Task 4: Rebalance the 7-Card Grid on `/learn` (Image 5)
**Problem:** 7 program cards in a 3-column grid left a single lonely card ("Standardized Testing") stranded on row 3 with two empty columns.
**Files:**
- Modify: `src/lib/programs.ts`
- Modify: `src/app/learn/page.tsx`
- Modify: `src/app/learn/page.module.css`

**Steps:**
- [x] Add 2 essential, high-demand academic programs to `PROGRAMS` in `src/lib/programs.ts`:
  1. `reading-literacy`: **Reading & Literacy** (Phonics decoding, vocabulary, reading fluency, textual comprehension for Primary & Middle).
  2. `coding-logic`: **Coding & Digital Logic** (Introductory Python, algorithmic thinking, scratch logic, digital fluency for Grades 4-10).
- [x] This expands `PROGRAMS` from 7 to exactly 9 cards, filling a beautiful, symmetrical 3×3 grid.
- [x] Add spring hover elevations, subtle icon micro-animations, and responsive column transitions in `src/app/learn/page.module.css`.

---

### Task 5: Verification, Production Build & Deployment
- [x] Run `npm run build` to verify all 40+ routes compile cleanly without type or build errors.
- [ ] Test the user flows:
  1. Verify Observatory banner is gone from Home.
  2. Click "Explore Programs" in Navbar -> check that detailed info modal opens cleanly with animations.
  3. Visit `/how-it-works` -> confirm real images render in place of empty placeholders.
  4. Visit `/learn` -> confirm symmetrical 3x3 grid with no awkward lone card.
- [ ] Commit, push to GitHub `main`, deploy to Vercel production, and verify HTTP 200.
