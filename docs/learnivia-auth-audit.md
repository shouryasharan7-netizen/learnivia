# Learnivia vs Schoolhouse

**Authenticated product audit: public pages, student, tutor, and administrator interfaces**

**Audit date:** 30 September 2026  
**Learnivia:** https://learnivia-green.vercel.app/  
**Schoolhouse:** https://schoolhouse.world/  
**Authorized account used:** shouryasharan7@gmail.com  
**Mode:** Read-only exploration; no bookings, role changes, deletions, submissions, payments, or content mutations were performed.

## Executive verdict

Learnivia is not launch-ready. The public marketing site is more explicit than before about K–10 tutoring, supervision, mentor vetting, Zoom, and privacy. However, the authenticated product has serious coherence, route integrity, data integrity, and role-separation problems.

The most serious finding is the mismatch between what the public site promises and what the authenticated product actually exposes. The public site says Learnivia supports K–10, but the signed-in student dashboard shows standardized testing and the admin subject configuration explicitly warns that SAT, ACT, AP, A-Level, and college-admissions subjects are out of scope. The product therefore has conflicting scope rules in public copy, student discovery, tutor scheduling, and admin configuration.

The second serious finding is that the same account is exposed to Admin, Tutor, and Student interfaces through visible role-switching controls. Role switching can be acceptable for an authorized administrator testing the product, but it must never be the mechanism that grants access. The server must enforce the role on every route and mutation, and ordinary users must not see or reach administrator controls.

The third serious finding is that several visible navigation links lead to 404 pages or loading-only states. In particular, `/tutor-dashboard`, `/live`, `/profile`, and `/book` returned 404 pages during the authenticated audit. `/admin/reports` returned the public sign-in page instead of an admin report page. These are launch-blocking broken journeys.

Schoolhouse is a useful benchmark because its student experience has a clear dashboard, session directory, program catalog, homework-help flow, community area, tutor onboarding, certification path, profile, portfolio, schedule, settings, help desk, and safety reporting. Learnivia needs to reach that level of product completeness while keeping its own identity, scope, safeguarding model, and product decisions.

## Severity model

- **P0 — launch blocker:** security, privacy, authorization, data integrity, child-safety, broken core journey, or materially false claim.
- **P1 — critical product defect:** core workflow incomplete, route broken, major state mismatch, or user cannot complete an intended action.
- **P2 — important quality issue:** accessibility, clarity, polish, or operational weakness that should be fixed before broad launch.
- **P3 — improvement:** useful refinement after the foundation is stable.

## 1. Public pre-signup comparison

### 1.1 Learnivia public page strengths

Learnivia’s current public page clearly states several product ideas that are not obvious on its older prototype:

- K–10 focus.
- Mathematics, reading, writing, science, social studies, and standardized-test topics.
- 45-minute supervised Zoom lessons.
- Parent access and observation.
- Five-stage mentor vetting.
- Platform-only communication.
- Privacy and zero-retention claims.
- Safety reporting and guardian guidance.

This is a stronger trust direction than the earlier static prototype. The language is specific and operational rather than generic.

### 1.2 Learnivia public problems

**P0 — claims must be verified**

The public page states that Learnivia is an independent non-profit academic initiative, uses a strict Child Protection Charter, performs academic-record and identity checks, conducts five safeguarding modules, generates cryptographic audit identifiers, issues verified PDF transcripts, and investigates reports within 24 hours. These must all be true operationally before launch. If any is aspirational, change the wording to “planned,” “being implemented,” or remove the claim.

**P0 — public scope conflicts with admin scope**

The public page advertises “Standardized Testing & AP” and lists SAT, ACT, TOEFL, IELTS, and AP preparation. The authenticated admin subject configuration says Learnivia exclusively supports Kindergarten through Grade 10 and explicitly instructs administrators not to add SAT, ACT, AP, A-Level, or college-admissions subjects.

Choose one product scope. Recommended decision: launch with a verified K–10 scope first, remove standardized testing and AP from public and student surfaces, and add those offerings only after a separate approved curriculum and tutor-verification process exists.

**P1 — public calls to action need real destination checks**

The public navigation includes Find a Session, Browse Tutors, Homework Help, Community, Volunteer as Tutor, Safety, Parents, Educators, Terms, Privacy, and Cookies. Every link needs a route test and a real empty/error state. The authenticated audit found several related core routes broken, so public links must be tested end to end, not only by HTTP status.

### 1.3 Schoolhouse public strengths

Schoolhouse’s public homepage makes the offer immediately understandable: free online tutoring, peer-led community, SAT, college admissions, homework help, dialogues, Zoom, how it works, and clear sign-up paths. Its public information architecture is broad and complete: About, FAQ, Stories, Get Involved, Donate, Parents, Educators, Programs, certification, blog, and safety/help content.

Schoolhouse also uses audience-specific proof: real program descriptions, tutor positioning, community stories, operational FAQ answers, and pages that explain what happens after sign-up.

### 1.4 What Learnivia should borrow structurally, not verbally

Learnivia should adopt Schoolhouse’s completeness but not its copy, testimonials, naming, or certification claims. The required Learnivia public structure is:

1. Clear K–10 mission.
2. Program directory with real availability.
3. Parent and guardian explanation.
4. Tutor eligibility, training, and review.
5. Safety and reporting.
6. How sessions work.
7. Real stories and editorial content.
8. Help Center with actual articles.
9. Account creation and sign-in.
10. Exact, verified legal and privacy claims.

## 2. Authentication comparison

### Learnivia sign-in

The Learnivia sign-in page provides Google sign-in, email/password, forgot-password, account creation, and trust copy. Google authentication successfully reached the authorized account and redirected to `/dashboard`.

**Findings**

- **P1:** The sign-in page promises “K–10 students supported across CBSE, ICSE, IB & more,” while the dashboard and admin configuration have conflicting product scope.
- **P1:** The page should show concrete loading, OAuth failure, email-verification, locked-account, expired-session, and safe-redirect states.
- **P2:** The page has strong trust copy but too many claims near authentication. Keep the sign-in task primary and move long trust explanations below the form.

### Schoolhouse sign-in

Schoolhouse uses a separate authentication page with Google sign-in, email/password, password recovery, sign-up, Privacy Policy, and Terms of Service. Google authentication successfully reached the same authorized account and redirected to `/dashboard`.

**Schoolhouse strengths**

- Clear separation between auth and app.
- Direct password recovery control.
- Clear legal links.
- Consistent session redirect.
- No role-switching controls visible in the student dashboard.

## 3. Learnivia authenticated student interface

### 3.1 Student dashboard — `/dashboard`

**What was observed**

The dashboard shows:

- “Connect with K-10 peer tutors across every board.”
- CBSE, ICSE, IGCSE, and other curricula.
- Find a Tutor CTA.
- Mathematics, Science, English & Writing, Community Sessions, Homework Help, and Standardized Testing cards.
- Student profile summary.
- My Sessions.
- Tutor Profile.
- Session and learning-minute counters.
- Session filters by curriculum and subject.
- Tutor directory summary.
- Admin, Sessions, Reports, Tutors, and Subjects navigation in the authenticated shell.

**Findings**

- **P0:** The dashboard exposes Admin, Reports, Tutors, and Subjects in the shell for the authorized account. This may be correct for an administrator account, but ordinary student accounts must not receive these controls. Verify server-side authorization and test with a normal student account.
- **P0:** The account is simultaneously represented as a student, tutor, and administrator. The product needs an explicit workspace model. Do not silently combine all roles in one dashboard.
- **P0:** The dashboard shows “Standardized Testing” even though admin subject configuration says SAT/ACT/AP are out of scope.
- **P1:** The dashboard says “verified tutors” and “certified” in several places, but tutor verification evidence and status definitions are not consistently visible.
- **P1:** The dashboard says there are 10 verified opportunities, 10 1-on-1 mentors, and 10 group workshops, while the profile summary says zero sessions and zero learning minutes. Add data freshness and make counts derive from one canonical source.
- **P1:** The dashboard says “You have completed 1 verified sessions,” which is grammatically wrong. Use “You have completed 1 verified session.”
- **P1:** The dashboard’s “Host a Workshop” action is visible from the student experience. Only approved tutors should see and use it.
- **P2:** The dashboard is content-heavy and mixes discovery, statistics, directory, curriculum filters, and scheduling. Use a role-specific home with one next action, then move secondary content to dedicated pages.

**Exact copy fixes**

Replace “Connect with K-10 peer tutors across every board” with:

> Find patient peer support for the subject you are working on.

Replace:

> You have completed 1 verified sessions.

with:

> You have completed 1 verified session.

If the user has no sessions:

> You have not completed a session yet. Find a tutor to get started.

If the user is an administrator viewing the student workspace:

> You are viewing the Student workspace. Switch workspaces to access approved tutor or administrator tools.

**Required behavior**

- Show only the current workspace’s navigation.
- Provide an explicit workspace switcher for users who are authorized for multiple roles.
- Derive all session counts from the session ledger.
- Show timezone on all upcoming opportunities.
- Do not advertise a subject that is disabled in admin configuration.
- Use a real empty, loading, error, unauthorized, and forbidden state.

### 3.2 Sessions — `/sessions`

**What was observed**

The page is titled “My Schedule & Study Sessions.” It provides Find a Peer Tutor, Host a Workshop, and Find & Book a Peer Tutor actions. It shows no upcoming 1-on-1 sessions and a directory with 10 verified opportunities. It exposes curriculum filters and subject filters.

**Findings**

- **P1:** The page is simultaneously a personal schedule, discovery directory, and workshop directory. Separate “My schedule” from “Find a session.”
- **P1:** “Host a Workshop” is exposed in the student context.
- **P1:** The page says 10 opportunities but does not expose enough session detail in the extracted view: tutor identity, subject, grade, date, timezone, seats, safeguarding context, and cancellation behavior.
- **P1:** The no-session state offers a good next action but should include guardian and timezone context for minors.
- **P2:** Filter names are inconsistent: “Reading & Writing,” “English Language Arts,” “Learning Support,” “Homework Help,” and “Standardized Testing” may be overlapping taxonomies.

**Recommended structure**

Create separate routes:

- `/sessions` — upcoming sessions for the current user.
- `/find` — tutor and session discovery.
- `/workshops` — group offerings.
- `/calendar` — calendar view.

Each opportunity card must show:

- Tutor name and verification status.
- Subject and grade band.
- Curriculum.
- Date, time, and timezone.
- Duration.
- Seats or 1-on-1 status.
- Guardian/supervision note.
- View details / Book button.

### 3.3 Broken student routes

The following routes returned a Learnivia 404 page during the authenticated audit:

- `/live`
- `/profile`
- `/book`
- `/tutor-dashboard`

These routes are important because earlier navigation and product expectations refer to live sessions, profile settings, booking, and tutor dashboards.

**Fix**

Either implement the route or remove every link to it. Do not leave a polished 404 page behind a primary workflow. Add automated route-crawl tests that fail on unexpected 404s.

### 3.4 Homework help — `/homework-help`

The route initially showed “Loading content…” and had mixed role-shell controls. It did not expose the expected homework submission flow in the captured state.

**Findings**

- **P1:** Loading-only or delayed content must be tested with slow network and API failure conditions.
- **P1:** The page must specify whether questions are private, who can see them, expected response time, whether images can be uploaded, and how content is moderated.
- **P1:** The shell showed Admin View, Tutor View, and Student View buttons. These must be workspace controls for authorized users, not permission gates.

**Required fields**

- Subject.
- Grade band.
- Question.
- Optional attachment.
- Preferred help type: written or live.
- Privacy warning not to include names, school, address, phone, or social handles.

### 3.5 Safety — `/safety`

**What was observed**

Learnivia’s safety page is one of the strongest public/authenticated pages. It includes online-only sessions, tutor credential review, a reporting path, guardian transparency, community guidelines, privacy principles, report instructions, an email address, and deletion language.

**Findings**

- **P0:** The page promises that reports are investigated within 24 hours. Verify that moderation staffing, escalation ownership, on-call coverage, and audit logs can actually meet this promise.
- **P0:** “Parents manage minor accounts below Grade 9” is a specific rule but does not explain the legal/age basis, consent process, or what happens for learners in Grade 9/10.
- **P1:** “Session video is never recorded without explicit parental consent” needs a technically enforceable recording policy and Zoom configuration proof.
- **P1:** Safety reports must work from session, profile, message, homework, and community contexts with evidence capture and status tracking.
- **P2:** “Absolute rights” and “guarantee” wording should be reviewed legally and operationally. Use precise rights language.

**Recommended safety copy change**

Replace:

> Parents and guardians hold absolute rights to sit in, listen, and observe any session.

with:

> Parents and guardians can observe sessions for eligible minor accounts according to the session and safeguarding rules shown at booking. Learnivia will explain any limits before a session is confirmed.

This avoids an absolute promise that may conflict with session operations or privacy requirements.

## 4. Learnivia tutor interface

### 4.1 Tutor workspace — `/tutor`

**What was observed**

The tutor workspace shows:

- Verified Tutor badge.
- 2.5 Hours Verified.
- 1 Learner Supported.
- 1 Session Completed.
- 2 Approved Subjects.
- Student homework and concept questions.
- Upcoming 1-on-1 tutoring sessions.
- Schedule a Live Session or Workshop form.
- Subject, grade level, description, date, start/end time, capacity, timezone, and meeting-room configuration.
- Active workshops.
- Weekly availability.
- Verified service record.
- Recent completed sessions.

**Strengths**

- The tutor workspace is much more complete than the earlier prototype.
- It communicates the tutor’s operational responsibilities.
- It includes availability and service-record concepts.
- It shows timezone as Asia/Calcutta.
- It offers a structured workshop form rather than a vague application CTA.

**P0 findings**

- The form offers “Custom Link (Personal Zoom PMI or Google Meet ).” For minors, arbitrary personal meeting links are a high-risk design. Default to platform-controlled rooms and require review or strict allowlisting for any custom link.
- The workspace claims “Verified Tutor,” “Verified Service Hours,” and “cryptographic verification tokens.” These claims need a defined evidence model and immutable ledger.
- A tutor can publish a session that “immediately appears in the platform directory.” Add moderation, validation, duplicate detection, and safeguarding checks before publication.

**P1 findings**

- The schedule form exposes a default date and time. Do not allow accidental publication from defaults.
- The form does not visibly show parental consent requirements, age limits, session policy acknowledgement, or cancellation rules.
- “Max Capacity” is a raw number without an explanation of minimum/maximum constraints.
- The tutor workspace says “Student Homework & Concept Questions” but the empty state must specify response SLA and privacy.
- “Mark Completed” must require attendance evidence, avoid tutor-only self-certification, and prevent retroactive hour inflation.
- Weekly availability needs effective dates, timezone, blackout dates, overlap detection, and booked-slot protection.
- “Maths” appears as a workshop subject while canonical filters use “Mathematics.” Normalize subject naming.
- A session appears dated 29 Sept 2026 at 12:30 am while the current page shows 30 Sept 2026. Verify timezone conversion and whether midnight is intentional.

**Exact tutor copy recommendations**

Replace “Publish an interactive group session. When published, it immediately appears in the platform directory.” with:

> Submit a group session for review. Once required safety and scheduling checks pass, it will appear in the directory.

Add below the meeting-room selector:

> For sessions involving minors, use the Learnivia-managed room. Personal meeting links may be restricted or reviewed.

Add below “Mark Completed”:

> Completion records are created from attendance and may require learner or moderator confirmation. Do not mark a session complete if it did not occur.

### 4.2 Tutor dashboard route defect

`/tutor-dashboard` returned a 404 page even though the product shell and prior navigation refer to a tutor dashboard concept. This is a P1 broken route and should either redirect to `/tutor` or be removed from all links.

### 4.3 Tutor comparison with Schoolhouse

Schoolhouse’s tutor flow opens with “What do you want to tutor?” and clearly distinguishes Programs from Subjects. It explains that Programs have a Schoolhouse curriculum, while Subjects allow certified tutors to decide session content. It requires a tutor to agree to volunteer policy, session content policy, privacy policy, and terms before proceeding.

Learnivia should add:

- Tutor eligibility.
- Program versus subject distinction.
- Training and safeguarding agreement.
- Subject evidence.
- Review status.
- Approval and suspension state.
- Tutor code of conduct.
- Communication restrictions.
- Session-content rules.
- Service-hour calculation rules.
- Clear tutor-facing help content.

## 5. Learnivia administrator interface

### 5.1 Admin center — `/admin`

**What was observed**

The admin center exposes:

- System Command & Oversight.
- Broadcast Notice.
- Manage Users.
- 18 registered users.
- 10 approved tutors.
- 0 pending applications.
- 0 open safety reports.
- 3 one-on-one sessions.
- 5 group workshops.
- 1 community message.
- 0 homework inquiries.
- Recent registrations with names, email addresses, role, curriculum, and grade.
- Recent sessions with tutor and learner names.

**P0 findings**

- The admin dashboard shows personally identifiable information and child-related user data. Enforce least privilege, minimize fields, and log access.
- Admin metrics must be reconciled with student/tutor pages and the canonical database. The visible totals do not obviously reconcile with the student dashboard’s “10 opportunities” and the tutor workspace’s “1 active” workshop.
- Admin actions need reason codes, audit trail, confirmation, and step-up authentication for destructive or high-privilege operations.
- The admin dashboard must not be accessible to a student or tutor by changing a client-side view selector.

**P1 findings**

- “System Command & Oversight” is overly broad language. Use task-specific labels such as “Administration and safeguarding operations.”
- Recent-user lists should default to minimized fields and provide a detail view only when needed.
- Empty safety reports and homework inquiries need an operational definition: are there truly none, or is the ingestion pipeline incomplete?
- “Broadcast Notice” needs audience selection, preview, approval, scheduling, delivery status, and rollback.

### 5.2 Admin users — `/admin/users`

**What was observed**

The page supports All Users, Students, Tutors, and Admins filters, search by name/email, role selection, and permanent deletion buttons. It displays names, emails, curriculum, grade, age, SP, sessions, and tutoring hours.

**P0 findings**

- “Permanently delete user account” is a high-impact control. It should not be a direct table button. Use a detail flow with step-up authentication, typed confirmation, deletion scope, retention exceptions, and audit record. Prefer soft delete and scheduled erasure.
- Role dropdowns expose Student, Tutor, and Administrator. Role changes must be server-authorized, require a reason, create an audit log, and prevent self-promotion or removal of the last administrator.
- The table shows age and email for many users. Minimize exposure and use masked email/age where the admin task does not require the full value.
- The page lists multiple users as tutors with zero hours and “Active Member” status. Define what “Tutor” means: applied, approved, trained, active, or merely assigned a role.
- The admin table includes a visible admin account. Do not expose this to ordinary admins without a legitimate need.

**P1 findings**

- Role names should be singular and human-readable: “Student,” “Tutor,” “Administrator,” not “STUDENTs,” “TUTORs,” “ADMINs.”
- Search needs empty, loading, error, and unauthorized states.
- Deletion should explain consequences for bookings, transcripts, messages, reports, and records.

### 5.3 Admin tutors — `/admin/tutors`

**What was observed**

The page is titled “Tutor Directory & Transcripts.” It displays tutor, affiliation, subjects, real-time service hours, status, academic grades/transcript, report-card status, AI marksheet audit, service-hours record, report-card actions, suspension reason, suspend, and remove tutor controls.

**P0 findings**

- “Run AI Marksheet Audit” is a high-impact decision support action involving academic records. It needs transparency, human review, false-positive handling, audit logging, data retention rules, and an explicit statement that AI does not make final eligibility decisions.
- Academic records and transcript information are highly sensitive. Enforce narrow access and avoid exposing full data in the default table.
- “Adjust Hours” must never allow arbitrary hour creation. Use correction workflow with evidence, reason, author, timestamp, and before/after values.
- Suspension and removal need reason, notice, appeal, evidence, and audit history.

**P1 findings**

- “Report Card Pending” needs a clear upload/review status and owner.
- “0.0 hrs / 0 completed” must reconcile with the tutor workspace’s 2.5 verified hours and 1 completed session when the same tutor is viewed.
- “Approved” and “Verified Tutor” should be distinct states with explicit definitions.

### 5.4 Admin subjects — `/admin/subjects`

**What was observed**

The page displays 28 subjects in the database and 16 grade levels. It states a K–10 scope lock and shows several grades missing from the database. It also shows an out-of-scope database subject “and science.”

**P0 findings**

- The database is not aligned with the required K–10 grade-level model. The page visibly reports Grade 1, 2, 3, 5, 6, and other grades as missing from the database.
- An out-of-scope subject “and science” exists in the database. Clean canonical subject data before launch.
- Public, student, tutor, and admin subject taxonomies conflict. Create one canonical subject/grade source of truth.

**P1 findings**

- The K–10 scope lock is a good guardrail, but it needs to be enforced in application code, not only displayed in the UI.
- Add migration checks and a “database health” report.
- Do not let tutors schedule a subject that is not active and approved.

### 5.5 Admin reports — `/admin/reports`

The route returned the public Learnivia sign-in page instead of an authenticated admin reports interface.

**Finding**

- **P0/P1:** If reports is a required admin route, the route guard or page implementation is broken. If reports is intentionally unavailable, remove it from the admin navigation. Never redirect an already authenticated admin to a generic public sign-in page without explaining the reason.

### 5.6 Admin comparison with Schoolhouse

Schoolhouse does not expose a comparable public admin center in the audited user account. Therefore, direct parity cannot be claimed. Learnivia should model its admin center around least privilege, auditability, safety operations, content moderation, canonical data, and privacy minimization rather than copying the learner-facing Schoolhouse layout.

## 6. Data integrity findings

### 6.1 Conflicting service hours

Learnivia’s tutor workspace showed 2.5 verified service hours, 1 learner supported, and 1 completed session. The admin tutor directory showed a tutor record with 0.0 hours and 0 completed sessions. The student dashboard showed 0 sessions and 0 learning minutes for the signed-in account. This may reflect different records or roles, but the product needs a canonical service-hour ledger and reconciliation screen.

**Required fix**

Create one ledger with:

- Session ID.
- Tutor ID.
- Learner ID.
- Scheduled time and timezone.
- Attendance evidence.
- Completion status.
- Learner/tutor confirmation.
- Moderator correction history.
- Calculated service hours.
- Transcript issuance status.

Every dashboard, tutor page, admin page, and transcript must query this ledger.

### 6.2 Conflicting scope

The public page advertises AP and standardized testing. Student dashboard displays Standardized Testing. Admin subject page says these are prohibited. This is a release-blocking product-contract contradiction.

**Required fix**

Select the launch scope and enforce it in:

- Marketing copy.
- Navigation.
- Student dashboard.
- Session filters.
- Tutor form.
- Admin subject catalog.
- Tutor approval.
- Database constraints.
- Tests.

### 6.3 Route integrity

Known Learnivia route outcomes during the authenticated audit:

| Route | Observed result | Severity |
|---|---|---|
| `/dashboard` | Loads student/admin shell and dashboard | P0 role-model concern |
| `/sessions` | Loads schedule/discovery page | P1 mixed responsibility |
| `/tutor` | Loads tutor workspace | P1 needs governance |
| `/tutor-dashboard` | 404 | P1 |
| `/admin` | Loads admin center | P0 privacy/authorization concern |
| `/admin/users` | Loads user management | P0 destructive controls |
| `/admin/tutors` | Loads tutor/transcript management | P0 sensitive data/AI audit |
| `/admin/subjects` | Loads subject configuration | P0 database mismatch |
| `/admin/reports` | Redirects to public sign-in | P0/P1 |
| `/live` | 404 | P1 |
| `/profile` | 404 | P1 |
| `/book` | 404 | P1 |
| `/homework-help` | Loading-only state observed | P1 |
| `/calendar` | Loads schedule empty state | P1 duplicate with sessions |
| `/safety` | Loads safety page | P0 claims verification |
| transcript route | Loading-only state observed | P1 |

## 7. What Schoolhouse does better

### Student journey

Schoolhouse has a coherent student shell with Home, Find a Session, Programs, Homework Help, Community, and Become a Tutor. The dashboard gives clear entry points for college-prep programs, student-led sessions, homework help, and tutor onboarding.

Learnivia has more role-specific claims and more K–10 curriculum language, but its shell exposes mixed roles and has broken routes. Learnivia should reduce the primary student navigation to a small, stable set and make the role/workspace boundary explicit.

### Session discovery

Schoolhouse’s session directory provides search, subject filters, session cards, start times, descriptions, tutor identity, available spots, and a coherent browse experience. Learnivia’s sessions page has filters and counts but needs richer session cards and a dedicated booking flow.

### Homework help

Schoolhouse clearly distinguishes Zoom Help and Chat Help, shows average wait and tutors online, and provides a specific question field. Learnivia needs the same clarity around help mode, response expectations, privacy, and availability.

### Tutor onboarding

Schoolhouse separates Programs and Subjects, explains what each means, and presents a volunteer-policy agreement before submission. Learnivia has a stronger operational tutor workspace but needs a complete eligibility/training/review lifecycle.

### Profile and portfolio

Schoolhouse has a public profile, achievements, portfolio, certifications, downloadable portfolio, and privacy-aware profile fields. Learnivia has “Tutor Profile” and service records, but key profile, portfolio, and transcript routes are missing, loading-only, or not clearly reachable.

### Settings and account controls

Schoolhouse provides account, notifications, avatar, email, phone, username, age verification, college information, public profile, account deletion, and save controls. Learnivia’s `/profile` route returned 404, so account and privacy settings are incomplete in the authenticated experience.

### Safety/help

Schoolhouse links Help Desk and Share Safety Concern from the account menu and has a populated Help Center. Learnivia’s safety content is stronger in specificity but needs a working in-product reporting workflow, escalation operations, and populated support content.

## 8. Required implementation plan

### Phase 0 — product contract

1. Decide whether launch scope is K–10 only or includes standardized testing.
2. Write the permission matrix for Student, Parent/Guardian, Tutor, Moderator, Support, Administrator, and Super Administrator.
3. Define the workspace model for users with multiple roles.
4. Define the canonical subject and grade catalog.
5. Define the session state machine.
6. Define the service-hour ledger and transcript source of truth.
7. Verify every public safeguarding, certification, transcript, and investigation claim.

### Phase 1 — route and authorization repair

1. Remove or implement `/tutor-dashboard`, `/live`, `/profile`, `/book`, and `/admin/reports`.
2. Add route-crawl tests.
3. Enforce server-side authorization on every protected route and mutation.
4. Hide unauthorized navigation; do not rely on hidden buttons alone.
5. Add forbidden and unauthorized pages that explain the next step.

### Phase 2 — student experience

1. Separate dashboard, schedule, discovery, workshops, homework help, community, and profile.
2. Build real tutor/session detail pages.
3. Build booking with timezone, guardian, consent, slot locking, confirmation, cancellation, and reminders.
4. Implement homework help with privacy and moderation.
5. Add empty, loading, error, offline, and no-availability states.

### Phase 3 — tutor experience

1. Add eligibility, application, training, approval, suspension, and appeal states.
2. Remove uncontrolled custom meeting links for minor sessions.
3. Add platform-controlled rooms with waiting-room and host rules.
4. Make availability timezone-aware and conflict-safe.
5. Make completion and service hours evidence-based.
6. Add tutor profile, service record, transcript, and download/share controls.

### Phase 4 — administrator experience

1. Minimize sensitive fields in tables.
2. Add audit logs and reason codes.
3. Replace direct permanent delete with soft-delete workflow.
4. Add role-change guardrails and step-up auth.
5. Add moderation queue, safety report lifecycle, and escalation.
6. Add subject/grade database health checks.
7. Treat AI marksheet audit as decision support only, with human review.

### Phase 5 — trust and launch

1. Verify all claims and policies.
2. Populate Help Center content.
3. Test guardian consent with real fixtures.
4. Test browser journeys on desktop, tablet, and mobile.
5. Run accessibility, security, performance, and route-crawl checks.
6. Release through a staged rollout with rollback and monitoring.

## 9. Exact acceptance criteria

The product may not be called launch-ready until:

- Every public CTA resolves to a working route.
- No protected route unexpectedly returns 404 or redirects to public sign-in for an authenticated authorized user.
- Student, tutor, and admin navigation are distinct.
- Role switching cannot grant permissions.
- Student accounts cannot reach admin routes or mutations.
- All scope claims match the canonical subject database.
- Every booking shows date, time, timezone, tutor, subject, grade, capacity, supervision, cancellation, and confirmation.
- No double booking is possible.
- Tutor hours reconcile across all views.
- Transcript generation has one source of truth.
- Custom meeting links are restricted for minor sessions.
- Safety reports have evidence, status, owner, escalation, and audit history.
- Guardian consent and child-data isolation are tested.
- User deletion is reversible or auditable and does not directly delete records from a table click.
- Admin data exposure is minimized.
- AI review does not make unreviewed final decisions.
- Accessibility and keyboard tests pass.
- Mobile layouts pass without horizontal overflow.
- Loading-only states have timeout and error behavior.
- Privacy, Terms, Cookie, Safety, and Parent content reflects actual behavior.

## 10. Final priority list

### P0 — fix before any launch

1. Resolve the K–10 versus SAT/AP/college-admissions scope contradiction.
2. Enforce role authorization and separate Student, Tutor, and Admin workspaces.
3. Repair or remove broken protected routes.
4. Reconcile service-hour, session, and transcript data.
5. Review and verify all safety, vetting, transcript, cryptographic, and 24-hour investigation claims.
6. Remove uncontrolled personal meeting links for minor sessions.
7. Protect admin PII and sensitive academic records.
8. Add guardian consent and child-data isolation.
9. Replace direct permanent deletion and unrestricted role dropdowns with audited workflows.
10. Make safety reporting operational.

### P1 — fix before public beta

1. Separate schedule from discovery.
2. Implement complete tutor/session detail and booking journeys.
3. Add tutor application/training/review states.
4. Implement homework help with Zoom/chat modes and privacy.
5. Add profile, portfolio, transcript, and settings routes.
6. Add subject and grade database health checks.
7. Populate Help Center content.
8. Add all loading, empty, error, forbidden, and unauthorized states.
9. Normalize taxonomy and grammar.
10. Add end-to-end route and workflow tests.

### P2 — fix before broad growth

1. Simplify the dashboard information architecture.
2. Improve data freshness labels and source transparency.
3. Add accessibility and mobile polish.
4. Improve copy hierarchy and reduce claim density.
5. Add monitoring, rollback, and staged release tooling.

## References

- Learnivia public: https://learnivia-green.vercel.app/
- Learnivia dashboard: https://learnivia-green.vercel.app/dashboard
- Learnivia tutor workspace: https://learnivia-green.vercel.app/tutor
- Learnivia admin: https://learnivia-green.vercel.app/admin
- Learnivia safety: https://learnivia-green.vercel.app/safety
- Schoolhouse public: https://schoolhouse.world/
- Schoolhouse dashboard: https://schoolhouse.world/dashboard
- Schoolhouse sessions: https://schoolhouse.world/dashboard/sessions
- Schoolhouse programs: https://schoolhouse.world/dashboard/programs
- Schoolhouse homework help: https://schoolhouse.world/dashboard/live-help
- Schoolhouse community: https://schoolhouse.world/dashboard/community
- Schoolhouse tutor onboarding: https://schoolhouse.world/tutor
- Schoolhouse profile: https://schoolhouse.world/u/616665
- Schoolhouse portfolio: https://schoolhouse.world/portfolio
- Schoolhouse certification: https://schoolhouse.world/certification/get-certified
- Schoolhouse settings: https://schoolhouse.world/settings/
- Schoolhouse schedule: https://schoolhouse.world/schedule?show=upcoming
