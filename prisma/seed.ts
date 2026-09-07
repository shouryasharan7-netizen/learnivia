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
      slug: "early-reading-phonics",
      title: "Early Reading & Phonics",
      emoji: "📖",
      shortDescription: "Build early literacy, phonics skills, and reading confidence for young learners.",
      longDescription: "Designed for Kindergarten through Grade 2 students. Volunteer tutors guide young learners through letter sounds, sight words, and reading comprehension using engaging visual activities.",
      subjects: ["Phonics", "Early Reading", "Sight Words"],
      gradeLevels: ["Kindergarten", "Grade 1", "Grade 2"],
      format: "1-on-1 Sessions",
      duration: "Ongoing",
      outcomes: [
        "Mastery of letter sounds and phonemic awareness",
        "Confidence with early readers and sight words",
        "A joyful foundation for lifelong reading"
      ]
    },
    {
      slug: "coding-for-beginners",
      title: "Coding for Beginners",
      emoji: "💻",
      shortDescription: "Introduction to programming logic using Python or Scratch.",
      longDescription: "Discover the world of programming! This beginner-friendly program introduces computational thinking. Younger students start with Scratch, while older students dive straight into Python fundamentals.",
      subjects: ["Python", "Scratch", "Logic"],
      gradeLevels: ["Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"],
      format: "Small Group Workshops",
      duration: "8 Weeks",
      outcomes: [
        "Write basic Python scripts",
        "Understand loops, variables, and conditionals",
        "Build a simple text-based game"
      ],
    },
    {
      slug: "middle-school-stem",
      title: "Middle School STEM & Science",
      emoji: "🔬",
      shortDescription: "Interactive Earth science, physical science, and foundational biology.",
      longDescription: "Engaging 1-on-1 and small group sessions covering middle school science. Break down complex topics into clear visual steps and explore hands-on problem solving.",
      subjects: ["Life Science", "Earth Science", "Physical Science"],
      gradeLevels: ["Grade 6", "Grade 7", "Grade 8"],
      format: "1-on-1 or Small Group",
      duration: "Ongoing",
      outcomes: [
        "Clear grasp of scientific concepts",
        "Confidence for middle school science tests",
        "Curiosity and scientific thinking"
      ],
    },
    {
      slug: "homework-help",
      title: "Homework Help",
      emoji: "📚",
      shortDescription: "Drop-in sessions for help with daily assignments.",
      longDescription: "Stuck on a tricky math problem or need someone to review your essay? Our Homework Help program pairs you with a volunteer tutor for quick, effective assistance with your daily assignments across all major subjects.",
      subjects: ["Math", "Science", "English", "History"],
      gradeLevels: ["Kindergarten to Grade 10"],
      format: "1-on-1 Sessions",
      duration: "Flexible",
      outcomes: [
        "Completed assignments",
        "Better understanding of current topics",
        "Reduced homework stress"
      ],
    },
    {
      slug: "science-support",
      title: "Science Support",
      emoji: "🔬",
      shortDescription: "Explore biology, chemistry, and physics with confidence.",
      longDescription: "Science doesn't have to be intimidating! Our Science Support program breaks down complex concepts in Biology, Chemistry, and Physics, making them engaging and easy to understand through interactive learning.",
      subjects: ["Biology", "Chemistry", "Physics"],
      gradeLevels: ["Grade 5 to Grade 10"],
      format: "Small Group or 1-on-1",
      duration: "Ongoing",
      outcomes: [
        "Clear grasp of scientific principles",
        "Improved lab report writing",
        "Confidence in science exams"
      ],
    },
    {
      slug: "writing-essays",
      title: "Writing & Essays",
      emoji: "✍️",
      shortDescription: "Learn to structure, draft, and polish essays.",
      longDescription: "From creative writing to analytical essays, this program teaches students how to structure their thoughts, develop strong arguments, and improve their grammar and vocabulary for better grades in humanities subjects.",
      subjects: ["English Literature", "History", "Creative Writing"],
      gradeLevels: ["Grade 4 to Grade 10"],
      format: "1-on-1 Sessions",
      duration: "Ongoing",
      outcomes: [
        "Stronger essay structures",
        "Improved vocabulary and grammar",
        "Ability to construct persuasive arguments"
      ],
    },
    {
      slug: "study-skills",
      title: "Study Skills",
      emoji: "🧠",
      shortDescription: "Learn how to learn effectively and manage your time.",
      longDescription: "Good grades start with good habits. This program focuses on time management, effective note-taking, revision strategies, and overcoming procrastination to help students become independent, successful learners.",
      subjects: ["Time Management", "Revision Techniques", "Organization"],
      gradeLevels: ["All Ages"],
      format: "Workshops or 1-on-1",
      duration: "4-6 Weeks",
      outcomes: [
        "Personalized revision timetables",
        "Effective note-taking strategies",
        "Better focus and reduced procrastination"
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

  // Elevate Shourya Sharan to ADMIN and approve tutor profile if present
  const adminUser = await prisma.user.findFirst({
    where: { email: "shouryasharan7@gmail.com" },
    include: { tutorProfile: true }
  });

  if (adminUser) {
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { role: "ADMIN" }
    });

    if (adminUser.tutorProfile) {
      await prisma.tutorProfile.update({
        where: { id: adminUser.tutorProfile.id },
        data: {
          status: "APPROVED",
          school: adminUser.tutorProfile.school || "Learnivia Core Team",
          volunteerHours: adminUser.tutorProfile.volunteerHours || 0.0,
          subjects: {
            connectOrCreate: [
              { where: { name: "Mathematics" }, create: { name: "Mathematics" } },
              { where: { name: "Computer Science" }, create: { name: "Computer Science" } },
            ]
          },
          gradeLevels: {
            connectOrCreate: [
              { where: { name: "Middle School (Grades 6–8)" }, create: { name: "Middle School (Grades 6–8)" } },
              { where: { name: "Early High School (Grades 9–10)" }, create: { name: "Early High School (Grades 9–10)" } },
            ]
          }
        }
      });

      // Ensure availability slot
      const existingSlot = await prisma.availability.findFirst({
        where: { tutorId: adminUser.tutorProfile.id }
      });
      if (!existingSlot) {
        await prisma.availability.createMany({
          data: [
            { tutorId: adminUser.tutorProfile.id, dayOfWeek: 2, startTime: "16:00", endTime: "17:00", timezone: "Europe/London" },
            { tutorId: adminUser.tutorProfile.id, dayOfWeek: 4, startTime: "17:00", endTime: "18:00", timezone: "Europe/London" },
            { tutorId: adminUser.tutorProfile.id, dayOfWeek: 6, startTime: "11:00", endTime: "12:00", timezone: "Europe/London" },
          ]
        });
      }
    }
    console.log("Elevated shouryasharan7@gmail.com to ADMIN and APPROVED tutor status");
  }

  // Seed 2 Exemplar Approved Tutors for Live Public Launch
  const sampleTutors = [
    {
      email: "maya.lin@learnivia.demo",
      name: "Maya Lin",
      school: "University of Oxford",
      bio: "Biochemistry undergraduate at Oxford. Passionate about making chemistry and biology intuitive, fun, and accessible for everyone. Experienced peer mentor.",
      experience: "Passionate STEM tutor with focus on hands-on visual explanations and step-by-step problem solving.",
      volunteerHours: 0.0,
      subjects: ["Biology", "Chemistry", "Science Support"],
      gradeLevels: ["Elementary (Grades 3–5)", "Middle School (Grades 6–8)", "Early High School (Grades 9–10)"],
      slots: [
        { dayOfWeek: 1, startTime: "17:00", endTime: "18:00" },
        { dayOfWeek: 3, startTime: "16:30", endTime: "17:30" },
        { dayOfWeek: 5, startTime: "15:00", endTime: "16:00" },
      ]
    },
    {
      email: "liam.davies@learnivia.demo",
      name: "Liam Davies",
      school: "University of Cambridge",
      bio: "Mathematics Tripos student at Cambridge. I specialize in breaking down pre-algebra, geometry, and foundational math so students feel confident and supported.",
      experience: "Gold award in UKMT Senior Mathematical Challenge. Experienced volunteer peer tutor.",
      volunteerHours: 0.0,
      subjects: ["Mathematics", "Math Foundations", "Early Math"],
      gradeLevels: ["Early Elementary (K–2)", "Elementary (Grades 3–5)", "Middle School (Grades 6–8)", "Early High School (Grades 9–10)"],
      slots: [
        { dayOfWeek: 2, startTime: "18:00", endTime: "19:00" },
        { dayOfWeek: 4, startTime: "18:00", endTime: "19:00" },
        { dayOfWeek: 6, startTime: "10:00", endTime: "11:00" },
      ]
    }
  ];

  for (const st of sampleTutors) {
    const user = await prisma.user.upsert({
      where: { email: st.email },
      update: { name: st.name, role: "TUTOR" },
      create: {
        email: st.email,
        name: st.name,
        role: "TUTOR",
        timezone: "Europe/London",
        onboardingCompleted: true,
      }
    });

    const profile = await prisma.tutorProfile.upsert({
      where: { userId: user.id },
      update: {
        status: "APPROVED",
        school: st.school,
        bio: st.bio,
        experience: st.experience,
        volunteerHours: st.volunteerHours,
      },
      create: {
        userId: user.id,
        status: "APPROVED",
        school: st.school,
        bio: st.bio,
        experience: st.experience,
        volunteerHours: st.volunteerHours,
      }
    });

    // Connect subjects
    for (const sub of st.subjects) {
      await prisma.tutorProfile.update({
        where: { id: profile.id },
        data: {
          subjects: {
            connectOrCreate: {
              where: { name: sub },
              create: { name: sub }
            }
          }
        }
      });
    }

    // Connect grade levels
    for (const gr of st.gradeLevels) {
      await prisma.tutorProfile.update({
        where: { id: profile.id },
        data: {
          gradeLevels: {
            connectOrCreate: {
              where: { name: gr },
              create: { name: gr }
            }
          }
        }
      });
    }

    // Seed slots
    const slotsCount = await prisma.availability.count({ where: { tutorId: profile.id } });
    if (slotsCount === 0) {
      await prisma.availability.createMany({
        data: st.slots.map(s => ({
          tutorId: profile.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          timezone: "Europe/London",
        }))
      });
    }

    // Seed sample review
    const reviewCount = await prisma.review.count({ where: { tutorId: profile.id } });
    if (reviewCount === 0 && adminUser) {
      await prisma.review.create({
        data: {
          tutorId: profile.id,
          studentId: adminUser.id,
          rating: 5,
          comment: "Incredible session! Explained everything so clearly and patiently. Really boosted my confidence.",
        }
      });
    }
  }

  console.log("Seeded Sample Approved Tutors");

  // Seed sample upcoming workshop
  const cambridgeTutor = await prisma.tutorProfile.findFirst({
    where: { school: "University of Cambridge" }
  });

  if (cambridgeTutor) {
    const nextSaturday = new Date();
    nextSaturday.setDate(nextSaturday.getDate() + ((6 - nextSaturday.getDay() + 7) % 7 || 7));
    nextSaturday.setHours(11, 0, 0, 0);

    const endWorkshop = new Date(nextSaturday);
    endWorkshop.setHours(12, 30, 0, 0);

    await prisma.workshop.upsert({
      where: { id: "sample-workshop-math" },
      update: {},
      create: {
        id: "sample-workshop-math",
        tutorId: cambridgeTutor.id,
        title: "Mastering Quadratic Equations & Algebra",
        description: "Interactive small-group study room covering factoring, the quadratic formula, and completing the square with practice exam questions.",
        subject: "Mathematics",
        grade: "GCSE / Secondary",
        startTime: nextSaturday,
        endTime: endWorkshop,
        maxCapacity: 10,
        zoomLink: "https://zoom.us/j/9876543210",
        status: "UPCOMING",
      }
    });
    console.log("Seeded Upcoming Live Group Workshop");
  }
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
