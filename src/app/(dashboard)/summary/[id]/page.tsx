"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Star,
  ListOrdered,
  Inbox,
  BookmarkCheck,
  Archive,
  Download,
  Trash2,
  Loader2,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SummaryPanel } from "@/components/dashboard/summary-output";
import { FollowUpChat } from "@/components/dashboard/follow-up-chat";
import { formatDuration } from "@/lib/youtube";
import Link from "next/link";

type Mode = "verdict" | "takeaways" | "steps";

const modes = [
  { id: "verdict" as Mode, label: "Worth my time?", icon: Clock, color: "emerald" },
  { id: "takeaways" as Mode, label: "Key takeaways", icon: Star, color: "violet" },
  { id: "steps" as Mode, label: "Step by step", icon: ListOrdered, color: "orange" },
];

const modeTabColors: Record<string, string> = {
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100",
  violet: "bg-zinc-900 border-zinc-900 text-white shadow-sm",
  orange: "bg-orange-50 border-orange-200 text-orange-700 shadow-sm shadow-orange-100",
};

const triageActions = [
  { id: "INBOX", label: "Inbox", icon: Inbox },
  { id: "LATER", label: "Later", icon: BookmarkCheck },
  { id: "ARCHIVE", label: "Archive", icon: Archive },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SummaryData = Record<string, any>;

export default function SummaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<Mode>("verdict");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch(`/api/summaries/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setSummary(data);
        // Set initial mode to first available
        if (data.verdict) setActiveMode("verdict");
        else if (data.takeaways) setActiveMode("takeaways");
        else if (data.steps) setActiveMode("steps");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  const updateSummary = async (updates: Partial<SummaryData>) => {
    if (!summary) return;
    const res = await fetch(`/api/summaries/${summary.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setSummary(updated);
    }
  };

  const handleExport = async () => {
    if (!summary) return;
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: summary.title,
          channel: summary.channel,
          duration: summary.duration,
          verdict: summary.verdict,
          takeaways: summary.takeaways,
          steps: summary.steps,
        }),
      });
      const data = await res.json();
      if (data.markdown) {
        const blob = new Blob([data.markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${summary.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 50)}.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!summary) return;
    await fetch(`/api/summaries/${summary.id}`, { method: "DELETE" });
    router.push("/library");
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="max-w-3xl mx-auto text-center py-24">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Summary not found</h2>
        <Link href="/library" className="text-sm text-emerald-600 hover:underline">
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/library"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Library
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSummary({ isFavorite: !summary.isFavorite })}
            className={cn(
              "p-2 rounded-lg border transition-colors",
              summary.isFavorite
                ? "border-red-200 text-red-500 bg-red-50"
                : "border-zinc-200 text-zinc-400 hover:text-zinc-700"
            )}
          >
            <Heart className={cn("w-4 h-4", summary.isFavorite && "fill-current")} />
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-700 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video meta */}
      <div className="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-xl mb-4">
        <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
          <img
            src={summary.thumbnailUrl}
            alt={summary.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-zinc-900 line-clamp-2">
            {summary.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {summary.channel}
            {summary.duration > 0 && ` · ${formatDuration(summary.duration)}`}
          </p>
        </div>
      </div>

      {/* Triage state */}
      <div className="flex gap-2 mb-4">
        {triageActions.map((action) => (
          <button
            key={action.id}
            onClick={() => updateSummary({ triageState: action.id })}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              summary.triageState === action.id
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-zinc-200 text-zinc-400 hover:text-zinc-700"
            )}
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-4">
        {modes.map((mode) => {
          const hasData = !!summary[mode.id];
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              disabled={!hasData}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200",
                activeMode === mode.id && hasData
                  ? modeTabColors[mode.color]
                  : hasData
                    ? "bg-white border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300"
                    : "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed"
              )}
            >
              <mode.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary output */}
      <AnimatePresence mode="wait">
        {summary[activeMode] && (
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <SummaryPanel mode={activeMode} data={summary[activeMode]} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow-up chat */}
      {summary.transcript && (
        <FollowUpChat
          transcript={summary.transcript}
          title={summary.title}
          channel={summary.channel}
        />
      )}
    </div>
  );
}
