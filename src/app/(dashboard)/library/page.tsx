import type { Metadata } from "next";
import { Search, LayoutGrid, List } from "lucide-react";

export const metadata: Metadata = {
  title: "Library",
};

export default function LibraryPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Library</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-colors">
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
          placeholder="Search summaries..."
          className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
        />
      </div>

      {/* Triage tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-zinc-100 rounded-xl w-fit">
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-zinc-900 shadow-sm">
          Inbox
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
          Later
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
          Archive
        </button>
      </div>

      {/* Empty state */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
        <p className="text-sm text-zinc-500">No summaries in your inbox yet.</p>
      </div>
    </div>
  );
}
