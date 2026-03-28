"use client";

import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import { Search } from "lucide-react";
import Link from "next/link";

export function Topbar() {
  return (
    <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
      <Link href="/dashboard">
        <Logo size="sm" />
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true })
            )
          }
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
        <UserButton />
      </div>
    </header>
  );
}
