import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("Seeding started...");

  // Seed Programs
  const programs = [
    {
      slug: "math-foundations",
      title: "Math Foundations",
      emoji: "📐",
      shortDescription: "Build a strong base in arithmetic, pre-algebra, and basic geometry.",
      longDescription: "Math Foundations is designed for students who need extra support to build confidence in core mathematical concepts. We cover everything from fractions and decimals to early algebraic thinking, ensuring a solid foundation for higher-level math.",
      subjects: ["Arithmetic", "Pre-Algebra", "Basic Geometry"],
      gradeLevels: ["Year 5", "Year 6", "Year 7", "Year 8"],
      format: "1-on-1 Sessions",
      duration: "Ongoing",
      outcomes: [
        "Mastery of core arithmetic operations",
        "Confidence with fractions and decimals",
        "Readiness for high school algebra"
      ],
    },
    {
      slug: "gcse-exam-prep",
      title: "GCSE Exam Prep",
      emoji: "📝",
      shortDescription: "Targeted revision for upcoming GCSEs in Math, Science, and English.",
      longDescription: "Our GCSE Exam Prep program pairs students with tutors who have recently excelled in their own exams. Sessions focus on syllabus review, exam technique, and past paper practice to maximize grades.",
      subjects: ["Math", "Biology", "Chemistry", "Physics", "English"],
      gradeLevels: ["Year 10", "Year 11"],
      format: "1-on-1 or Small Group",
      duration: "6-12 Weeks (Pre-exams)",
      outcomes: [
        "Improved exam technique and time management",
        "Targeted weak-point improvement",
        "Reduced exam anxiety"
      ],
    },
    {
      slug: "coding-for-beginners",
      title: "Coding for Beginners",
      emoji: "💻",
      shortDescription: "Introduction to programming logic using Python or Scratch.",
      longDescription: "Discover the world of programming! This beginner-friendly program introduces computational thinking. Younger students start with Scratch, while older students dive straight into Python fundamentals.",
      subjects: ["Python", "Scratch", "Logic"],
      gradeLevels: ["Year 6", "Year 7", "Year 8", "Year 9"],
      format: "Small Group Workshops",
      duration: "8 Weeks",
      outcomes: [
        "Write basic Python scripts",
        "Understand loops, variables, and conditionals",
        "Build a simple text-based game"
      ],
    },
    {
      slug: "university-admissions",
      title: "University Admissions",
      emoji: "🎓",
      shortDescription: "Guidance on personal statements and university interviews.",
      longDescription: "Navigate the complex university admissions process with guidance from current university students. We offer feedback on personal statements, interview practice, and advice on choosing courses.",
      subjects: ["Personal Statements", "Interview Prep", "UCAS Advice"],
      gradeLevels: ["Year 12", "Year 13"],
      format: "1-on-1 Mentoring",
      duration: "Flexible",
      outcomes: [
        "A polished, compelling personal statement",
        "Confidence for university interviews",
        "Clearer understanding of university life"
      ],
    }
  ];

  for (const p of programs) {
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("Seeded Programs");

  // Seed Stories
  const stories = [
    {
      id: "demo-story-1",
      quote: "My tutor didn't just help me pass my maths exam — she helped me understand why I'd been struggling for years. I went from a D to a B in two months.",
      name: "A learner, Year 11",
      subject: "GCSE Maths",
      isPublished: true,
    },
    {
      id: "demo-story-2",
      quote: "Volunteering here has been one of the most rewarding things I've done. I've logged 60+ hours and learned as much from my students as they've learned from me.",
      name: "A volunteer tutor, University Year 2",
      subject: "Biology & Chemistry",
      isPublished: true,
    },
    {
      id: "demo-story-3",
      quote: "As a parent, I was sceptical. But after sitting in on a session and seeing how patient and knowledgeable the tutor was, I'm completely convinced.",
      name: "A parent of a Year 9 student",
      subject: "English & Writing",
      isPublished: true,
    },
  ];

  for (const s of stories) {
    await prisma.story.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }

  console.log("Seeded Stories");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
