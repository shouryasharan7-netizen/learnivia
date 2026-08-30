export interface CommunityMessage {
  id: string;
  channel: string;
  authorName: string;
  authorEmail: string;
  authorRole: "STUDENT" | "TUTOR" | "COMMUNITY LEAD";
  authorInitials: string;
  authorColor: string;
  content: string;
  timestamp: string;
  reactions: {
    heart: number;
    clap: number;
    bulb: number;
    fire: number;
  };
}

// In-memory persistent store with realistic initial community discussions
let messagesStore: CommunityMessage[] = [
  {
    id: "msg-1",
    channel: "Announcements",
    authorName: "Learnivia Team",
    authorEmail: "admin@learnivia.org",
    authorRole: "COMMUNITY LEAD",
    authorInitials: "LT",
    authorColor: "#0E8345",
    content: "🎉 Welcome to the Learnivia Community! This is your space to connect with fellow learners and volunteer tutors around the globe. Join live sessions, ask questions in Homework Help, and start study circles in the channels below.",
    timestamp: "Today at 9:00 AM",
    reactions: { heart: 24, clap: 19, bulb: 8, fire: 15 },
  },
  {
    id: "msg-2",
    channel: "Announcements",
    authorName: "Marcus Sterling",
    authorEmail: "marcus@learnivia.org",
    authorRole: "TUTOR",
    authorInitials: "MS",
    authorColor: "#7C3AED",
    content: "📢 Hosting an AP Calculus & Precalculus interactive review session this Thursday at 5:00 PM EST. We'll be walking through integration techniques and chain rule tips. RSVP in the Sessions tab!",
    timestamp: "Today at 1:30 PM",
    reactions: { heart: 12, clap: 8, bulb: 14, fire: 5 },
  },
  {
    id: "msg-3",
    channel: "Introductions",
    authorName: "Elena Vance",
    authorEmail: "elena@school.edu",
    authorRole: "STUDENT",
    authorInitials: "EV",
    authorColor: "#2563EB",
    content: "Hi everyone! 👋 I'm a junior from Chicago studying for the October SAT. Looking forward to practicing with everyone in the SAT Bootcamp and getting help on AP Chemistry!",
    timestamp: "Today at 2:15 PM",
    reactions: { heart: 9, clap: 11, bulb: 3, fire: 4 },
  },
  {
    id: "msg-4",
    channel: "SAT Bootcamp Learners",
    authorName: "David Chen",
    authorEmail: "david@college.edu",
    authorRole: "TUTOR",
    authorInitials: "DC",
    authorColor: "#0E8345",
    content: "Quick tip for Digital SAT Reading: Pay close attention to transition words like 'Furthermore', 'Conversely', and 'Consequently'. They are your roadmap to predicting the author's next assertion before reading the choices!",
    timestamp: "Today at 3:45 PM",
    reactions: { heart: 18, clap: 14, bulb: 29, fire: 12 },
  },
  {
    id: "msg-5",
    channel: "College Admissions Workshop Learners",
    authorName: "Priya Menon",
    authorEmail: "priya@university.edu",
    authorRole: "TUTOR",
    authorInitials: "PM",
    authorColor: "#D97706",
    content: "For everyone finalizing their Common App personal statements: Remember to focus on reflection over narration. 70% of your essay should be about what your experience taught you and how your mindset shifted, not just describing the event.",
    timestamp: "Today at 4:10 PM",
    reactions: { heart: 16, clap: 22, bulb: 17, fire: 8 },
  },
  {
    id: "msg-6",
    channel: "Random",
    authorName: "Alex Rivera",
    authorEmail: "alex@learnivia.org",
    authorRole: "STUDENT",
    authorInitials: "AR",
    authorColor: "#DC2626",
    content: "What's everyone's favorite lo-fi playlist or background sound when grinding through late night problem sets? 🎧",
    timestamp: "Today at 4:55 PM",
    reactions: { heart: 7, clap: 4, bulb: 6, fire: 10 },
  },
  {
    id: "msg-7",
    channel: "Study Circles",
    authorName: "Hannah Kim",
    authorEmail: "hannah@hs.org",
    authorRole: "STUDENT",
    authorInitials: "HK",
    authorColor: "#0D9488",
    content: "Starting a weekend biology study circle for cell respiration and photosynthesis. Who wants to join a 45-min Zoom review session this Saturday?",
    timestamp: "Today at 5:20 PM",
    reactions: { heart: 11, clap: 7, bulb: 12, fire: 9 },
  },
];

export function getMessages(channel?: string): CommunityMessage[] {
  if (!channel || channel === "Home" || channel === "All") {
    return messagesStore;
  }
  return messagesStore.filter(
    (m) => m.channel.toLowerCase() === channel.toLowerCase()
  );
}

export function addMessage(msg: Omit<CommunityMessage, "id" | "timestamp" | "reactions">): CommunityMessage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const dateStr = "Today at " + timeStr;

  const newMessage: CommunityMessage = {
    ...msg,
    id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    timestamp: dateStr,
    reactions: { heart: 0, clap: 0, bulb: 0, fire: 0 },
  };

  messagesStore.unshift(newMessage);
  return newMessage;
}

export function toggleReaction(messageId: string, reactionType: "heart" | "clap" | "bulb" | "fire"): CommunityMessage | null {
  const msg = messagesStore.find((m) => m.id === messageId);
  if (!msg) return null;
  msg.reactions[reactionType] = (msg.reactions[reactionType] || 0) + 1;
  return msg;
}
