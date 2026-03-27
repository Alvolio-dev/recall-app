"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const RotatingEarth = dynamic(() => import("@/components/ui/rotating-earth"), { ssr: false });

const stats = [
  { value: "48K+", label: "summaries created" },
  { value: "120+", label: "countries" },
  { value: "26", label: "languages supported" },
];

export function GlobeSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">Global</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 text-zinc-900">
              Knowledge has no<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">borders.</span>
            </h2>
            <p className="text-zinc-500 text-base font-light leading-relaxed mb-6">
              Recall works with YouTube videos in any language. Creators, students, and researchers from over 120 countries use it to turn hours of content into minutes of insight.
            </p>

            <div className="flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <RotatingEarth width={450} height={450} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
