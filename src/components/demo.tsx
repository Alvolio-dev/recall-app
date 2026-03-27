"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Star, ListOrdered, ArrowRight, Play, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const modes = [
  { id: "v", label: "Worth my time?", icon: Clock, color: "emerald" },
  { id: "t", label: "Key takeaways", icon: Star, color: "violet" },
  { id: "s", label: "Step by step", icon: ListOrdered, color: "orange" },
] as const;

const colorMap = {
  emerald: {
    tab: "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100",
    panel: "border-zinc-200",
  },
  violet: {
    tab: "bg-zinc-900 border-zinc-900 text-white shadow-sm",
    panel: "border-zinc-200",
  },
  orange: {
    tab: "bg-orange-50 border-orange-200 text-orange-700 shadow-sm shadow-orange-100",
    panel: "border-zinc-200",
  },
};

function VerdictOutput() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-emerald-600" />
        </div>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">Verdict</p>
      </div>
      <p className="text-[15px] text-zinc-800 leading-relaxed mb-5">
        <strong className="text-zinc-900 font-semibold">Worth watching</strong> if you&apos;re getting into espresso and want to understand extraction — the first 20 minutes are excellent. Skip the second half if you already own a decent grinder.
      </p>
      <div className="flex flex-wrap gap-2 pt-5 border-t border-zinc-100 items-center">
        <span className="text-xs font-medium text-zinc-400 mr-1">Covers</span>
        {["Grind size", "Dose & yield", "Extraction theory", "Pre-infusion"].map((tag) => (
          <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TakeawaysOutput() {
  const items = [
    { n: 1, text: "Grind size is the single highest-leverage variable. A 1-click adjustment changes everything downstream.", ts: "3:12" },
    { n: 2, text: "Dose and yield form a ratio. 1:2 is standard; lighter roasts often need 1:2.5 or more.", ts: "8:45" },
    { n: 3, text: "Pre-infusion at low pressure before full extraction dramatically reduces channelling.", ts: "17:30" },
    { n: 4, text: "Water temperature matters more than most realise — 90°C dark, 94°C light roasts.", ts: "24:10" },
    { n: 5, text: "Calibrate by tasting, not by spec sheet. Most machines vary shot to shot.", ts: "31:55" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
          <Star className="w-3 h-3 text-violet-600" />
        </div>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">5 key ideas</p>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.n}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="flex gap-3 group"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
              <span className="text-xs font-bold text-zinc-600">{item.n}</span>
            </div>
            <div>
              <p className="text-[15px] text-zinc-800 leading-relaxed">{item.text}</p>
              <button className="text-xs text-emerald-600 font-medium mt-1.5 hover:text-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-0.5 -ml-2 hover:bg-emerald-50">→ {item.ts}</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StepsOutput() {
  const steps = [
    "Set grinder to medium-fine and pull a test shot at your target dose (18g in)",
    "Measure yield — aim for 36g out in 25–30 seconds for a 1:2 ratio",
    "Too fast / sour: grind 1 click finer. Too slow / bitter: grind coarser",
    "Lock in grind, then set water temperature to 93°C and taste",
    "Try pre-infusion at 4 bar for 6 seconds before ramping to full pressure",
    "Change only one variable at a time — taste between each adjustment",
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
          <ListOrdered className="w-3 h-3 text-orange-600" />
        </div>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">Action list</p>
      </div>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex gap-3 group"
          >
            <div className="w-6 h-6 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
              <span className="text-[10px] font-bold text-zinc-600">{i + 1}</span>
            </div>
            <p className="text-[15px] text-zinc-800 leading-relaxed">{step}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const outputs: Record<string, React.ReactNode> = {
  v: <VerdictOutput />,
  t: <TakeawaysOutput />,
  s: <StepsOutput />,
};

export function Demo() {
  const [activeMode, setActiveMode] = useState<"v" | "t" | "s">("v");
  const activeColor = modes.find(m => m.id === activeMode)!.color;

  return (
    <section id="demo" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">See it in action</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900">
            Same video.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">Three different outputs.</span>
          </h2>
          <p className="text-zinc-500 text-base font-light leading-relaxed mb-4">
            Switch between modes to see how the same video becomes a different kind of summary.
          </p>
          <p className="text-zinc-500 text-base font-light leading-relaxed">
            Whether you need a quick verdict, the key ideas with timestamps, or a step-by-step action list — Recall adapts to how you learn.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          {/* Video meta */}
          <div className="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <div className="w-14 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-red-200" aria-hidden="true">
              <Play className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">The Ultimate Espresso Technique Guide</p>
              <p className="text-xs text-zinc-400 mt-0.5">James Hoffmann · 41 minutes</p>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-2" role="tablist">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                role="tab"
                aria-selected={activeMode === mode.id}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                  activeMode === mode.id
                    ? colorMap[mode.color].tab
                    : "bg-white border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300"
                )}
              >
                <mode.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Output panel */}
          <div className={cn(
            "bg-white border-2 rounded-2xl p-7 min-h-[280px] shadow-sm transition-colors duration-300",
            colorMap[activeColor].panel
          )} role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {outputs[activeMode]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Follow-up input */}
          <div className="relative">
            <label htmlFor="demo-followup" className="sr-only">Ask a follow-up question</label>
            <div className="flex items-center bg-white border-2 border-zinc-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-emerald-300 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] transition-all">
              <div className="pl-4 text-zinc-300" aria-hidden="true">
                <MessageSquare className="w-4 h-4" />
              </div>
              <input
                id="demo-followup"
                type="text"
                placeholder="Ask a follow-up — e.g. what grinder does he recommend?"
                className="flex-1 min-w-0 bg-transparent px-3 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
              />
              <button
                className="m-2 w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                aria-label="Send follow-up question"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-400 text-center">Free: 2 follow-ups per video · Pro: unlimited</p>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
