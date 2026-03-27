"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock, Star, ListOrdered, MessageSquare, FolderOpen, Mail } from "lucide-react";

interface Feature {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  { id: 1, title: "Worth my time?", subtitle: "A 3-sentence verdict. Decide in 10 seconds whether a video is worth watching.", icon: <Clock className="w-5 h-5" /> },
  { id: 2, title: "Key takeaways", subtitle: "The 5-7 ideas that matter, with timestamps to jump straight to each moment.", icon: <Star className="w-5 h-5" /> },
  { id: 3, title: "Step by step", subtitle: "A numbered action list you can actually follow. No filler, just what to do.", icon: <ListOrdered className="w-5 h-5" /> },
  { id: 4, title: "Ask follow-ups", subtitle: "Ask anything and Recall answers from the transcript directly.", icon: <MessageSquare className="w-5 h-5" /> },
  { id: 5, title: "Your library", subtitle: "Every summary saved and searchable. Never lose a good idea buried in a tab.", icon: <FolderOpen className="w-5 h-5" /> },
  { id: 6, title: "Weekly digest", subtitle: "Every Sunday, a recap of what you watched and what you learned.", icon: <Mail className="w-5 h-5" /> },
];

export function Features() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section id="features" className="relative pt-12 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-zinc-900">
            One link <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">does a lot.</span>
          </h2>
          <p className="text-zinc-500 text-lg font-light max-w-md mx-auto">
            Summaries, takeaways, follow-ups, and more, all from one YouTube link.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative group"
              onMouseEnter={() => setHoveredItem(feature.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className={cn(
                  "relative overflow-hidden border bg-white transition-all duration-300 ease-in-out cursor-default rounded-2xl p-6 h-full",
                  hoveredItem === feature.id
                    ? "border-emerald-300 shadow-lg shadow-emerald-100/50 bg-emerald-50/20 -translate-y-1"
                    : "border-zinc-200 hover:border-zinc-300"
                )}
              >
                {/* Corner brackets on hover */}
                {hoveredItem === feature.id && (
                  <>
                    <div className="absolute top-3 left-3 w-5 h-5">
                      <div className="absolute top-0 left-0 w-3.5 h-0.5 bg-emerald-500" />
                      <div className="absolute top-0 left-0 w-0.5 h-3.5 bg-emerald-500" />
                    </div>
                    <div className="absolute bottom-3 right-3 w-5 h-5">
                      <div className="absolute bottom-0 right-0 w-3.5 h-0.5 bg-emerald-500" />
                      <div className="absolute bottom-0 right-0 w-0.5 h-3.5 bg-emerald-500" />
                    </div>
                  </>
                )}

                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
                  hoveredItem === feature.id
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-zinc-100 text-zinc-500"
                )}>
                  {feature.icon}
                </div>

                <h3 className={cn(
                  "font-semibold text-base mb-2 transition-colors duration-300",
                  hoveredItem === feature.id ? "text-emerald-600" : "text-zinc-900"
                )}>
                  {feature.title}
                </h3>

                <p className="text-sm text-zinc-500 leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
