# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Learners**: K-12 students seeking academic help, homework assistance, and conceptual tutoring in core subjects (Math, Sciences, English, Humanities).
- **Volunteer Tutors**: High school and college students providing volunteer tutoring to earn verified community service hours, build leadership experience, and give back.
- **Platform Administrators**: Ahmed and Shourya, overseeing safety compliance, reviewing tutor credentials, verifying service transcripts, and moderating sessions.

## Product Purpose

Provide accessible, zero-cost, high-trust peer tutoring that empowers students to learn with confidence while offering volunteer tutors an accredited, verifiable platform for community service.

## Positioning

A strictly non-commercial, child-safe, academic peer tutoring network. Unlike commercial tutoring platforms, it is 100% free with zero paywalls, zero predatory gamification (no streaks, coins, or badges), and uncompromising safeguarding standards including mandatory 5-module tutor training and administrative vetting.

## Operating Context

- **Study Environments**: Web-based desktop and tablet interfaces used during study sessions, after-school homework hours, and weekend workshops.
- **Session Types**: 1-on-1 scheduled live video tutoring sessions and interactive group workshops.
- **Accountability & Verification**: Post-session attendance confirmations by learners and cryptographically verifiable PDF volunteer service hour transcripts for school credit.

## Capabilities and Constraints

- **Learner Workspace**: Find vetted tutors, book sessions, submit questions to the homework help forum, join group workshops, and confirm attended sessions.
- **Tutor Workspace**: Dedicated dashboard for approved tutors only. All general tutoring capabilities (overview, hour logging, session hosting, answering questions) remain locked behind mandatory completion of all 5 Safeguarding Training modules.
- **Admin Center**: Strictly restricted to Ahmed and Shourya for application reviews, user management, reports moderation, and hours verification.
- **Safety Safeguards**: Child safety domain allowlists, automated minor PII sanitization, and strict role segregation.

## Brand Commitments

- **Tone & Identity**: Scholarly, dignified, calm, and trustworthy. Refined editorial aesthetic with deep navy/slate backgrounds, clean borders, crisp typography ("Times New Roman" headings), and generous white space.
- **Zero Distraction**: No flashy animations, cartoon avatars, gamified counters, or clutter.

## Evidence on Hand

- **Production Routes**: 35 statically and dynamically compiled Next.js routes covering landing, authentication, learner desk, tutor folio, admin center, and safety report workflows.
- **Design Tokens**: Standardized CSS variables defined in `src/styles/design-tokens.css` with WCAG AA compliance.
- **Automated Validation**: 12/12 passing test suites enforcing route integrity, permissions matrix, safeguarding checks, and booking state machines.

## Product Principles

1. **Safety and Safeguarding First**: Every tutor must be vetted and pass all 5 safeguarding modules before interacting with students.
2. **Academic Dignity over Engagement Tricks**: Clean editorial typography and high readability replace gamification and engagement hacks.
3. **Transparent Accountability**: Every service hour is tied to confirmed session attendance and verifiable official transcripts.
4. **Accessible to Every Learner**: 100% free, responsive across devices, and designed to work reliably on varying internet connections.

## Accessibility & Inclusion

- WCAG 2.1 AA compliant color contrast ratios across dark navy, slate, and neutral surfaces.
- Full keyboard navigability across booking calendars, forms, and video lesson controls.
- Screen-reader accessible labels and ARIA attributes on all interactive elements.
