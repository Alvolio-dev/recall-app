"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Clock,
  Star,
  ListOrdered,
  Loader2,
  Play,
  AlertCircle,
  ArrowLeft,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SummaryPanel } from "@/components/dashboard/summary-output";
import { formatDuration } from "@/lib/youtube";
import { Logo } from "@/components/ui/logo";

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

interface VideoMeta {
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  thumbnailUrl: string;
}

export default function TryPage() {
  return (
    <Suspense>
      <TryContent />
    </Suspense>
  );
}

function TryContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const [url, setUrl] = useState(initialUrl);
  const [activeMode, setActiveMode] = useState<Mode>("verdict");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<Record<string, any>>({});

  const fetchTranscriptData = async (targetUrl: string) => {
    setLoading(true);
    setError(null);
    setVideoMeta(null);
    setTranscript(null);
    setResults({});

    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch transcript");

      setVideoMeta(data.metadata);
      setTranscript(data.transcript);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (
    mode: Mode,
    meta?: VideoMeta | null,
    trans?: string | null
  ) => {
    const m = meta || videoMeta;
    const t = trans || transcript;
    if (!m || !t) return;
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
          title: m.title,
          channel: m.channel,
          transcript: t,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate summary");

      setResults((prev) => ({ ...prev, [mode]: data.result }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSummarizing(false);
    }
  };

  // Auto-fetch if URL is in query params
  useEffect(() => {
    if (initialUrl) {
      fetchTranscriptData(initialUrl).then((data) => {
        if (data) {
          // Auto-generate verdict
          const meta = data.metadata;
          if (data.transcript) {
            generateSummary("verdict", meta, data.transcript);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const data = await fetchTranscriptData(url.trim());
    if (data) {
      generateSummary("verdict", data.metadata, data.transcript);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* URL Input */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center rounded-2xl bg-white card-shadow overflow-hidden focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_4px_12px_rgba(16,185,129,0.08)] transition-shadow">
            <div className="pl-5 text-zinc-400">
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 min-w-0 bg-transparent px-4 py-4 text-base text-zinc-900 placeholder:text-zinc-400 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="m-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md hover:shadow-emerald-200/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Summarise"
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

        {/* Loading state */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
            <p className="text-sm text-zinc-500">Fetching video transcript...</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {videoMeta && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Video meta card */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl card-shadow">
                <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 ring-1 ring-black/5">
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
                        ? modeTabColors[mode.color]
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
                <div className="flex items-center justify-center py-16 rounded-xl bg-white card-shadow">
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
                  <SummaryPanel mode={activeMode} data={results[activeMode]} />
                </motion.div>
              )}

              {/* Sign up CTA */}
              {Object.keys(results).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <Bookmark className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Save this summary
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    Sign up free to save summaries, ask follow-up questions and build your learning library.
                  </p>
                  <Link
                    href={`/sign-up?redirect_url=${encodeURIComponent(`/new?url=${encodeURIComponent(url)}`)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md hover:shadow-emerald-200/30 transition-all"
                  >
                    Sign up free
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
