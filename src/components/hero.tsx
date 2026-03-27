"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-button";

export function Hero() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Color blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[-15%] top-[-15%] w-[35%] h-[35%] rounded-full bg-emerald-400/25 blur-[120px]" />
        <div className="absolute right-[10%] top-[-5%] w-[20%] h-[20%] rounded-full bg-teal-500/15 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-15%] w-[35%] h-[35%] rounded-full bg-violet-400/20 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-zinc-900">Watch less.</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
            Remember more.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg text-zinc-500 font-light mb-8 max-w-md mx-auto leading-relaxed"
        >
          Paste any YouTube link and get a summary shaped around what you actually need.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-lg"
        >
          <label htmlFor="hero-url" className="sr-only">YouTube URL</label>
          <div className="flex items-center bg-white border border-zinc-200 rounded-2xl shadow-sm focus-within:border-emerald-400 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all">
            <div className="pl-4 text-zinc-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              id="hero-url"
              type="url"
              placeholder="Paste a YouTube URL…"
              className="flex-1 min-w-0 bg-transparent px-3 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            />
            <HoverButton className="m-1.5 px-5 py-2.5 text-sm whitespace-nowrap">
              Summarise
            </HoverButton>
          </div>
          <p className="text-xs text-zinc-400 mt-3">No account needed · Free forever</p>
        </motion.div>
      </div>
    </div>
  );
}
