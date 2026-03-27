"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Clock, Star, ListOrdered, Loader2, Play, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SummaryPanel } from "@/components/dashboard/summary-output";
import { formatDuration } from "@/lib/youtube";

type Mode = "verdict" | "takeaways" | "steps";

const modes = [
  { id: "verdict" as Mode, label: "Worth my time?", icon: Clock, color: "emerald" },
  { id: "takeaways" as Mode, label: "Key takeaways", icon: Star, color: "violet" },
  { id: "steps" as Mode, label: "Step by step", icon: ListOrdered, color: "orange" },
];

const modeTabColors = {
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100",
  violet: "bg-zinc-900 border-zinc-900 text-white shadow-sm",
  orange: "bg-orange-50 border-orange-200 text-orange-700 shadow-sm shadow-orange-100",
};

interface VideoMeta {
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  thumbnailUrl: string;
}

export default function NewSummaryPage() {
  const [url, setUrl] = useState("");
  const [activeMode, setActiveMode] = useState<Mode>("verdict");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<Record<string, any>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  const saveToLibrary = async (newResults: Record<string, unknown>) => {
    if (!videoMeta || savedId) return;
    try {
      const res = await fetch("/api/summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoMeta.videoId,
          title: videoMeta.title,
          channel: videoMeta.channel,
          duration: videoMeta.duration,
          thumbnailUrl: videoMeta.thumbnailUrl,
          transcript,
          ...newResults,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedId(data.id);
      }
    } catch {
      // Silent fail on save — summary still visible
    }
  };

  const fetchTranscript = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setVideoMeta(null);
    setTranscript(null);
    setResults({});

    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch transcript");

      setVideoMeta(data.metadata);
      setTranscript(data.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (mode: Mode) => {
    if (!videoMeta || !transcript) return;
    if (results[mode]) {
      setActiveMode(mode);
      return;
    }

    setActiveMode(mode);
    setSummarizing(true);
    setError(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          title: videoMeta.title,
          channel: videoMeta.channel,
          transcript,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate summary");

      const newResults = { ...results, [mode]: data.result };
      setResults(newResults);
      // Auto-save first summary to library
      if (!savedId) {
        saveToLibrary(newResults);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSummarizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchTranscript();
  };

  // Auto-generate verdict after transcript loads
  const handleGenerateFirst = async () => {
    if (videoMeta && transcript && !results.verdict) {
      await generateSummary("verdict");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">New summary</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Paste a YouTube URL to generate a summary.
        </p>
      </div>

      {/* URL Input */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center border border-zinc-200 rounded-xl bg-white overflow-hidden focus-within:border-emerald-400 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all">
          <div className="pl-4 text-zinc-400">
            <Globe className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 min-w-0 bg-transparent px-3 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="m-1.5 px-5 py-2 rounded-lg text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Fetch"
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Meta Card */}
      <AnimatePresence>
        {videoMeta && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-xl">
              <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                <img
                  src={videoMeta.thumbnailUrl}
                  alt={videoMeta.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                  {videoMeta.title}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {videoMeta.channel}
                  {videoMeta.duration > 0 &&
                    ` · ${formatDuration(videoMeta.duration)}`}
                </p>
              </div>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-2">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => generateSummary(mode.id)}
                  disabled={summarizing}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 disabled:opacity-60",
                    activeMode === mode.id
                      ? modeTabColors[mode.color as keyof typeof modeTabColors]
                      : "bg-white border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300"
                  )}
                >
                  <mode.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Summary output */}
            {summarizing && !results[activeMode] && (
              <div className="flex items-center justify-center py-16 rounded-xl border border-zinc-200 bg-white">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  <p className="text-sm text-zinc-500">Generating summary...</p>
                </div>
              </div>
            )}

            {results[activeMode] && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SummaryPanel
                  mode={activeMode}
                  data={results[activeMode] as Record<string, unknown>}
                />
              </motion.div>
            )}

            {/* Auto-generate prompt */}
            {!results.verdict && !summarizing && (
              <button
                onClick={handleGenerateFirst}
                className="w-full py-3 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Generate summary
              </button>
            )}

            {/* Saved indicator */}
            {savedId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Link
                  href={`/summary/${savedId}`}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Saved to library. View summary →
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
