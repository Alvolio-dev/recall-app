"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle as PlusIcon } from "lucide-react";
import { Search, LayoutGrid, List, PlusCircle, Clock, Inbox, BookmarkCheck, Archive, ArrowUpDown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDuration } from "@/lib/youtube";

interface Summary {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  thumbnailUrl: string;
  triageState: "INBOX" | "LATER" | "ARCHIVE";
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

const triageTabs = [
  { id: "INBOX", label: "Inbox", icon: Inbox },
  { id: "LATER", label: "Later", icon: BookmarkCheck },
  { id: "ARCHIVE", label: "Archive", icon: Archive },
];

export default function LibraryPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [triage, setTriage] = useState("INBOX");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    fetch("/api/summaries")
      .then((r) => r.json())
      .then((data) => {
        setSummaries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = summaries
    .filter((s) => {
      if (s.triageState !== triage) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.channel.toLowerCase().includes(q) ||
          s.tags.some((t: string) => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "newest" ? db - da : da - db;
    });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-zinc-900">Library</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            aria-label={`Sort by ${sort === "newest" ? "oldest" : "newest"} first`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sort === "newest" ? "Newest" : "Oldest"}
          </button>
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={cn(
              "p-2 rounded-lg border transition-colors",
              view === "grid"
                ? "border-zinc-300 text-zinc-900"
                : "border-zinc-200 text-zinc-400 hover:text-zinc-900"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={cn(
              "p-2 rounded-lg border transition-colors",
              view === "list"
                ? "border-zinc-300 text-zinc-900"
                : "border-zinc-200 text-zinc-400 hover:text-zinc-900"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center border border-zinc-200 rounded-xl bg-white mb-6 focus-within:border-emerald-400 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all">
        <div className="pl-4 text-zinc-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search summaries..."
          className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
        />
      </div>

      {/* Triage tabs */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl">
          {triageTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTriage(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                triage === tab.id
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-zinc-400 hidden sm:inline">
          {triage === "INBOX" && "New summaries land here"}
          {triage === "LATER" && "Saved to revisit"}
          {triage === "ARCHIVE" && "Done, out of the way"}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white card-shadow p-4 animate-pulse">
              <div className="aspect-video rounded-lg bg-zinc-100 mb-3" />
              <div className="h-4 bg-zinc-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white card-shadow p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200/50">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-zinc-500 mb-5">
            {summaries.length === 0
              ? "No summaries yet. Create your first one."
              : "No summaries match your search."}
          </p>
          {summaries.length === 0 && (
            <Link
              href="/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md hover:shadow-emerald-200/50 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              New summary
            </Link>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((summary, i) => (
            <motion.div
              key={summary.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/summary/${summary.id}`}>
                <div className="group rounded-2xl bg-white card-shadow card-shadow-emerald overflow-hidden transition-all duration-200 cursor-pointer">
                  <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                    <img
                      src={summary.thumbnailUrl}
                      alt={summary.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {summary.duration > 0 && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                        <Clock className="w-2.5 h-2.5" />
                        {formatDuration(summary.duration)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {summary.title}
                      </h3>
                      {summary.isFavorite && (
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-current flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{summary.channel}</p>
                    {summary.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {summary.tags.slice(0, 3).map((tag: string) => (
                          <button
                            key={tag}
                            onClick={(e) => { e.preventDefault(); setSearch(tag); }}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((summary, i) => (
            <motion.div
              key={summary.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/summary/${summary.id}`}>
                <div className="group flex items-center gap-4 p-3 rounded-xl bg-white card-shadow card-shadow-emerald transition-all cursor-pointer">
                  <div className="w-24 h-16 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                    <img
                      src={summary.thumbnailUrl}
                      alt={summary.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-zinc-900 truncate group-hover:text-emerald-600 transition-colors">
                      {summary.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {summary.channel}
                      {summary.duration > 0 && ` · ${formatDuration(summary.duration)}`}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
