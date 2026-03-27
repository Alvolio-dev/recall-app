import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summary",
};

export default function SummaryDetailPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Summary detail view coming soon.</p>
      </div>
    </div>
  );
}
