"use client";

import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export function Topbar() {
  return (
    <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
      <Link href="/dashboard">
        <Logo size="sm" />
      </Link>
      <UserButton />
    </header>
  );
}
