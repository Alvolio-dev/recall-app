"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Library, Mail, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/new", label: "New summary", icon: PlusCircle },
  { href: "/library", label: "Library", icon: Library },
  { href: "/digests", label: "Digests", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-zinc-200/60 bg-[#fafafa]/80 backdrop-blur-xl h-screen sticky top-0">
      <div className="p-5">
        <Link href="/dashboard">
          <Logo size="sm" />
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200/60">
        <UserButton />
      </div>
    </aside>
  );
}
