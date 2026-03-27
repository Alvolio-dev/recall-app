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
  featured?: boolean;
}

const features: Feature[] = [
  { id: 1, title: "Worth my time?", subtitle: "A 3-sentence verdict. Decide in 10 seconds whether a video is worth watching.", icon: <Clock className="w-6 h-6" />, featured: true },
  { id: 2, title: "Key takeaways", subtitle: "The 5-7 ideas that matter, with timestamps to jump straight to each moment.", icon: <Star className="w-6 h-6" /> },
  { id: 3, title: "Step by step", subtitle: "A numbered action list you can actually follow. No filler, just what to do.", icon: <ListOrdered className="w-6 h-6" /> },
  { id: 4, title: "Ask follow-ups", subtitle: "Ask anything and Recall answers from the transcript directly.", icon: <MessageSquare className="w-6 h-6" /> },
  { id: 5, title: "Your library", subtitle: "Every summary saved and searchable. Never lose a good idea buried in a tab.", icon: <FolderOpen className="w-6 h-6" /> },
  { id: 6, title: "Weekly digest", subtitle: "Every Sunday, a recap of what you watched and what you learned.", icon: <Mail className="w-6 h-6" /> },
];

export function Features() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">What it does</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-zinc-900">
            One link does <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">a lot.</span>
          </h2>
          <p className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-300">
            Explore every feature.
          </p>
        </motion.div>

        <div className="space-y-3">
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
                  "relative overflow-hidden border bg-white transition-all duration-300 ease-in-out cursor-default rounded-xl",
                  hoveredItem === feature.id
                    ? "h-32 border-emerald-300 shadow-lg shadow-emerald-100/50 bg-emerald-50/30"
                    : "h-20 border-zinc-200 hover:border-zinc-300"
                )}
              >
                {/* Corner brackets on hover */}
                {hoveredItem === feature.id && (
                  <>
                    <div className="absolute top-3 left-3 w-6 h-6">
                      <div className="absolute top-0 left-0 w-4 h-0.5 bg-emerald-500" />
                      <div className="absolute top-0 left-0 w-0.5 h-4 bg-emerald-500" />
                    </div>
                    <div className="absolute bottom-3 right-3 w-6 h-6">
                      <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-emerald-500" />
                      <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-emerald-500" />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between h-full px-6 md:px-8">
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-bold transition-colors duration-300",
                        feature.featured ? "text-xl md:text-2xl" : "text-lg md:text-xl",
                        hoveredItem === feature.id ? "text-emerald-600" : "text-zinc-900"
                      )}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 transition-all duration-300 text-sm",
                        hoveredItem === feature.id
                          ? "text-zinc-600 opacity-100 translate-y-0"
                          : "text-zinc-400 opacity-70"
                      )}
                    >
                      {feature.subtitle}
                    </p>
                  </div>

                  {hoveredItem === feature.id && (
                    <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {feature.icon}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
