"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverButton } from "@/components/ui/hover-button";

const freeFeatures = [
  { text: "Unlimited summaries", included: true },
  { text: "All 3 modes", included: true },
  { text: "2 follow-up questions per video", included: true },
  { text: "Saved library", included: false },
  { text: "Weekly digest email", included: false },
  { text: "Export to Markdown / Notion", included: false },
  { text: "Cross-video topic synthesis", included: false },
];

const proFeatures = [
  "Everything in Free",
  "Saved library across sessions",
  "Unlimited follow-up questions",
  "Weekly \"what I learned\" digest",
  "Export to Markdown / Notion",
  "Cross-video topic synthesis",
  "Priority support",
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900">Free to start. <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">Pro to grow.</span></h2>
          <p className="text-zinc-500 text-lg font-light mb-8">No credit card required. Upgrade when you&apos;re ready.</p>

          <div className="relative inline-flex items-center bg-white border border-zinc-200 rounded-full p-1 shadow-sm">
            {/* Sliding indicator */}
            <div
              className={cn(
                "absolute top-1 bottom-1 rounded-full bg-emerald-600 transition-all duration-300 ease-out",
                yearly ? "left-[calc(50%)] right-1" : "left-1 right-[calc(50%)]"
              )}
            />
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "relative z-10 px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                !yearly ? "text-white" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "relative z-10 px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                yearly ? "text-white" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              Yearly
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors duration-300",
                yearly ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"
              )}>
                -35%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#fafafa]/80 border border-zinc-200 rounded-2xl p-7"
          >
            <p className="text-base font-medium mb-1 text-zinc-900">Free</p>
            <p className="text-sm text-zinc-500 mb-5">No account needed to start.</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-bold tracking-tight text-zinc-900">$0</span>
              <span className="text-sm text-zinc-400">forever</span>
            </div>
            <div className="h-5 mb-5" />
            <button className="w-full py-3 rounded-xl text-sm font-medium bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              Start summarising
            </button>
            <div className="space-y-3">
              {freeFeatures.map((f) => (
                <div key={f.text} className="flex items-start gap-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    f.included ? "bg-emerald-50" : "bg-zinc-100"
                  )}>
                    {f.included && <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3} />}
                  </div>
                  <span className={cn("text-sm", f.included ? "text-zinc-600" : "text-zinc-300")}>{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl p-7 text-zinc-900 overflow-hidden shadow-lg border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white"
          >
            <div className="absolute -top-px left-1/2 -translate-x-1/2">
              <span className="bg-emerald-600 text-white text-xs font-medium px-4 py-1.5 rounded-b-xl">Most popular</span>
            </div>
            <p className="text-base font-medium mb-1 text-zinc-900">Pro</p>
            <p className="text-sm text-zinc-500 mb-5">For people who want to retain what they learn.</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-bold tracking-tight text-zinc-900">${yearly ? "3" : "5"}</span>
              <span className="text-sm text-zinc-500">/mo</span>
            </div>
            <p className="text-xs text-zinc-500 mb-5 h-5">
              {yearly ? "Billed $39/year" : "or $39/year, save 35%"}
            </p>
            <HoverButton
              className="w-full py-3 text-sm mb-2"
              backgroundColor="#059669"
              glowColor="#6ee7b7"
              hoverTextColor="#d1fae5"
            >
              Get Pro
            </HoverButton>
            <p className="text-xs text-zinc-400 text-center mb-6">7-day free trial · Cancel anytime</p>
            <div className="space-y-3">
              {proFeatures.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-zinc-600">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
