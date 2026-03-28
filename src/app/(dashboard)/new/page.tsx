"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { SummaryFlow } from "@/components/dashboard/summary-flow";
import { useToast } from "@/components/ui/toast";

export default function NewSummaryPage() {
  return (
    <Suspense>
      <NewSummaryContent />
    </Suspense>
  );
}

function NewSummaryContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";
  const { toast } = useToast();
  const [savedId, setSavedId] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900">New summary</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Paste a YouTube URL to generate a summary.
        </p>
      </div>

      <SummaryFlow
        initialUrl={initialUrl}
        saveToLibrary
        showFollowUp
        onSaved={(id) => {
          setSavedId(id);
          toast("Saved to library");
        }}
      />

      {savedId && (
        <div className="text-center mt-4">
          <Link
            href={`/summary/${savedId}`}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View in library →
          </Link>
        </div>
      )}
    </div>
  );
}
