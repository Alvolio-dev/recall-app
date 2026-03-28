"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Clock,
  Star,
  ListOrdered,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SummaryPanel } from "@/components/dashboard/summary-output";
import { FollowUpChat } from "@/components/dashboard/follow-up-chat";
import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { formatDuration } from "@/lib/youtube";

type ProgressStep = "fetching" | "analysing" | "generating" | "done";

type Mode = "verdict" | "takeaways" | "steps";

const modes = [
  {
    id: "verdict" as Mode,
    label: "Worth my time?",
    icon: Clock,
    color: "emerald",
    description: "Quick verdict on whether to watch",
  },
  {
    id: "takeaways" as Mode,
    label: "Key takeaways",
    icon: Star,
    color: "violet",
    description: "Top ideas with timestamps",
  },
  {
    id: "steps" as Mode,
    label: "Step by step",
    icon: ListOrdered,
    color: "orange",
    description: "Actionable steps to follow",
  },
];

const modeTabColors: Record<string, string> = {
  emerald:
    "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100",
  violet: "bg-zinc-900 border-zinc-900 text-white shadow-sm",
  orange:
    "bg-orange-50 border-orange-200 text-orange-700 shadow-sm shadow-orange-100",
};

interface VideoMeta {
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  thumbnailUrl: string;
}

interface SummaryFlowProps {
  initialUrl?: string;
  onSaved?: (id: string) => void;
  showFollowUp?: boolean;
  saveToLibrary?: boolean;
}

export function SummaryFlow({
  initialUrl = "",
  onSaved,
  showFollowUp = false,
  saveToLibrary = false,
}: SummaryFlowProps) {
  const [url, setUrl] = useState(initialUrl);
  const [activeMode, setActiveMode] = useState<Mode>("verdict");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<Record<string, any>>({});
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showModeInfo, setShowModeInfo] = useState(false);
  const [progressStep, setProgressStep] = useState<ProgressStep | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  // Extract video ID for thumbnail preview as user types
  useEffect(() => {
    const ytPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(ytPattern);
    setPreviewId(match ? match[1] : null);
  }, [url]);

  const doSave = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (meta: VideoMeta, trans: string | null, newResults: Record<string, any>) => {
      if (!saveToLibrary || savedId) return;
      try {
        const res = await fetch("/api/summaries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoId: meta.videoId,
            title: meta.title,
            channel: meta.channel,
            duration: meta.duration,
            thumbnailUrl: meta.thumbnailUrl,
            transcript: trans,
            ...newResults,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setSavedId(data.id);
          onSaved?.(data.id);
        }
      } catch {
        // Silent
      }
    },
    [saveToLibrary, savedId, onSaved]
  );

  const summarize = useCallback(
    async (mode: Mode, meta: VideoMeta, trans: string) => {
      setActiveMode(mode);
      setSummarizing(true);
      setError(null);

      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            title: meta.title,
            channel: meta.channel,
            transcript: trans,
          }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to generate summary");

        setResults((prev) => {
          const updated = { ...prev, [mode]: data.result };
          doSave(meta, trans, updated);
          return updated;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSummarizing(false);
      }
    },
    [doSave]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const targetUrl = url.trim();
      if (!targetUrl) return;

      // Client-side URL validation
      const ytPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/live\/|youtube\.com\/shorts\/)[a-zA-Z0-9_-]{11}/;
      if (!ytPattern.test(targetUrl) && !/^[a-zA-Z0-9_-]{11}$/.test(targetUrl)) {
        setError("That doesn't look like a YouTube URL. Try pasting a link like youtube.com/watch?v=...");
        return;
      }

      setLoading(true);
      setError(null);
      setVideoMeta(null);
      setTranscript(null);
      setResults({});
      setSavedId(null);
      setProgressStep("fetching");

      try {
        const res = await fetch("/api/transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl }),
        });

        setProgressStep("analysing");
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to fetch transcript");

        setVideoMeta(data.metadata);
        setTranscript(data.transcript);
        setLoading(false);
        setProgressStep("generating");

        await summarize("verdict", data.metadata, data.transcript);
        setProgressStep("done");
        setTimeout(() => setProgressStep(null), 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setLoading(false);
        setProgressStep(null);
      }
    },
    [url, summarize]
  );

  const handleModeClick = (mode: Mode) => {
    if (results[mode]) {
      setActiveMode(mode);
      return;
    }
    if (videoMeta && transcript) {
      summarize(mode, videoMeta, transcript);
    }
  };

  // Auto-submit if URL provided
  useEffect(() => {
    if (initialUrl) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center rounded-2xl bg-white card-shadow overflow-hidden focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_4px_12px_rgba(16,185,129,0.08)] transition-shadow">
          <div className="pl-5 text-zinc-400">
            <Globe className="w-5 h-5" />
          </div>
          <label htmlFor="summary-url" className="sr-only">YouTube URL</label>
          <input
            id="summary-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 min-w-0 bg-transparent px-4 py-4 text-base text-zinc-900 placeholder:text-zinc-400 outline-none"
            disabled={loading || summarizing}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || summarizing || !url.trim()}
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

      {/* URL Preview */}
      {previewId && !videoMeta && !loading && !progressStep && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl overflow-hidden card-shadow"
        >
          <img
            src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
            alt="Video thumbnail"
            className="w-full aspect-video object-cover"
          />
        </motion.div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      {progressStep && progressStep !== "done" && !videoMeta && (
        <GenerationProgress step={progressStep} />
      )}

      {/* Results */}
      <AnimatePresence>
        {videoMeta && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Video meta */}
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400">Summary mode</span>
                <button
                  onClick={() => setShowModeInfo(!showModeInfo)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors flex items-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  What are these?
                </button>
              </div>

              <AnimatePresence>
                {showModeInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-50 rounded-xl text-[11px] text-zinc-500">
                      {modes.map((m) => (
                        <div key={m.id} className="text-center">
                          <m.icon className="w-3.5 h-3.5 mx-auto mb-1 text-zinc-400" />
                          <p className="font-medium text-zinc-700">
                            {m.label}
                          </p>
                          <p>{m.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeClick(mode.id)}
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
            </div>

            {/* Summary output */}
            {summarizing && !results[activeMode] && (
              <div className="flex items-center justify-center py-16 rounded-xl bg-white card-shadow">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  <p className="text-sm text-zinc-500">
                    Generating summary...
                  </p>
                </div>
              </div>
            )}

            {results[activeMode] && (
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SummaryPanel mode={activeMode} data={results[activeMode]} />
              </motion.div>
            )}

            {/* Follow-up chat */}
            {showFollowUp && transcript && Object.keys(results).length > 0 && (
              <FollowUpChat
                transcript={transcript}
                title={videoMeta.title}
                channel={videoMeta.channel}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
