"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  PlusCircle,
  Clock,
  Zap,
  BookOpen,
  ChevronRight,
  Globe,
} from "lucide-react";
import { formatDuration } from "@/lib/youtube";
import { CountUp } from "@/components/ui/count-up";
import { Onboarding } from "@/components/dashboard/onboarding";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Summary = Record<string, any>;

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName || "there";
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
  const totalMinutesSaved = Math.round(
    summaries.reduce((acc, s) => acc + Math.floor((s.duration || 0) / 60) * 0.6, 0)
  );
  const thisWeek = summaries.filter((s) => {
    const d = new Date(s.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-48 rounded-lg animate-shimmer mb-2" />
        <div className="h-5 w-72 rounded-lg animate-shimmer mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white p-6 card-shadow">
              <div className="h-8 w-16 rounded-lg animate-shimmer mb-2" />
              <div className="h-4 w-24 rounded animate-shimmer" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white card-shadow animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state — URL input front and center
  if (summaries.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
            What are you learning?
          </h1>
          <p className="text-zinc-500 text-base font-light">
            Paste a YouTube link to decide if it is worth your time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem("url") as HTMLInputElement;
              if (input.value.trim()) {
                window.location.href = `/new?url=${encodeURIComponent(input.value.trim())}`;
              }
            }}
            className="flex items-center rounded-2xl bg-white card-shadow overflow-hidden focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_4px_12px_rgba(16,185,129,0.08)] transition-shadow"
          >
            <div className="pl-5 text-zinc-400">
              <Globe className="w-5 h-5" />
            </div>
            <input
              name="url"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 min-w-0 bg-transparent px-4 py-4 text-base text-zinc-900 placeholder:text-zinc-400 outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="m-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md hover:shadow-emerald-200/50 transition-all"
            >
              Summarise
            </button>
          </form>
          <p className="text-xs text-zinc-400 text-center mt-3">
            Works with any YouTube video that has captions
          </p>

          {/* Demo data loader - remove in production */}
          <button
            onClick={async () => {
              await fetch("/api/seed", { method: "POST" });
              window.location.reload();
            }}
            className="mt-6 text-xs text-zinc-400 hover:text-zinc-600 transition-colors underline"
          >
            Load demo data
          </button>
        </motion.div>
      </div>
    );
  }

  // Dashboard with content
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Hey, {firstName}</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Here is what you have been learning.
          </p>
        </div>
        <Link href="/new">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-200/50 hover:shadow-md hover:shadow-emerald-200/50 transition-shadow"
          >
            <PlusCircle className="w-4 h-4" />
            New summary
          </motion.div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: BookOpen,
            iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
            value: summaries.length,
            suffix: "",
            label: summaries.length === 1 ? "summary" : "summaries",
            delay: 0,
          },
          {
            icon: Clock,
            iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
            value: totalMinutesSaved,
            suffix: " min",
            label: "time saved",
            delay: 0.05,
          },
          {
            icon: Zap,
            iconBg: "bg-gradient-to-br from-orange-500 to-amber-600",
            value: thisWeek,
            suffix: "",
            label: "this week",
            delay: 0.1,
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            whileHover={{ y: -2 }}
            className="rounded-2xl bg-white p-5 card-shadow card-shadow-hover transition-shadow cursor-default"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">
              <CountUp end={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Onboarding */}
      <Onboarding summaryCount={summaries.length} />

      {/* Recent summaries */}
      <Section title="Recent" href="/library" items={recent} />

      {quickWatches.length > 0 && (
        <Section title="Quick watches" subtitle="Under 15 min" items={quickWatches.slice(0, 3)} />
      )}

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
          {subtitle && <span className="text-xs text-zinc-400">{subtitle}</span>}
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-600 transition-colors"
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
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 24 }}
            whileHover={{ y: -1 }}
          >
            <Link href={`/summary/${summary.id}`}>
              <div className="group flex items-center gap-4 p-3 rounded-xl bg-white card-shadow card-shadow-emerald transition-all cursor-pointer">
                <div className="w-20 h-14 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0 ring-1 ring-black/5">
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
                    {summary.duration > 0 && ` · ${formatDuration(summary.duration)}`}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
