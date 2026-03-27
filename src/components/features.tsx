"use client";

import { motion } from "framer-motion";
import { Clock, Star, ListOrdered, MessageSquare, FolderOpen, Mail } from "lucide-react";

const mainFeatures = [
  {
    icon: Clock,
    title: "Worth my time?",
    description: "A 3-sentence verdict. What the video covers, who it's for, whether it delivers. Decide in 10 seconds.",
    badge: "Popular",
    color: "emerald",
    example: '"Worth watching if you\'re into espresso — first 20 min are gold. Skip the grinder section if you already own one."',
  },
  {
    icon: Star,
    title: "Key takeaways",
    description: "The 5-7 ideas that matter, with timestamps so you can jump straight to the moment it's discussed.",
    color: "violet",
    example: '"1. Grind size is the single highest-leverage variable → 3:12"',
  },
  {
    icon: ListOrdered,
    title: "Step by step",
    description: "A numbered action list you can actually follow. No filler, no preamble. Just what to do and in what order.",
    badge: "New",
    color: "orange",
    example: '"1. Set grinder to medium-fine  2. Pull test shot at 18g  3. Measure yield..."',
  },
];

const secondaryFeatures = [
  { icon: MessageSquare, title: "Ask follow-ups", description: "Ask anything — Recall answers from the transcript." },
  { icon: FolderOpen, title: "Your library", description: "Every summary saved and searchable." },
  { icon: Mail, title: "Weekly digest", description: "A Sunday recap of what you learned.", badge: "Pro" },
];

const colorStyles = {
  emerald: {
    icon: "bg-emerald-50 border-emerald-200 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accent: "text-emerald-600",
    glow: "group-hover:shadow-emerald-100",
  },
  violet: {
    icon: "bg-violet-50 border-violet-200 text-violet-600",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    accent: "text-violet-600",
    glow: "group-hover:shadow-violet-100",
  },
  orange: {
    icon: "bg-orange-50 border-orange-200 text-orange-600",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    accent: "text-orange-600",
    glow: "group-hover:shadow-orange-100",
  },
};

export function Features() {
  return (
    <section id="features" className="relative py-24 px-6">
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
            One link does <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">a lot.</span>
          </h2>
          <p className="text-zinc-500 text-lg font-light max-w-md mx-auto">
            Summaries, takeaways, follow-ups, and more — all from one YouTube link.
          </p>
        </motion.div>

        {/* Primary features — 3 tall cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {mainFeatures.map((feature, i) => {
            const styles = colorStyles[feature.color as keyof typeof colorStyles];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative bg-white border border-zinc-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg ${styles.glow} transition-all duration-300`}
              >
                {feature.badge && (
                  <span className={`absolute top-5 right-5 text-[10px] font-medium px-2.5 py-1 rounded-full border ${styles.badge}`}>
                    {feature.badge}
                  </span>
                )}

                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${styles.icon} transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-5">{feature.description}</p>

                {/* Example output preview */}
                <div className="mt-auto pt-4 border-t border-zinc-100">
                  <p className="text-xs text-zinc-400 mb-2 font-medium">Example output</p>
                  <p className={`text-xs ${styles.accent} leading-relaxed italic`}>{feature.example}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary features — 3 compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {secondaryFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="group flex items-start gap-3 bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <feature.icon className="w-4 h-4 text-zinc-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-900 mb-0.5">
                  {feature.title}
                  {feature.badge && (
                    <span className="ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700">{feature.badge}</span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
