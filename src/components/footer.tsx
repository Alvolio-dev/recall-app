"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-zinc-100 py-10 px-6 border-t border-zinc-200/60">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8 pb-8 border-b border-zinc-200">
          <Logo size="md" />
          <div className="max-w-xs w-full">
            <label htmlFor="footer-email" className="text-sm font-medium text-zinc-900 mb-2 block">Get product updates</label>
            <div className="flex items-center bg-white border border-zinc-200 rounded-xl overflow-hidden focus-within:border-emerald-400 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all">
              <input
                id="footer-email"
                type="email"
                placeholder="you@email.com"
                className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
              />
              <button className="m-1 px-4 py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">Terms</Link>
            <Link href="/support" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">Support</Link>
          </div>
          <p className="text-sm text-zinc-400">&copy; 2026 Recall. Made in Sydney.</p>
        </div>
      </div>
    </footer>
  );
}
