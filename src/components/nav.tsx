"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { MotionButton } from "@/components/ui/motion-button";
import { Logo } from "@/components/ui/logo";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
      <Logo size="sm" />

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-1">
        <a href="#demo" className="text-sm text-zinc-500 px-4 py-2 rounded-full hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
          How it works
        </a>
        <a href="#pricing" className="text-sm text-zinc-500 px-4 py-2 rounded-full hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
          Pricing
        </a>
        <Link href="/blog" className="text-sm text-zinc-500 px-4 py-2 rounded-full hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
          Blog
        </Link>
        <a href="#" className="text-sm text-zinc-500 px-4 py-2 rounded-full hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
          Sign in
        </a>
        <MotionButton label="Try free" className="ml-2 w-36 bg-transparent" />
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-[#fafafa]/95 backdrop-blur-xl border-b border-zinc-200/60 flex flex-col p-4 gap-1 md:hidden">
          <a href="#demo" onClick={() => setOpen(false)} className="text-sm text-zinc-500 px-4 py-3 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            How it works
          </a>
          <a href="#pricing" onClick={() => setOpen(false)} className="text-sm text-zinc-500 px-4 py-3 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            Pricing
          </a>
          <Link href="/blog" className="text-sm text-zinc-500 px-4 py-3 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            Blog
          </Link>
          <a href="#" className="text-sm text-zinc-500 px-4 py-3 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            Sign in
          </a>
          <button className="text-sm font-medium text-white bg-zinc-900 px-5 py-3 rounded-xl hover:bg-zinc-800 transition-colors mt-1">
            Try free
          </button>
        </div>
      )}
    </nav>
  );
}
