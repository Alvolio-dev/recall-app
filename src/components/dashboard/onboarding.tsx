"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, Link2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  check: () => boolean;
}

export function Onboarding({ summaryCount }: { summaryCount: number }) {
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem("recall-onboarding-dismissed");
    if (wasDismissed) setDismissed(true);
    setLoaded(true);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem("recall-onboarding-dismissed", "true");
  };

  const steps: OnboardingStep[] = [
    {
      id: "first-summary",
      label: "Create your first summary",
      description: "Paste a YouTube URL and see the magic",
      icon: Link2,
      href: "/new",
      check: () => summaryCount >= 1,
    },
    {
      id: "try-modes",
      label: "Try all 3 modes",
      description: "Verdict, takeaways and step-by-step",
      icon: Sparkles,
      href: "/new",
      check: () => summaryCount >= 2,
    },
    {
      id: "ask-followup",
      label: "Ask a follow-up question",
      description: "Chat with the AI about any video",
      icon: MessageSquare,
      href: summaryCount > 0 ? "/library" : "/new",
      check: () => summaryCount >= 3,
    },
  ];

  const completedCount = steps.filter((s) => s.check()).length;
  const allComplete = completedCount === steps.length;

  if (!loaded || dismissed || allComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="rounded-2xl bg-white card-shadow p-5 mb-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Getting started
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {completedCount} of {steps.length} complete
            </p>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            aria-label="Dismiss onboarding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-zinc-100 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(completedCount / steps.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="space-y-2">
          {steps.map((step) => {
            const done = step.check();
            return (
              <Link key={step.id} href={step.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                    done
                      ? "bg-emerald-50/50"
                      : "hover:bg-zinc-50 cursor-pointer"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      done
                        ? "bg-emerald-500"
                        : "border-2 border-zinc-200"
                    )}
                  >
                    {done && (
                      <Check
                        className="w-3 h-3 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        done
                          ? "text-zinc-400 line-through"
                          : "text-zinc-900"
                      )}
                    >
                      {step.label}
                    </p>
                    {!done && (
                      <p className="text-xs text-zinc-400">
                        {step.description}
                      </p>
                    )}
                  </div>
                  {!done && (
                    <span className="text-xs text-emerald-600 font-medium flex-shrink-0">
                      Start →
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
