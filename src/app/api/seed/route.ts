import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addSummaryForUser } from "../summaries/route";

const demoSummaries = [
  {
    id: crypto.randomUUID(),
    videoId: "dQw4w9WgXcQ",
    title: "The Ultimate Espresso Technique Guide",
    channel: "James Hoffmann",
    duration: 2460,
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    transcript: "This is a demo transcript for the espresso guide video...",
    verdict: {
      text: "Worth watching if you are getting into espresso and want to understand extraction: the first 20 minutes are excellent. Skip the second half if you already own a decent grinder.",
      tags: ["Grind size", "Dose & yield", "Extraction theory", "Pre-infusion"],
    },
    takeaways: {
      items: [
        { text: "Grind size is the single highest-leverage variable. A 1-click adjustment changes everything downstream.", timestamp: "3:12" },
        { text: "Dose and yield form a ratio. 1:2 is standard; lighter roasts often need 1:2.5 or more.", timestamp: "8:45" },
        { text: "Pre-infusion at low pressure before full extraction dramatically reduces channelling.", timestamp: "17:30" },
        { text: "Water temperature matters more than most realise: 90°C dark, 94°C light roasts.", timestamp: "24:10" },
        { text: "Calibrate by tasting, not by spec sheet. Most machines vary shot to shot.", timestamp: "31:55" },
      ],
    },
    steps: {
      items: [
        "Set grinder to medium-fine and pull a test shot at your target dose (18g in)",
        "Measure yield: aim for 36g out in 25-30 seconds for a 1:2 ratio",
        "Too fast / sour: grind 1 click finer. Too slow / bitter: grind coarser",
        "Lock in grind, then set water temperature to 93°C and taste",
        "Try pre-infusion at 4 bar for 6 seconds before ramping to full pressure",
        "Change only one variable at a time, taste between each adjustment",
      ],
    },
    triageState: "INBOX",
    tags: ["Coffee", "Espresso", "Technique"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    videoId: "rfscVS0vtbw",
    title: "Learn Python - Full Course for Beginners",
    channel: "freeCodeCamp",
    duration: 15480,
    thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
    transcript: "Demo transcript for Python course...",
    verdict: {
      text: "Skip this if you already know the basics. Worth watching if you are a complete beginner: covers variables, loops, functions and classes in a logical order. Very thorough but slow-paced.",
      tags: ["Python", "Variables", "Functions", "OOP", "Beginner"],
    },
    takeaways: {
      items: [
        { text: "Python uses indentation instead of brackets to define code blocks. This enforces readable code by design.", timestamp: "12:30" },
        { text: "Lists, tuples and dictionaries are the three core data structures. Lists are mutable, tuples are not.", timestamp: "45:00" },
        { text: "Functions should do one thing well. If you cannot describe what it does in one sentence, break it up.", timestamp: "1:22:00" },
        { text: "Classes let you bundle data and behaviour together. Think of them as blueprints for objects.", timestamp: "2:45:00" },
        { text: "Error handling with try/except prevents your program from crashing on unexpected input.", timestamp: "3:30:00" },
      ],
    },
    triageState: "LATER",
    tags: ["Python", "Programming", "Tutorial"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    videoId: "8jLOx1hD3_o",
    title: "How The Economic Machine Works by Ray Dalio",
    channel: "Principles by Ray Dalio",
    duration: 1860,
    thumbnailUrl: "https://img.youtube.com/vi/8jLOx1hD3_o/hqdefault.jpg",
    transcript: "Demo transcript for economics video...",
    verdict: {
      text: "Worth watching for anyone who wants to understand how economies work. Dalio breaks down complex cycles into simple mechanics. Essential viewing, only 30 minutes.",
      tags: ["Economics", "Credit cycles", "Debt", "Monetary policy"],
    },
    triageState: "INBOX",
    tags: ["Economics", "Finance", "Education"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    videoId: "MnrJzXM7a6o",
    title: "How to Speak by Patrick Winston",
    channel: "MIT OpenCourseWare",
    duration: 3960,
    thumbnailUrl: "https://img.youtube.com/vi/MnrJzXM7a6o/hqdefault.jpg",
    transcript: "Demo transcript for speaking lecture...",
    verdict: {
      text: "Worth watching for anyone who presents or teaches. Winston's rules for clear communication are timeless. The first 20 minutes alone will change how you structure talks.",
      tags: ["Public speaking", "Communication", "Presentations", "Teaching"],
    },
    takeaways: {
      items: [
        { text: "Start with a promise: tell the audience what they will know at the end that they do not know now.", timestamp: "1:30" },
        { text: "Cycle on your key ideas. Say it, give an example, say it again differently. People need repetition.", timestamp: "8:15" },
        { text: "Use verbal punctuation: pause, change pace, use silence. Monotone kills attention.", timestamp: "15:40" },
        { text: "The final slide should not say 'Questions?' It should restate your contributions.", timestamp: "52:00" },
        { text: "Never start with a joke. Start with an empowerment promise instead.", timestamp: "3:20" },
      ],
    },
    triageState: "ARCHIVE",
    tags: ["Speaking", "MIT", "Communication"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    videoId: "kYfNvmF0Bqw",
    title: "React in 100 Seconds",
    channel: "Fireship",
    duration: 120,
    thumbnailUrl: "https://img.youtube.com/vi/kYfNvmF0Bqw/hqdefault.jpg",
    transcript: "Demo transcript for React video...",
    verdict: {
      text: "Worth watching as a quick refresher or intro. Fireship packs the core concepts of React into 2 minutes. Great for deciding if you want to dive deeper.",
      tags: ["React", "JavaScript", "Frontend"],
    },
    triageState: "INBOX",
    tags: ["React", "JavaScript", "Quick"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    videoId: "aircAruvnKk",
    title: "Git and GitHub for Beginners - Crash Course",
    channel: "freeCodeCamp",
    duration: 4080,
    thumbnailUrl: "https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg",
    transcript: "Demo transcript for Git course...",
    verdict: {
      text: "Worth watching if Git still confuses you. Covers branching, merging and pull requests with clear diagrams. Slightly slow but very beginner-friendly.",
      tags: ["Git", "GitHub", "Version control", "Branching"],
    },
    steps: {
      items: [
        "Install Git and configure your name and email with git config",
        "Create a new repo with git init or clone an existing one with git clone",
        "Make changes, stage them with git add, commit with git commit -m",
        "Create branches for new features with git checkout -b feature-name",
        "Push to GitHub with git push and create pull requests for review",
        "Merge branches and resolve conflicts when they arise",
      ],
    },
    triageState: "LATER",
    tags: ["Git", "GitHub", "DevOps"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    videoId: "2MsN8gpT6jY",
    title: "The Art of Code - Dylan Beattie",
    channel: "NDC Conferences",
    duration: 3600,
    thumbnailUrl: "https://img.youtube.com/vi/2MsN8gpT6jY/hqdefault.jpg",
    transcript: "Demo transcript for Art of Code talk...",
    verdict: {
      text: "Worth watching purely for entertainment. Beattie covers esoteric programming languages, quines, and the creative side of coding. One of the best conference talks ever recorded.",
      tags: ["Creative coding", "Conference talk", "Entertainment", "History"],
    },
    triageState: "ARCHIVE",
    tags: ["Coding", "Conference", "Fun"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  for (const summary of demoSummaries) {
    addSummaryForUser(userId, { ...summary, userId });
  }

  return NextResponse.json({
    message: `Loaded ${demoSummaries.length} demo summaries`,
    count: demoSummaries.length,
  });
}
