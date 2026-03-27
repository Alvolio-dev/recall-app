"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  PlusCircle,
  Clock,
  Zap,
  TrendingUp,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { formatDuration } from "@/lib/youtube";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Summary = Record<string, any>;

export default function DashboardPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/summaries")
      .then((r) => r.json())
      .then((data) => {
        setSummaries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const recent = summaries.slice(0, 5);
  const quickWatches = summaries.filter((s) => s.duration > 0 && s.duration < 900);
  const deepDives = summaries.filter((s) => s.duration >= 1800);
  const totalMinutesSaved = summaries.reduce(
    (acc, s) => acc + Math.floor((s.duration || 0) / 60) * 0.6,
    0
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-zinc-100 rounded-lg animate-pulse mb-2" />
        <div className="h-5 w-72 bg-zinc-100 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-6 animate-pulse">
              <div className="h-8 w-16 bg-zinc-100 rounded mb-2" />
              <div className="h-4 w-24 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-zinc-200 bg-white animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Welcome to Recall</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Start by summarising your first YouTube video.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <PlusCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-2">
            No summaries yet
          </h2>
          <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
            Paste a YouTube URL to get your first AI-powered summary with key takeaways, timestamps and action steps.
          </p>
          <Link
            href="/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create your first summary
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Here is what you have been learning.
          </p>
        </div>
        <Link
          href="/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New summary
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{summaries.length}</p>
          <p className="text-xs text-zinc-500">
            {summaries.length === 1 ? "summary" : "summaries"} created
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">
            ~{Math.round(totalMinutesSaved)} min
          </p>
          <p className="text-xs text-zinc-500">estimated time saved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">
            {summaries.filter((s) => {
              const d = new Date(s.createdAt);
              const now = new Date();
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return d >= weekAgo;
            }).length}
          </p>
          <p className="text-xs text-zinc-500">this week</p>
        </motion.div>
      </div>

      {/* Recent summaries */}
      <Section title="Recent" href="/library" items={recent} />

      {/* Quick watches */}
      {quickWatches.length > 0 && (
        <Section title="Quick watches" subtitle="Under 15 min" items={quickWatches.slice(0, 3)} />
      )}

      {/* Deep dives */}
      {deepDives.length > 0 && (
        <Section title="Deep dives" subtitle="30+ min" items={deepDives.slice(0, 3)} />
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  href,
  items,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  items: Summary[];
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
          {subtitle && (
            <span className="text-xs text-zinc-400">{subtitle}</span>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {items.map((summary, i) => (
          <motion.div
            key={summary.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link href={`/summary/${summary.id}`}>
              <div className="group flex items-center gap-4 p-3 rounded-xl border border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="w-20 h-14 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                  <img
                    src={summary.thumbnailUrl}
                    alt={summary.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-zinc-900 truncate group-hover:text-emerald-600 transition-colors">
                    {summary.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {summary.channel}
                    {summary.duration > 0 &&
                      ` · ${formatDuration(summary.duration)}`}
                  </p>
                </div>
                <TrendingUp className="w-4 h-4 text-zinc-300 flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
