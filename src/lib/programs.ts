/**
 * Static program data - typed repository.
 * Replace with DB fetch when Program model is added to Prisma schema.
 * All content marked [DEMO] is example content and must be verified before launch.
 */

export interface Program {
  slug: string;
  emoji: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  subjects: string[];
  gradeLevels: string[];
  format: string;
  duration: string;
  outcomes: string[];
  faq: { question: string; answer: string }[];
}

export const PROGRAMS: Program[] = [
  {
    slug: "homework-help",
    emoji: "",
    title: "Homework Help",
    shortDescription:
      "Get one-on-one support with any assignment, any subject across all grade levels.",
    longDescription:
      "Our Homework Help program matches you with a knowledgeable volunteer tutor who can walk through your specific assignment with you in real time. Sessions are flexible, free, and held online over Zoom.",
    subjects: [
      "Maths",
      "English",
      "Science",
      "History",
      "Geography",
      "Languages",
    ],
    gradeLevels: [
      "Primary (Years 1-6)",
      "Lower Secondary (Years 7-9)",
      "GCSE / O-Level",
      "A-Level / AP",
    ],
    format: "One-on-one via Zoom",
    duration: "30-60 minutes",
    outcomes: [
      "Complete your current assignment with confidence",
      "Understand the underlying concept, not just the answer",
      "Build good homework habits",
    ],
    faq: [
      {
        question: "Do I need to book in advance?",
        answer:
          "Yes. You choose a tutor and book a time slot that works for both of you.",
      },
      {
        question: "What if my tutor doesn't know my topic?",
        answer:
          "You can browse tutor profiles and filter by subject before booking.",
      },
    ],
  },
  {
    slug: "math-foundations",
    emoji: "",
    title: "Math Foundations",
    shortDescription:
      "Build confidence in arithmetic, algebra, geometry, and beyond with patient, knowledgeable volunteers.",
    longDescription:
      "Math Foundations is for learners who want to strengthen the core concepts beneath their current year level. Our tutors identify gaps, explain clearly, and practice problems with you at your own pace.",
    subjects: [
      "Arithmetic",
      "Algebra",
      "Geometry",
      "Trigonometry",
      "Statistics",
      "Calculus (introductory)",
    ],
    gradeLevels: [
      "Primary",
      "Lower Secondary",
      "GCSE / O-Level",
      "A-Level / AP",
    ],
    format: "One-on-one via Zoom",
    duration: "45-60 minutes",
    outcomes: [
      "Identify and address specific knowledge gaps",
      "Approach maths with greater confidence",
      "Develop problem-solving strategies",
    ],
    faq: [
      {
        question: "Is this for struggling students only?",
        answer:
          "Not at all. Learners at any level use this to solidify understanding or get ahead.",
      },
      {
        question: "What year levels are supported?",
        answer:
          "Primary through pre-university. Filter by grade level when searching for a tutor.",
      },
    ],
  },
  {
    slug: "science-support",
    emoji: "",
    title: "Science Support",
    shortDescription:
      "Explore biology, chemistry, physics, and earth science with tutors who love the subject.",
    longDescription:
      "Science Support sessions go beyond the textbook. Volunteer tutors help you connect concepts to the real world, work through lab reports, and prepare for practicals and theory exams.",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Earth & Environmental Science",
    ],
    gradeLevels: ["Lower Secondary", "GCSE / O-Level", "A-Level / AP"],
    format: "One-on-one via Zoom",
    duration: "45-60 minutes",
    outcomes: [
      "Understand scientific principles, not just definitions",
      "Improve lab report and essay-style answers",
      "Build exam confidence",
    ],
    faq: [
      {
        question: "Can tutors help with lab reports?",
        answer:
          "Yes. Share your draft and a tutor can give written and verbal feedback.",
      },
    ],
  },
  {
    slug: "exam-prep",
    emoji: "",
    title: "Exam Prep",
    shortDescription:
      "Focused preparation for standardised and school exams. Build strategies and fill knowledge gaps.",
    longDescription:
      "Exam Prep sessions are structured, goal-focused, and time-aware. Tutors help you practise past papers, decode mark schemes, manage exam anxiety, and focus your final revision efficiently.",
    subjects: [
      "All GCSE subjects",
      "A-Level / AP subjects",
      "School exam preparation",
    ],
    gradeLevels: ["GCSE / O-Level", "A-Level / AP", "University entrance"],
    format: "One-on-one via Zoom",
    duration: "60 minutes",
    outcomes: [
      "Practise past papers with guided feedback",
      "Understand what examiners are looking for",
      "Build a personalised revision plan",
    ],
    faq: [
      {
        question: "How early should I start?",
        answer: "Ideally 6-8 weeks before exams, but we can help at any stage.",
      },
      {
        question: "Can you help with exam anxiety?",
        answer:
          "Tutors can share strategies for managing nerves and building exam confidence.",
      },
    ],
  },
  {
    slug: "writing-essays",
    emoji: "",
    title: "Writing & Essays",
    shortDescription:
      "From brainstorming to final draft - get feedback on structure, clarity, argument, and grammar.",
    longDescription:
      "Writing sessions are collaborative. Share your draft or your brief, and your tutor will give direct, constructive feedback. Sessions cover academic essays, creative writing, college application personal statements, and more.",
    subjects: [
      "Academic essays",
      "Creative writing",
      "Personal statements",
      "Reports & coursework",
    ],
    gradeLevels: [
      "Lower Secondary",
      "GCSE / O-Level",
      "A-Level / AP",
      "University applications",
    ],
    format: "One-on-one via Zoom (document sharing recommended)",
    duration: "45-60 minutes",
    outcomes: [
      "Strengthen your argument and essay structure",
      "Improve clarity, grammar, and style",
      "Write with more confidence and independence",
    ],
    faq: [
      {
        question: "Should I share my draft before the session?",
        answer:
          "It helps, but not required. Tutors can also help you start from scratch.",
      },
    ],
  },
  {
    slug: "study-skills",
    emoji: "",
    title: "Study Skills",
    shortDescription:
      "Learn how to learn. Build note-taking, time management, and revision strategies that stick.",
    longDescription:
      "Study Skills sessions are for learners who feel overwhelmed, disorganised, or stuck in unproductive habits. Tutors work with you to build personalised systems for notes, planning, and revision.",
    subjects: [
      "Note-taking techniques",
      "Time management",
      "Revision planning",
      "Focus & procrastination",
    ],
    gradeLevels: [
      "Lower Secondary",
      "GCSE / O-Level",
      "A-Level / AP",
      "University",
    ],
    format: "One-on-one via Zoom",
    duration: "45 minutes",
    outcomes: [
      "Build a revision plan that fits your schedule",
      "Adopt effective note-taking strategies",
      "Improve focus and reduce procrastination",
    ],
    faq: [
      {
        question: "Is this only useful before exams?",
        answer:
          "No. Better study habits help throughout the year, not just at exam time.",
      },
    ],
  },
  {
    slug: "standardized-testing",
    emoji: "",
    title: "Standardized Testing",
    shortDescription:
      "Get tailored preparation for SAT, AP, TOEFL, and IELTS from experienced tutors.",
    longDescription:
      "Our Standardized Testing program matches you with a tutor who has mastered these critical exams. Whether you're aiming for top college admissions with the SAT or AP exams, or need to prove English proficiency via TOEFL or IELTS, our tutors will help you reach your target score.",
    subjects: ["SAT", "AP", "TOEFL", "IELTS"],
    gradeLevels: ["High School", "University applicants"],
    format: "One-on-one via Zoom",
    duration: "45-60 minutes",
    outcomes: [
      "Master exam formats and timing strategies",
      "Focus on high-yield topics and question types",
      "Achieve your target score for college admissions",
    ],
    faq: [
      {
        question: "Do tutors provide practice materials?",
        answer:
          "Many tutors use official practice tests and will guide you on where to find the best resources.",
      },
      {
        question: "Is this for absolute beginners?",
        answer:
          "Yes, our tutors can help you start from scratch or refine your skills if you are close to your goal.",
      },
    ],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}
