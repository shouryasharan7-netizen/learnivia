# QA CHECKLIST — Learnivia Platform

**Status legend:** ✅ Pass | ⚠️ Partial / needs attention | ❌ Fail | 🔲 Not yet tested

---

## Routes

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ | Hero, programs, steps, tutor spotlight, safety, dual-CTA |
| `/learn` | ✅ | 6 program cards |
| `/learn/[slug]` | ✅ | Static generation, metadata, outcomes, FAQ |
| `/find` | ✅ | `force-dynamic`, error.tsx, loading.tsx |
| `/tutor/[id]` | ⚠️ | Working but path should eventually move to `/tutors/[id]` |
| `/apply` | ✅ | Login prompt with callbackUrl, multi-field form |
| `/dashboard` | ✅ | Auth-gated, upcoming bookings |
| `/signin` | ✅ | Email+Google, callbackUrl, terms note |
| `/onboarding` | ✅ | Multi-step flow |
| `/how-it-works` | ✅ | Students & tutors flow |
| `/about` | ✅ | Mission content |
| `/stories` | ✅ | Demo stories clearly labelled, share CTA |
| `/safety` | ✅ | Guidelines, session rules, reporting, privacy |
| `/parents` | ✅ | Guardian Q&A |
| `/educators` | ✅ | Teacher guidance |
| `/support` | ✅ | FAQ accordion grouped |
| `/privacy` | ⚠️ | Draft — PENDING LEGAL REVIEW before launch |
| `/terms` | ⚠️ | Draft — PENDING LEGAL REVIEW before launch |
| `/cookies` | ⚠️ | Draft — PENDING LEGAL REVIEW before launch |

---

## Header / Navigation

| Check | Status | Notes |
|---|---|---|
| Logo links to `/` | ✅ | |
| Explore Learning dropdown renders | ✅ | |
| Dropdown closes on outside click | ✅ | |
| Dropdown closes on route change | ✅ | |
| Mobile hamburger shows at ≤768px | ✅ | |
| Mobile drawer opens/closes | ✅ | |
| Auth-aware: shows Dashboard/Sign out when logged in | ✅ | |
| Auth-aware: shows Sign In / Find Support when logged out | ✅ | |
| No broken `/login` link (fixed to `/signin`) | ✅ | |
| Keyboard navigation through nav | ✅ | ARIA expanded/haspopup |

---

## Footer

| Check | Status | Notes |
|---|---|---|
| All footer links render | ✅ | Learn, Volunteer, Community, Legal groups |
| Footer visible on all pages | ✅ | Added to root layout |
| Safety badge link works | ✅ | |
| Legal disclaimer with safety link | ✅ | |

---

## /find Page

| Check | Status | Notes |
|---|---|---|
| `force-dynamic` prevents build error | ✅ | |
| `loading.tsx` skeleton renders | ✅ | 6 skeleton cards |
| `error.tsx` shows retry + go home | ✅ | No raw DB error exposed |
| Empty state handled | ✅ | "No tutors available" message |
| Tutor cards show correct data | ✅ | |

---

## /apply Page

| Check | Status | Notes |
|---|---|---|
| Logged-out: shows informative prompt (not blank redirect) | ✅ | |
| Logged-out: Sign in link has `callbackUrl=/apply` | ✅ | |
| User returns to `/apply` after sign-in | ✅ | |
| Form has grade levels, subjects, bio, experience | ✅ | |
| Checkboxes for guidelines/safeguarding/privacy | ✅ | |
| `required` validation on key fields | ✅ | |
| "What happens next" note visible | ✅ | |

---

## Authentication

| Check | Status | Notes |
|---|---|---|
| Google OAuth sign-in | ✅ | callbackUrl passed |
| Email/Password sign-in | ✅ | callbackUrl passed |
| Email/Password registration | ✅ | |
| Error message on bad credentials | ✅ | Accessible alert role |
| Session persists in navbar | ✅ | useSession |
| Sign out clears session | ✅ | |

---

## Accessibility

| Check | Status | Notes |
|---|---|---|
| One `<h1>` per page | ✅ | |
| `alt=""` on decorative images | ✅ | Mascots use empty alt |
| `alt` with description on informative images | ✅ | |
| Form `<label>` associated with `<input>` via `htmlFor` | ✅ | |
| Error messages use `role="alert"` | ✅ | |
| Focus rings visible (custom CSS variable) | ✅ | `--focus-ring` |
| `aria-expanded` on hamburger | ✅ | |
| `aria-label` on hamburger button | ✅ | |
| Semantic landmark elements (`<header>`, `<main>`, `<footer>`, `<nav>`) | ✅ | |
| `prefers-reduced-motion` respected | ✅ | CSS `@media` rule |
| Dropdown has `role="menu"` and items have `role="menuitem"` | ✅ | |

---

## Responsive Design

| Breakpoint | Status | Notes |
|---|---|---|
| 360px (mobile) | ✅ | Single column, hamburger nav |
| 768px (tablet) | ✅ | 2-column grids |
| 1024px | ✅ | Transitions to desktop layout |
| 1440px | ✅ | Max-width containers |
| No horizontal overflow | ✅ | `overflow-x: hidden` on body |

---

## Known Limitations / Next Milestones

1. **Legal pages** — `/privacy`, `/terms`, `/cookies` are clearly marked drafts. Must be completed by a legal professional before launch.
2. **Stories** — `/stories` shows demo data. Real stories require a `Story` model in Prisma, consent workflow, and admin approval.
3. **`/tutors/[id]`** — Currently served at `/tutor/[id]`. Consider migrating route for IA consistency.
4. **Zoom integration** — Booking creates a placeholder Zoom link. Real Zoom API (Server-to-Server OAuth) requires `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET` in env.
5. **Email notifications** — No transactional email (booking confirmations, application status). Recommend adding Resend or similar.
6. **Admin review flow** — `/admin` allows status changes but lacks full audit log, notification, and role guard in UI.
7. **Review/ratings** — Noted as "in development" in FAQ. Requires new `Review` Prisma model.
8. **Multi-step apply** — Currently step 1 only. Step 2 ("Review") screen not yet built.
9. **Search/filter on /find** — UI exists but filters are visual-only. Real filter implementation requires URL params + server-side Prisma WHERE clauses.
10. **`/book/[tutorId]`** — Booking flow is embedded in tutor profile. A dedicated booking route would improve UX.

---

## Environment Variables Required

| Variable | Status |
|---|---|
| `DATABASE_URL` | ✅ Required |
| `AUTH_SECRET` | ✅ Required |
| `GOOGLE_CLIENT_ID` | ✅ Required |
| `GOOGLE_CLIENT_SECRET` | ✅ Required |
| `ZOOM_ACCOUNT_ID` | ❌ Not set — placeholder used |
| `ZOOM_CLIENT_ID` | ❌ Not set |
| `ZOOM_CLIENT_SECRET` | ❌ Not set |
