"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { CountUp } from "@/components/ui/count-up";

const RotatingEarth = dynamic(() => import("@/components/ui/rotating-earth"), { ssr: false });

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
              <div>
                <p className="text-2xl font-bold text-zinc-900"><CountUp end={48} suffix="K+" /></p>
                <p className="text-xs text-zinc-400 mt-0.5">summaries created</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900"><CountUp end={120} suffix="+" /></p>
                <p className="text-xs text-zinc-400 mt-0.5">countries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900"><CountUp end={26} /></p>
                <p className="text-xs text-zinc-400 mt-0.5">languages supported</p>
              </div>
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
