export interface ArticleOrStory {
  id: string;
  slug: string;
  title: string;
  category: "STUDENT_SUCCESS" | "TUTOR_SPOTLIGHT" | "STUDY_GUIDE" | "COMMUNITY_NEWS";
  categoryLabel: string;
  categoryColor: string;
  categoryBg: string;
  badge: string;
  excerpt: string;
  fullContent: string[];
  keyTakeaways?: string[];
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorInstitution?: string;
  readTime: string;
  publishedDate: string;
  featured?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export const STORIES_AND_BLOG: ArticleOrStory[] = [
  {
    id: "story-1",
    slug: "raised-sat-math-150-points",
    title: "How I Raised My Digital SAT® Math Score by 150 Points in Just 4 Weeks",
    category: "STUDENT_SUCCESS",
    categoryLabel: "Student Success",
    categoryColor: "#7C3AED",
    categoryBg: "#F5F3FF",
    badge: "150+ Score Improvement",
    featured: true,
    excerpt:
      "Struggling with advanced Desmos graphing and circle geometry, Anya connected with Marcus, a Stanford tutor on Learnivia. Here is the exact 4-week study system they followed.",
    fullContent: [
      "When I took my first diagnostic Digital SAT in August, I scored a 580 on the Math section. I had solid fundamentals, but the clock was my worst enemy. I kept getting stuck on multi-step polynomials and advanced Desmos tricks.",
      "I found Learnivia through a school friend and registered for Marcus's weekly Digital SAT Math Bootcamp. Unlike generic video tutorials, Marcus walked us through actual past problems, showing us how to recognize question traps in under 20 seconds.",
      "In our twice-a-week interactive sessions, Marcus didn't just lecture — he had us take turns sharing our thought process. When I made a mistake, he didn't just tell me the answer; he asked guided questions until I spotted the error myself.",
      "By week 3, my practice test score was up to 690. When official test day arrived in October, I felt completely calm. My final score was a 730 on Math! Learnivia gave me the targeted peer coaching I could never have afforded with private tutoring.",
    ],
    keyTakeaways: [
      "Master the built-in Desmos graphing calculator for circle equations and systems of equations.",
      "Practice error-logging: every missed problem must be re-solved correctly three days later.",
      "Peer accountability creates a collaborative environment where making mistakes feels productive.",
    ],
    authorName: "Anya R.",
    authorRole: "Grade 11 Student",
    authorAvatar: "👩‍🎓",
    authorInstitution: "High School Junior, Chicago",
    readTime: "4 min read",
    publishedDate: "August 28, 2026",
    ctaText: "Explore SAT Bootcamps",
    ctaLink: "/sessions?subject=SAT+Prep",
  },
  {
    id: "story-2",
    slug: "stanford-tutor-why-peer-learning-works",
    title: "Why Peer Tutoring Outperforms Traditional Lectures: A Tutor's Perspective",
    category: "TUTOR_SPOTLIGHT",
    categoryLabel: "Tutor Spotlight",
    categoryColor: "#0E8345",
    categoryBg: "#E6F4EA",
    badge: "Verified Tutor • 58 Hours",
    featured: false,
    excerpt:
      "Marcus O. has volunteered over 58 hours teaching Calculus and Digital SAT prep. He reflects on the cognitive science of peer teaching and how it helped him at Stanford.",
    fullContent: [
      "There is a phenomenon in cognitive psychology known as the 'Protégé Effect' — you never truly understand a concept until you teach it to someone else. When I started tutoring on Learnivia during my senior year, my goal was simply to earn volunteer service hours.",
      "What I didn't anticipate was how much it would transform my own academic clarity. Explaining calculus limits to a tenth-grader requires breaking down abstract symbols into intuitive physical analogies.",
      "In traditional classrooms, students are often afraid to ask 'stupid questions'. In peer tutoring, the age gap is tiny. Students immediately open up about where their confusion actually starts. That psychological safety is why peer learning works so well.",
      "Today at Stanford, the communication skills I developed on Learnivia have been invaluable in team projects, research labs, and seminar discussions.",
    ],
    keyTakeaways: [
      "Tutors develop deeper conceptual mastery through the act of structured explanation.",
      "Peer-to-peer tutoring removes the intimidation barrier present in traditional classrooms.",
      "Verified volunteer transcripts provide auditable proof of leadership for scholarship and college apps.",
    ],
    authorName: "Marcus O.",
    authorRole: "Stanford '27 Tutor",
    authorAvatar: "🧑‍🏫",
    authorInstitution: "Stanford University",
    readTime: "5 min read",
    publishedDate: "August 24, 2026",
    ctaText: "Become a Volunteer Tutor",
    ctaLink: "/apply",
  },
  {
    id: "story-3",
    slug: "top-5-sat-reading-transition-traps",
    title: "The Top 5 Digital SAT® Reading Transition Traps and How to Avoid Them",
    category: "STUDY_GUIDE",
    categoryLabel: "Study Guide & Tips",
    categoryColor: "#2563EB",
    categoryBg: "#EFF6FF",
    badge: "Test Prep Guide",
    featured: false,
    excerpt:
      "Transition words on the Digital SAT Reading & Writing module account for crucial points. Master the 3 relationship categories and spot deceptive distractors.",
    fullContent: [
      "Transition questions appear 4 to 6 times per test module on the Digital SAT. They look simple on the surface, but the College Board crafts distractors designed to exploit students who read too quickly.",
      "1. The Category Test: Every transition word falls into one of three buckets: Continuance (moreover, furthermore), Contrast (however, conversely), or Cause & Effect (therefore, consequently). Never look at the answer choices until you determine which relationship the two sentences have.",
      "2. The 'However' Trap: Students often default to 'However' whenever they see a mild shift in focus. On the Digital SAT, 'However' requires a direct contradiction, not merely an extension or qualification.",
      "3. Redundant Modifiers: Watch out for options like 'In conclusion' when the paragraph is not concluding an overarching argument, or 'Similarly' when the second sentence is actually providing empirical evidence for the first.",
      "Practice these questions by crossing out the transition blank completely, identifying the core logical relationship between Sentence A and Sentence B, and only then picking the matching word.",
    ],
    keyTakeaways: [
      "Read the sentences before and after the blank without looking at the choices first.",
      "Categorize transitions into Continuance, Contrast, or Cause & Effect.",
      "Beware of subtle false contrasts that only qualify rather than oppose.",
    ],
    authorName: "Jordan T.",
    authorRole: "Harvard '26 Tutor",
    authorAvatar: "🧑‍💻",
    authorInstitution: "Harvard University",
    readTime: "6 min read",
    publishedDate: "August 19, 2026",
    ctaText: "Browse Reading Bootcamps",
    ctaLink: "/sessions?subject=SAT+Prep",
  },
  {
    id: "story-4",
    slug: "mastering-chemistry-stoichiometry",
    title: "Conquering AP Chemistry Stoichiometry When Classroom Lectures Weren't Enough",
    category: "STUDENT_SUCCESS",
    categoryLabel: "Student Success",
    categoryColor: "#7C3AED",
    categoryBg: "#F5F3FF",
    badge: "Grade 10 Milestone",
    featured: false,
    excerpt:
      "Elena was failing her unit exams on limiting reactants. A 1-on-1 peer session with an MIT sophomore completely unlocked dimensional analysis.",
    fullContent: [
      "In October, my chemistry grade dropped to a C-. I spent hours reading the textbook and watching videos, but every time I encountered a multi-step limiting reactant problem, the conversions became a chaotic mess of fractions.",
      "I booked a 1-on-1 session with David on Learnivia. Instead of throwing formulas at me, David showed me a 'railroad track' method for unit cancellation. We spent 45 minutes working through three tricky lab scenario questions together.",
      "Having someone watch me solve problems in real-time meant David caught the exact moment my logic slipped. Two weeks later, I scored a 96% on our unit exam! I now attend the weekly chemistry study circle every Thursday.",
    ],
    keyTakeaways: [
      "Dimensional analysis requires rigorous unit tracking rather than formula memorization.",
      "Live 1-on-1 debugging spots conceptual blind spots that self-study misses.",
      "Consistent small-group study circles build exam resilience over time.",
    ],
    authorName: "Elena V.",
    authorRole: "Grade 10 Learner",
    authorAvatar: "👩‍🔬",
    authorInstitution: "High School Sophomore",
    readTime: "3 min read",
    publishedDate: "August 15, 2026",
    ctaText: "Find a Science Tutor",
    ctaLink: "/sessions?subject=Science",
  },
  {
    id: "story-5",
    slug: "crafting-an-authentic-personal-statement",
    title: "How to Craft an Authentic Common App Essay That Admissions Officers Remember",
    category: "STUDY_GUIDE",
    categoryLabel: "College Admissions",
    categoryColor: "#D97706",
    categoryBg: "#FFFBEB",
    badge: "College Prep Masterclass",
    featured: false,
    excerpt:
      "Admissions officers read thousands of essays about sports injuries and model UN trips. Here is how to find the genuine, everyday moment that reveals your true character.",
    fullContent: [
      "The biggest trap students fall into with their personal statement is trying to summarize their entire resume into 650 words. An essay is not a list of achievements; it is a demonstration of how your mind works.",
      "The most compelling essays often center on small, specific moments: fixing a broken bicycle with a younger sibling, deciphering a family recipe, or managing a community gardening project during a drought.",
      "In our Learnivia College Admissions Workshops, mentors from Stanford, Harvard, and Oxford help high school seniors brainstorm 'micro-stories' that highlight resilience, curiosity, and intellectual humility.",
    ],
    keyTakeaways: [
      "Show, don't tell: ground your essay in concrete sensory details and specific dialogue.",
      "Focus on internal transformation rather than external accolades.",
      "Get feedback from multiple peer mentors who don't know your resume inside-out.",
    ],
    authorName: "Priya M.",
    authorRole: "Admitted to UC Berkeley '28",
    authorAvatar: "👩‍💻",
    authorInstitution: "UC Berkeley",
    readTime: "7 min read",
    publishedDate: "August 10, 2026",
    ctaText: "Explore College Workshops",
    ctaLink: "/sessions?subject=College+Admissions",
  },
  {
    id: "story-6",
    slug: "learnivia-surpasses-205k-students",
    title: "Learnivia Celebrates 205,000+ Students Worldwide: Our Free Education Mission",
    category: "COMMUNITY_NEWS",
    categoryLabel: "Platform News",
    categoryColor: "#059669",
    categoryBg: "#ECFDF5",
    badge: "Global Milestone",
    featured: false,
    excerpt:
      "From high schools across North America to study circles in Kenya, India, and the UK, our peer-learning community continues to prove that quality education can be accessible and 100% free.",
    fullContent: [
      "Today, Learnivia reached a major milestone: over 205,000 learners and tutors have joined our global community across 90+ countries.",
      "When we founded Learnivia, the core philosophy was simple: every student deserves access to high-quality academic mentorship, regardless of their family's budget or zip code.",
      "Our volunteer tutors have hosted more than 45,000 hours of live study sessions, homework help rooms, and test prep bootcamps. Every single minute is logged with verifiable digital transcripts that tutors use for their college and scholarship applications.",
      "To our entire community of learners, tutors, parents, and educators: thank you for making free peer learning a global reality.",
    ],
    keyTakeaways: [
      "Over 205,000 students active across 90+ nations.",
      "100% free access preserved with zero paywalls or subscriptions.",
      "Over 45,000 verified volunteer hours awarded to high school and university tutors.",
    ],
    authorName: "Rendus",
    authorRole: "CEO & Founder",
    authorAvatar: "🦊",
    authorInstitution: "Learnivia Core Team",
    readTime: "4 min read",
    publishedDate: "August 01, 2026",
    ctaText: "Join Learnivia Free",
    ctaLink: "/signup",
  },
];
