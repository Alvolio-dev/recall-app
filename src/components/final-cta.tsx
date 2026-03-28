"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-button";

export function FinalCta() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem("cta-url") as HTMLInputElement;
    if (input.value.trim()) {
      router.push(`/try?url=${encodeURIComponent(input.value.trim())}`);
    }
  };

  return (
    <section className="relative py-24 px-6">
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-400/[0.12] blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-lg mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900">
          Ready to<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">remember more?</span>
        </h2>
        <p className="text-zinc-500 text-base font-light mb-8">
          Paste your first link. No sign-up, no credit card, no commitment.
        </p>

        <label htmlFor="cta-url" className="sr-only">YouTube URL</label>
        <form onSubmit={handleSubmit} className="flex items-center bg-white border border-zinc-200 rounded-2xl max-w-md mx-auto overflow-hidden shadow-sm focus-within:border-emerald-400 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all">
          <div className="pl-4 text-zinc-400" aria-hidden="true">
            <Globe className="w-4 h-4" />
          </div>
          <input
            id="cta-url"
            name="cta-url"
            type="url"
            placeholder="Paste a YouTube URL…"
            className="flex-1 min-w-0 bg-transparent px-3 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
          />
          <HoverButton
            className="m-1.5 px-5 py-2.5 text-sm whitespace-nowrap"
          >
            Summarise
          </HoverButton>
        </form>

        <p className="text-xs text-zinc-400 mt-4">First summary free · No sign-up required</p>
      </motion.div>
    </section>
  );
}
