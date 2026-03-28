"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, ListOrdered, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors px-2 py-1 rounded-md hover:bg-zinc-100"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-500" />
          <span className="text-emerald-500">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy
        </>
      )}
    </button>
  );
}

interface VerdictData {
  text: string;
  tags: string[];
}

interface TakeawayItem {
  text: string;
  timestamp: string;
}

interface TakeawaysData {
  items: TakeawayItem[];
}

interface StepsData {
  items: string[];
}

export function VerdictOutput({ data }: { data: VerdictData }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-emerald-600" />
          </div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">
            Verdict
          </p>
        </div>
        <CopyButton text={`${data.text}\n\nCovers: ${data.tags.join(", ")}`} />
      </div>
      <p className="text-[15px] text-zinc-800 leading-relaxed mb-5">
        {data.text}
      </p>
      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-5 border-t border-zinc-100 items-center">
          <span className="text-[11px] font-medium text-zinc-400 mr-0.5 uppercase tracking-wider">
            Covers
          </span>
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 font-medium border border-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function TakeawaysOutput({ data }: { data: TakeawaysData }) {
  const [current, setCurrent] = useState(0);
  const item = data.items[current];

  if (!item) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
            <Star className="w-3 h-3 text-violet-600" />
          </div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">
            Key idea {current + 1} of {data.items.length}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <CopyButton text={data.items.map((item, i) => `${i + 1}. ${item.text} (${item.timestamp})`).join("\n")} />
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            aria-label="Previous takeaway"
            className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() =>
              setCurrent((c) => Math.min(data.items.length - 1, c + 1))
            }
            disabled={current === data.items.length - 1}
            aria-label="Next takeaway"
            className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
        >
          <p className="text-[15px] text-zinc-800 leading-relaxed">
            {item.text}{" "}
            <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 align-middle">
              {item.timestamp}
            </span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function StepsOutput({ data }: { data: StepsData }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
            <ListOrdered className="w-3 h-3 text-orange-600" />
          </div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">
            Action list
          </p>
        </div>
        <CopyButton text={data.items.map((step, i) => `${i + 1}. ${step}`).join("\n")} />
      </div>
      <div className="space-y-2">
        {data.items.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50 px-3.5 py-3 group hover:border-orange-200 hover:bg-orange-50/30 transition-colors"
          >
            <div className="w-5 h-5 rounded-md border-2 border-zinc-300 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-orange-400 transition-colors">
              <span className="text-[9px] font-bold text-zinc-400 group-hover:text-orange-500 transition-colors">
                {i + 1}
              </span>
            </div>
            <p className="text-[13px] text-zinc-700 leading-relaxed">{step}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface SummaryPanelProps {
  mode: "verdict" | "takeaways" | "steps";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const panelColors = {
  verdict: "border-emerald-200 bg-emerald-50/30 border-l-4 border-l-emerald-400",
  takeaways: "border-violet-200 bg-violet-50/30 border-l-4 border-l-violet-400",
  steps: "border-orange-200 bg-orange-50/30 border-l-4 border-l-orange-400",
};

export function SummaryPanel({ mode, data }: SummaryPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6 transition-colors duration-300",
        panelColors[mode]
      )}
    >
      {mode === "verdict" && <VerdictOutput data={data as VerdictData} />}
      {mode === "takeaways" && (
        <TakeawaysOutput data={data as TakeawaysData} />
      )}
      {mode === "steps" && <StepsOutput data={data as StepsData} />}
    </div>
  );
}
