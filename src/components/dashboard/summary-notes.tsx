"use client";

import { useState, useEffect, useRef } from "react";
import { StickyNote, Check } from "lucide-react";
import { motion } from "framer-motion";

interface SummaryNotesProps {
  summaryId: string;
  initialNotes?: string;
}

export function SummaryNotes({ summaryId, initialNotes = "" }: SummaryNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(!!initialNotes);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Auto-save after 1 second of no typing
  useEffect(() => {
    if (notes === initialNotes) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/summaries/${summaryId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        // Silent fail
      }
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [notes, summaryId, initialNotes]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-600 transition-colors py-2"
      >
        <StickyNote className="w-4 h-4" />
        Add personal notes
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="rounded-xl border border-zinc-200 bg-white overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-zinc-500" />
          <p className="text-sm font-medium text-zinc-900">Your notes</p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 text-xs text-emerald-600"
          >
            <Check className="w-3 h-3" />
            Saved
          </motion.div>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add your thoughts, connections, or action items..."
        className="w-full p-4 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none resize-none min-h-[100px] bg-transparent"
      />
    </motion.div>
  );
}
