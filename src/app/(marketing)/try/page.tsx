"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { SummaryFlow } from "@/components/dashboard/summary-flow";

export default function TryPage() {
  return (
    <Suspense>
      <TryContent />
    </Suspense>
  );
}

function TryContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";
  const [hasResults, setHasResults] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <SummaryFlow
          initialUrl={initialUrl}
          onSaved={() => setHasResults(true)}
        />

        {/* Sign up CTA — appears after any result is shown */}
        {(hasResults || initialUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 text-center mt-6"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Save this summary
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Sign up free to save summaries, ask follow-up questions and build
              your learning library.
            </p>
            <Link
              href={`/sign-up?redirect_url=${encodeURIComponent(`/new?url=${encodeURIComponent(initialUrl || "")}`)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md hover:shadow-emerald-200/30 transition-all"
            >
              Sign up free
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
