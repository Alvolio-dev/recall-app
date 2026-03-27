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
        <strong className="text-zinc-900 font-semibold">Worth watching</strong>{" "}if you&apos;re getting into espresso and want to understand extraction: the first 20 minutes are excellent. Skip the second half if you already own a decent grinder.
      </p>
      <div className="flex flex-wrap gap-1.5 pt-5 border-t border-zinc-100 items-center">
        <span className="text-[11px] font-medium text-zinc-400 mr-0.5 uppercase tracking-wider">Covers</span>
        {["Grind size", "Dose & yield", "Extraction theory", "Pre-infusion"].map((tag) => (
          <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 font-medium border border-zinc-200">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TakeawaysOutput() {
  const [current, setCurrent] = useState(0);
  const items = [
    { n: 1, text: "Grind size is the single highest-leverage variable. A 1-click adjustment changes everything downstream.", ts: "3:12" },
    { n: 2, text: "Dose and yield form a ratio. 1:2 is standard; lighter roasts often need 1:2.5 or more.", ts: "8:45" },
    { n: 3, text: "Pre-infusion at low pressure before full extraction dramatically reduces channelling.", ts: "17:30" },
    { n: 4, text: "Water temperature matters more than most realise: 90°C dark, 94°C light roasts.", ts: "24:10" },
    { n: 5, text: "Calibrate by tasting, not by spec sheet. Most machines vary shot to shot.", ts: "31:55" },
  ];

  const item = items[current];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
            <Star className="w-3 h-3 text-violet-600" />
          </div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">5 key ideas</p>
        </div>
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-200",
                i === current ? "bg-zinc-900 w-4" : "bg-zinc-300 hover:bg-zinc-400"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex gap-3"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-zinc-600">{item.n}</span>
          </div>
          <p className="text-[15px] text-zinc-800 leading-relaxed">
            {item.text}{" "}
            <button className="inline-flex items-center text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 hover:bg-emerald-100 transition-colors align-middle">{item.ts}</button>
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mt-5 pt-4 border-t border-zinc-100">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex-1 py-2 rounded-lg text-xs font-medium border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrent((c) => Math.min(items.length - 1, c + 1))}
          disabled={current === items.length - 1}
          className="flex-1 py-2 rounded-lg text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function StepsOutput() {
  const steps = [
    "Set grinder to medium-fine and pull a test shot at your target dose (18g in)",
    "Measure yield: aim for 36g out in 25–30 seconds for a 1:2 ratio",
    "Too fast / sour: grind 1 click finer. Too slow / bitter: grind coarser",
    "Lock in grind, then set water temperature to 93°C and taste",
    "Try pre-infusion at 4 bar for 6 seconds before ramping to full pressure",
    "Change only one variable at a time, taste between each adjustment",
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
      <div className="max-w-3xl mx-auto">
        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900">
            Same video.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">Three outputs.</span>
          </h2>
          <p className="text-zinc-500 text-base font-light leading-relaxed max-w-lg mx-auto">
            Pick a mode and get a summary shaped around what you actually need — a quick verdict, the key ideas, or a step-by-step action list.
          </p>
        </motion.div>

        {/* Demo — app frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden"
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-100 bg-zinc-50/80">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-zinc-100 text-xs text-zinc-400">
                <span>getrecall.app</span>
              </div>
            </div>
            <div className="w-[46px]" />
          </div>

          {/* App content */}
          <div className="p-6 md:p-8 space-y-4">
            {/* Video meta */}
            <div className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
              <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-red-200" aria-hidden="true">
                <Play className="w-3 h-3 fill-white text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">The Ultimate Espresso Technique Guide</p>
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
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
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
              "bg-white border rounded-xl p-6 md:p-7 min-h-[260px] transition-colors duration-300",
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
              <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:border-emerald-300 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.08)] transition-all">
                <div className="pl-4 text-zinc-300" aria-hidden="true">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <input
                  id="demo-followup"
                  type="text"
                  placeholder="Ask a follow-up, e.g. what grinder does he recommend?"
                  className="flex-1 min-w-0 bg-transparent px-3 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
                />
                <button
                  className="m-1.5 w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  aria-label="Send follow-up question"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
            <p className="text-xs text-zinc-400 text-center pt-1">Free: 2 follow-ups per video · Pro: unlimited</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
