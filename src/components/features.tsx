"use client";

import { motion } from "framer-motion";
import { Clock, Star, ListOrdered, MessageSquare, FolderOpen, Mail } from "lucide-react";
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";

const features: BentoItem[] = [
  {
    icon: <Clock className="w-4 h-4 text-emerald-600" />,
    title: "Worth my time?",
    description: "A 3-sentence verdict. What the video covers, who it's for, whether it delivers. Decide in 10 seconds.",
    status: "Popular",
    tags: ["Quick", "Verdict"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    icon: <Star className="w-4 h-4 text-violet-600" />,
    title: "Key takeaways",
    description: "The 5-7 ideas that matter, with timestamps so you can jump straight to the moment it's discussed.",
    tags: ["Timestamps", "Ideas"],
  },
  {
    icon: <ListOrdered className="w-4 h-4 text-orange-600" />,
    title: "Step by step",
    description: "A numbered action list you can actually follow. No filler, no preamble. Just what to do and in what order.",
    status: "New",
    tags: ["Actions", "How-to"],
  },
  {
    icon: <MessageSquare className="w-4 h-4 text-emerald-600" />,
    title: "Ask follow-ups",
    description: "Not sure about something? Ask anything and Recall answers from the transcript directly.",
    tags: ["Chat", "Q&A"],
    colSpan: 2,
  },
  {
    icon: <FolderOpen className="w-4 h-4 text-violet-600" />,
    title: "Your library",
    description: "Every summary you've created, saved and searchable. Never lose a good idea buried in a tab.",
    tags: ["Search", "History"],
  },
  {
    icon: <Mail className="w-4 h-4 text-orange-600" />,
    title: "Weekly digest",
    description: "Every Sunday, a recap of what you watched and what you learned. Your knowledge, made visible.",
    status: "Pro",
    tags: ["Email", "Insights"],
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 px-6 border-t border-zinc-200/60 bg-white/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">What it does</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900">
            Three modes. <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">One link.</span>
          </h2>
          <p className="text-zinc-500 text-lg font-light max-w-md mx-auto">
            Three ways to summarise. Plus the tools to build on what you learn.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <BentoGrid items={features} />
        </motion.div>
      </div>
    </section>
  );
}
