"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { HoverButton } from "@/components/ui/hover-button";
import { MiniRing } from "@/components/ui/mini-ring";

const themes = [
  { name: "Espresso technique", count: "5 videos", color: "bg-emerald-500", hoverBg: "hover:bg-emerald-50", hoverBorder: "hover:border-emerald-200", text: "Grind size and pre-infusion came up in all five. Consensus: slow the beginning of the shot." },
  { name: "Running form", count: "3 videos", color: "bg-violet-500", hoverBg: "hover:bg-violet-50", hoverBorder: "hover:border-violet-200", text: "All three agreed on cadence (170–180 spm). Still divided on heel striking." },
  { name: "Sourdough", count: "2 videos", color: "bg-orange-500", hoverBg: "hover:bg-orange-50", hoverBorder: "hover:border-orange-200", text: "Cold proofing vs room temp still unresolved — worth one more video." },
];

export function Digest() {
  return (
    <section className="relative py-24 px-6 border-t border-zinc-200/60">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">Pro feature</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 text-zinc-900">
              Your week in<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">knowledge.</span>
            </h2>
            <p className="text-zinc-500 text-base font-light leading-relaxed mb-4">
              Every Sunday, Recall sends a digest of everything you watched — not just a list, but a narrative. What themes kept coming up. What ideas connected. What&apos;s still unanswered.
            </p>
            <p className="text-zinc-500 text-base font-light leading-relaxed mb-6">
              It&apos;s the feature that turns Recall from a useful tool into a thinking partner.
            </p>
            <HoverButton
              className="px-6 py-3 text-sm"
              backgroundColor="#059669"
              glowColor="#6ee7b7"
              hoverTextColor="#d1fae5"
            >
              Get Pro — $5/month
            </HoverButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <GlowCard glowColor="green" className="shadow-lg">
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-zinc-100">
                <div>
                  <p className="text-xs font-medium tracking-[0.1em] uppercase text-zinc-400 mb-1.5">Week of 21–27 March</p>
                  <p className="text-lg font-semibold text-zinc-900">
                    What you <span className="text-emerald-600 italic">learned</span> this week
                  </p>
                </div>
                <span className="text-xs text-zinc-400 mt-1 bg-zinc-100 px-2.5 py-1 rounded-lg font-medium">Sunday digest</span>
              </div>

              <div className="flex justify-around mb-5 py-2">
                <MiniRing value={11} max={15} label="videos" display="11" color="#10b981" gradientTo="#34d399" />
                <MiniRing value={6} max={8} label="saved" display="6h" color="#8b5cf6" gradientTo="#a78bfa" />
                <MiniRing value={3} max={5} label="themes" display="3" color="#f97316" gradientTo="#fb923c" />
              </div>

              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                You watched a lot of espresso content this week — five videos ranging from extraction theory to grinder comparisons. The common thread: why shots taste inconsistent.
              </p>

              <div className="space-y-2">
                {themes.map((theme) => (
                  <div
                    key={theme.name}
                    className={`bg-[#fafafa] border-2 border-zinc-100 rounded-xl p-3.5 transition-all duration-200 cursor-default ${theme.hoverBg} ${theme.hoverBorder} hover:translate-x-1`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${theme.color}`} aria-hidden="true" />
                      <span className="text-sm font-semibold text-zinc-900 flex-1">{theme.name}</span>
                      <span className="text-xs text-zinc-400 font-medium bg-white px-2 py-0.5 rounded-md border border-zinc-100">{theme.count}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed pl-5">{theme.text}</p>
                  </div>
                ))}
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
