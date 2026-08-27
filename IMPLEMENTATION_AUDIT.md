# IMPLEMENTATION AUDIT — Learnivia Platform

**Date:** 2026-08-27  
**Auditor:** Lead Product Engineer  
**Live URL:** https://learnivia-green.vercel.app

---

## 1. Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.3.2 (App Router, Turbopack) | |
| Language | TypeScript 5 | strict mode disabled — implicit `any` allowed |
| Auth | NextAuth.js 5 beta (JWT strategy) | Google OAuth + Credentials |
| DB | PostgreSQL via Supabase | Prisma 7.9.1 + `@prisma/adapter-pg` |
| ORM | Prisma | Driver adapter pattern |
| Styling | CSS Modules | No design token system; variables in `globals.css` |
| Fonts | Arial/Helvetica (system fallback) | No web font loaded |
| Package Manager | npm | `package-lock.json` present |
| Deployment | Vercel | `postinstall: prisma generate` ✓ |

---

## 2. Current Route Map

| Route | File | Auth Required | Status |
|---|---|---|---|
| `/` | `app/page.tsx` | No | ✅ Working |
| `/signin` | `app/signin/page.tsx` | No | ✅ Working |
| `/onboarding` | `app/onboarding/page.tsx` | Yes | ✅ Working |
| `/find` | `app/find/page.tsx` | No | ⚠️ No error/loading/empty states |
| `/tutor/[id]` | `app/tutor/[id]/page.tsx` | No | ⚠️ Wrong path (`/tutor/[id]` not `/tutors/[id]`) |
| `/tutor` | `app/tutor/page.tsx` | Yes | ✅ Tutor dashboard |
| `/apply` | `app/apply/page.tsx` | Recommended | ⚠️ Redirects to broken `/api/auth/signin` (not `/signin`); no callbackUrl |
| `/dashboard` | `app/dashboard/page.tsx` | Yes | ✅ Working |
| `/admin` | `app/admin/page.tsx` | Yes | ✅ Working |
| `/how-it-works` | `app/how-it-works/page.tsx` | No | ✅ Basic content |
| `/about` | `app/about/page.tsx` | No | ✅ Basic content |
| **MISSING** | — | — | ❌ `/learn`, `/stories`, `/safety`, `/parents`, `/educators`, `/support`, `/privacy`, `/terms`, `/cookies`, `/book/[tutorId]` |

---

## 3. Known Bugs

1. **`/apply` login redirect** — links to `/api/auth/signin` (raw NextAuth endpoint) not the custom `/signin` page. No `callbackUrl` so user is not returned to `/apply` after login.
2. **`/find` error states** — No `error.tsx`, `loading.tsx`, or `not-found.tsx`. A DB error crashes the whole page.
3. **`/find` prerender** — Fixed via `force-dynamic` but still no loading skeleton or error UI for the client.
4. **Navbar `/login` link** — Points to `/login` (404) instead of `/signin`.
5. **Missing routes** — `/safety`, `/how-it-works`, `/stories`, etc. are 404 or show the login redirect.
6. **Middleware public paths** — Many new routes not added to `publicPaths`; logged-out users get redirected to onboarding.
7. **No `<Footer>`** — No site-wide footer; legal pages, safety links, etc. are unreachable.
8. **No mobile menu** — Navbar is a simple flex row; collapses badly on small screens.
9. **No Google Font** — Body uses system Arial; heading hierarchy and rhythm are weak.
10. **`/tutor/[id]` vs `/tutors/[id]`** — Route path is inconsistent with planned IA.
11. **Middleware blocks `/tutor/*` paths** — Unauthenticated users cannot view tutor profiles.
12. **`/admin` is publicly listed in nav considerations** — No role guard visible in nav.
13. **CSS dark-mode rule** — `prefers-color-scheme: dark` sets `color-scheme: dark` but no dark tokens defined — can cause unreadable pages.

---

## 4. Data Sources

- **Live DB:** Supabase PostgreSQL (connection string in `.env`)
- **Models:** User, TutorProfile, GradeLevel, Subject, Availability, Booking
- **Missing Models:** Program/Course, Story/Testimonial, Report, Announcement, FAQ
- **Demo data:** None — all pages pull from live DB (empty state not handled gracefully)

---

## 5. Assets

Located in `public/images/`:
- `logo.png` — Learnivia logo
- `become-a-tutor.png` — mascot
- `book-a-session.png` — mascot
- `find-a-tutor.png` — mascot
- `join-zoom.png` — mascot
- `session-complete.png` — mascot
- `volunteer-hours.png` — mascot

---

## 6. Proposed File Plan

### Phase 1 — Bug Fixes (immediate)
- Fix `/apply` callbackUrl and sign-in link
- Fix Navbar `/login` → `/signin`; add mobile menu
- Add `publicPaths` for all new/existing public routes in middleware
- Add `error.tsx` and `loading.tsx` to `/find` and `/tutor/[id]`
- Remove broken dark-mode CSS rule or implement proper dark tokens

### Phase 2 — Design System
- Add Google Fonts (Inter) via `layout.tsx`
- Expand `globals.css` with full token set (type scale, spacing, container, focus ring)
- Create reusable `Footer` component
- Refactor `Navbar` with dropdown, mobile drawer, auth-aware links

### Phase 3 — New Routes
- `/learn` — program catalog with 6 original programs (static data, typed)
- `/learn/[slug]` — program detail
- `/safety` — trust center
- `/stories` — community stories (demo data, clearly labelled)
- `/stories/[slug]` — story detail
- `/parents` and `/educators` landing pages
- `/support` — FAQ accordion
- `/privacy`, `/terms`, `/cookies` — legal stubs for review

### Phase 4 — Feature Improvements
- `/find` — search, filters, skeleton loader, error/empty states, retry
- `/apply` — multi-step form with progress, callbackUrl fix
- `/book/[tutorId]` — booking flow (currently embedded in `/tutor/[id]`)
- Homepage — announcement bar, program preview, tutor spotlight, safety section, footer CTA

### Phase 5 — Schema Additions
- `Program` model with slug, title, description, subjects, outcomes
- `Story` model with consent flag
- `Announcement` model

### Phase 6 — QA
- `QA_CHECKLIST.md`
- TypeScript strict check
- Mobile/desktop visual review

---

## 7. Environment Variables Required

| Variable | Status | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ Set | Supabase PostgreSQL |
| `AUTH_SECRET` | ✅ Set | NextAuth session signing |
| `GOOGLE_CLIENT_ID` | ✅ Set | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | ✅ Set | Google OAuth |
| `ZOOM_ACCOUNT_ID` | ❌ Not set | Zoom meeting creation (mock used) |
| `ZOOM_CLIENT_ID` | ❌ Not set | Zoom Server-to-Server OAuth |
| `ZOOM_CLIENT_SECRET` | ❌ Not set | Zoom Server-to-Server OAuth |
| `NEXTAUTH_URL` | ❌ Not explicit | Required for some redirect scenarios |
