import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Digests",
};

export default function DigestsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Weekly Digests</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Your weekly recap of everything you learned.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          No digests yet
        </h2>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Digests are generated every Sunday from your weekly summaries. Start summarising videos to get your first digest.
        </p>
      </div>
    </div>
  );
}
