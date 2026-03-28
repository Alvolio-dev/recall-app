"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "fetching" | "analysing" | "generating" | "done";

const steps = [
  { id: "fetching" as Step, label: "Fetching video" },
  { id: "analysing" as Step, label: "Reading transcript" },
  { id: "generating" as Step, label: "Generating summary" },
];

function getStepIndex(step: Step): number {
  if (step === "done") return 3;
  return steps.findIndex((s) => s.id === step);
}

export function GenerationProgress({ step }: { step: Step }) {
  const currentIndex = getStepIndex(step);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white card-shadow p-8"
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-zinc-700">
          {step === "done" ? "Done" : steps[currentIndex]?.label}...
        </p>
      </div>

      <div className="flex items-center gap-2 max-w-xs mx-auto">
        {steps.map((s, i) => {
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                  isComplete
                    ? "bg-emerald-500"
                    : isCurrent
                      ? "bg-emerald-100 border-2 border-emerald-500"
                      : "bg-zinc-100"
                )}
              >
                {isComplete ? (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-zinc-300" />
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-colors duration-500",
                    isComplete ? "bg-emerald-500" : "bg-zinc-100"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between max-w-xs mx-auto mt-2">
        {steps.map((s, i) => (
          <p
            key={s.id}
            className={cn(
              "text-[10px] transition-colors",
              i <= currentIndex ? "text-zinc-600" : "text-zinc-300"
            )}
          >
            {s.label}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
