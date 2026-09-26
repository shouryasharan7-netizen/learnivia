export interface ArticleOrStory {
  id: string;
  slug: string;
  title: string;
  category:
    "STUDENT_SUCCESS" | "TUTOR_SPOTLIGHT" | "STUDY_GUIDE" | "COMMUNITY_NEWS";
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

// Stories are submitted by real users - no fabricated SAT/test-prep stories
// These are example templates. Real stories populate from DB (admin-approved user submissions).
export const STORIES_AND_BLOG: ArticleOrStory[] = [
  {
    id: "story-1",
    slug: "grade-5-fractions-breakthrough",
    title: "How 3 Zoom Sessions Changed the Way I Think About Fractions",
    category: "STUDENT_SUCCESS",
    categoryLabel: "Student Success",
    categoryColor: "#0E8345",
    categoryBg: "#F0FDF4",
    badge: "Grade 5 · Mathematics",
    excerpt:
      "A Grade 5 learner who had struggled with fractions for two years finally had a breakthrough after working with a Learnivia volunteer tutor using visual pizza diagrams.",
    fullContent: [
      "For two years, fractions felt like a brick wall. Every time my teacher moved on, I nodded, but inside I was completely lost. My mum didn't want to spend money on a private tutor, but she also knew I was falling behind.",
      "A classmate told her about Learnivia. We signed up that evening. Within a day, I was matched with Aisha, a Grade 11 volunteer who specialized in elementary mathematics.",
      "Aisha didn't lecture. She drew pizza slices on the Zoom whiteboard. She asked me questions. She waited patiently when I needed to think. Three sessions later, I could convert fractions to decimals without a calculator.",
      "What changed wasn't just my maths grade, it was my confidence. I stopped raising my hand to say 'I don't understand' and started saying 'let me try first'.",
    ],
    keyTakeaways: [
      "Visual whiteboard explanations helped where text-based methods failed",
      "Patient, K-10 specialized tutors adapt to the student's pace",
      "Even 3 sessions can create lasting confidence shifts",
    ],
    authorName: "Priya K.",
    authorRole: "Grade 5 Student",
    authorAvatar: "PK",
    readTime: "3 min read",
    publishedDate: "August 2026",
    featured: true,
    ctaText: "Find a Maths Tutor",
    ctaLink: "/find?subject=Mathematics",
  },
  {
    id: "story-2",
    slug: "tutor-spotlight-volunteer-hours",
    title: "What 47 Hours of Tutoring Taught Me About Teaching (and Myself)",
    category: "TUTOR_SPOTLIGHT",
    categoryLabel: "Tutor Spotlight",
    categoryColor: "#C9922A",
    categoryBg: "#F5F3FF",
    badge: "Tutor · Grade 11",
    excerpt:
      "A volunteer tutor reflects on what they learned from teaching K-8 students across 47 sessions, and why peer learning is the most powerful educational model they have encountered.",
    fullContent: [
      "I applied to Learnivia thinking I would teach students. I did not expect to learn so much myself.",
      "In my first session, a Grade 3 student named James asked me why you can't divide by zero. I gave the standard answer: 'because it's undefined.' He stared at me. 'But why is it undefined?' I had to actually think. That question sent me down a rabbit hole that improved my own mathematical intuition.",
      "47 sessions later, I have a verified Volunteer Service Record with verifiable session IDs accepted by my school advisor. But more than that, I have 47 memories of the moment a concept clicked for a young learner.",
      "If you're in high school and wondering whether to apply: do it. The impact is real. The hours are verified. And the experience is genuinely unlike anything else on a university application.",
    ],
    keyTakeaways: [
      "Teaching younger students deepens your own subject understanding",
      "Learnivia Volunteer Records include verifiable session IDs",
      "The experience is genuinely formative, not just a line on a CV",
    ],
    authorName: "Rayan A.",
    authorRole: "Grade 11 Volunteer Tutor",
    authorAvatar: "RA",
    readTime: "4 min read",
    publishedDate: "September 2026",
    featured: false,
    ctaText: "Apply to Tutor",
    ctaLink: "/apply",
  },
  {
    id: "story-3",
    slug: "learning-support-no-diagnosis",
    title:
      "My Son Doesn't Have a Diagnosis - and That's OK. Learnivia Helped Anyway.",
    category: "COMMUNITY_NEWS",
    categoryLabel: "Parent Perspective",
    categoryColor: "#1D4ED8",
    categoryBg: "#EFF6FF",
    badge: "Parent · Grade 6 Student",
    excerpt:
      "A parent shares how the Learning Support feature helped their Grade 6 son who learns differently, without requiring a formal diagnosis or label.",
    fullContent: [
      "My son has always needed more time. He's not slow: his teacher says he is one of the most creative problem-solvers in class. But he processes information differently, and traditional fast-paced lessons leave him behind.",
      "We looked into private tutors. The cost was prohibitive. We looked into SEND support at school. He didn't qualify without a formal diagnosis, which we couldn't afford to pursue.",
      "Then we found Learnivia's 'Learning Support' filter. His tutor, Zara, uses visual diagrams, breaks every problem into tiny numbered steps, and never moves on until he confirms he has followed. She re-explains the same concept five different ways without any frustration.",
      "My son's Grade 6 science grade went from a D to a B in one term. More importantly, he has stopped saying 'I'm not a maths person.' That phrase, which broke my heart every time I heard it, is gone.",
    ],
    keyTakeaways: [
      "No diagnosis required to access Learning Support sessions",
      "Visual, step-by-step approaches work for many learner profiles",
      "Learnivia is free: no cost barrier to quality support",
    ],
    authorName: "Sarah M.",
    authorRole: "Parent of a Grade 6 Learner",
    authorAvatar: "SM",
    readTime: "5 min read",
    publishedDate: "September 2026",
    featured: false,
    ctaText: "Find a Learning Support Tutor",
    ctaLink: "/find?subject=Learning+Support",
  },
];
