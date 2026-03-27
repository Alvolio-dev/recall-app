import { Mail } from "lucide-react";

export default function DigestsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900">Weekly Digests</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Your weekly recap of everything you learned.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50 p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-200/50">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-base font-semibold text-zinc-900 mb-2">
          No digests yet
        </h2>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Digests are generated every Sunday from your weekly summaries. Start summarising videos to get your first digest.
        </p>
        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-zinc-400">Next digest: Sunday</span>
        </div>
      </div>
    </div>
  );
}
