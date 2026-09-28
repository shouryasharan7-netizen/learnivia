# Specification: OreoAI-Inspired Interactive Transitions (Approach 3) & Local Academic Observatory Prototype (Approach 1)

**Date**: 2026-09-29  
**Status**: Approved by User  
**Target Platform**: Learnivia (Next.js 16 + React 19 + Vanilla CSS)  

---

## 1. Problem Statement & Scope

The user requested an OreoAI-inspired (`oreoai.vercel.app`) upgrade to Learnivia's visual and interactive experience:
1. **Production Surface (Approach 3)**: Implement tactile micro-interactions, smooth spring-based transitions, hairline coordinates, magnetic button cues, and interactive hover effects across existing live pages without disrupting existing layouts or risking performance.
2. **Local Interactive Prototype (Approach 1)**: Build a fully interactive **Academic Observatory** preview page locally (at `/observatory`) so the user can test the complete vision:
   - Interactive Knowledge Engine (physics-connected canvas nodes for subjects, grade bands, and tutor matching).
   - 3D Credential & Report Card Flip Cards.
   - Tactile Curriculum & Difficulty Scrubber (`Foundational Review` ↔ `Balanced Rigor` ↔ `Olympiad / AP Mastery`).
   - Technical blueprint aesthetics (hairline dividers, monospace coordinate chips, live calculated match metrics).

---

## 2. Architecture & Design

### Track A: Production Micro-Interactions (Approach 3)
Applied system-wide via CSS variables, utility classes, and component-level enhancements in `globals.css` and existing UI components:

1. **Kinetic Spring Utilities**:
   - `--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)` for snappy, tactile button bounces.
   - `--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)` for silky card elevations and modal reveals.
   - Micro-lift on all cards and interactive buttons (`translateY(-2px)` + subtle shadow diffusion).

2. **Blueprint Hairline Markers & Monospace Accents**:
   - Subtly integrate precision metadata labels across cards: e.g. `[ 100% NONPROFIT • VERIFIED ]`, `[ UTC-5 • EST ]`, `[ 0.00 COMM. FEE ]`.
   - Dashed hairline dividers (`border-bottom: 1px dashed rgba(15, 23, 42, 0.12)`).

3. **Active State Tactility**:
   - `active:scale(0.98)` on all primary buttons and interactive chips to give physical push-button feedback.
   - Smooth focus rings with `box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.25)` instead of harsh default outlines.

### Track B: Local Academic Observatory Prototype (Approach 1)
Located at `/observatory` (standalone route with full interactive demonstration):

1. **Interactive Knowledge Canvas / Peer Learning Reactor**:
   - HTML5 Canvas with fluid animation loop (60 FPS).
   - Draggable / hoverable nodes representing subjects: Mathematics, Physics, Computer Science, Literature, Biology.
   - Interactive bezier connection lines with animated energy pulses connecting student inquiry nodes to verified tutor profiles.
   - Reactive mouse repulsion/attraction physics.

2. **Tactile Curriculum Scrubber (Inspired by OreoAI Temperature Bar)**:
   - 3-position slider:
     - `T = 0.1`: Foundational Review (Elementary & Middle School, basic concepts, patient guidance).
     - `T = 1.0`: Balanced Curriculum (High School honors, algebra, chemistry, essay writing).
     - `T = 10.0`: Olympiad & AP Mastery (AP Calc BC, USAMO, physics competitions, college prep).
   - Dynamically reconfigures the connected nodes, match metrics, and recommended tutor cards with fluid animations.

3. **3D Credential Flip Cards**:
   - Dual-sided 3D perspective cards (`perspective: 1000px`, `transform-style: preserve-3d`).
   - Front: Tutor portrait, university, subjects, and quick stats.
   - Back: Official marksheet audit scores, 5-point safeguarding verification seal, and PVSA certified volunteer hours.
   - 3D tilt effect following mouse position.

4. **Blueprint Control Strip**:
   - Header with live session coordinates, time in UTC/local, and active learner count.
   - Technical equations and metrics (e.g., Match Latency, Verification Confidence Index).

---

## 3. Component Breakdown & Data Flow

```
Track A (Production Global):
  globals.css ──> CSS Spring Tokens, .btn-tactile, .card-blueprint, .tag-mono
  components/ui/* ──> Updated with spring transitions and physical tap feedback

Track B (Local Prototype):
  src/app/observatory/
    ├── page.tsx (Observatory Page Shell & SSR metadata)
    ├── ObservatoryClient.tsx (State management: scrubber level, selected subject, active card)
    ├── KnowledgeReactorCanvas.tsx (HTML5 Canvas physics engine)
    ├── CredentialFlipCard.tsx (CSS 3D perspective flip card with mouse tilt)
    ├── CurriculumScrubber.tsx (Tactile multi-step slider)
    └── observatory.module.css (Blueprint grid, hairline dashlines, monospace typography)
```

---

## 4. Performance & Accessibility Guarantees

* **Zero AI Slop**: Retains the warm editorial paper palette (`#FAFAF8`), deep navy (`#0F172A`), and forest accents (`#059669`).
* **Hardware Acceleration**: All animations use `transform` and `opacity` exclusively for 60 FPS performance without layout thrashing.
* **Reduced Motion Support**: `@media (prefers-reduced-motion: reduce)` disables canvas particle motion and 3D tilts, falling back to static clean cards.
* **SSR Safe**: Canvas initialization runs exclusively in `useEffect` on the client.

---

## 5. Verification Plan

1. Verify local build: `npm run build` passes with zero errors.
2. Verify local interactive route: visit `http://localhost:3000/observatory`.
3. Verify production live site: push changes to GitHub `main` and deploy to Vercel production.
