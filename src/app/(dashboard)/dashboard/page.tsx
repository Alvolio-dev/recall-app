import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
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

      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
          <PlusCircle className="w-6 h-6 text-zinc-400" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          No summaries yet
        </h2>
        <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
          Paste a YouTube URL to get your first AI-powered summary.
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
