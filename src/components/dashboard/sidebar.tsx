"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Library, Mail, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: Library },
  { href: "/digests", label: "Digests", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-zinc-200/60 bg-[#fafafa]/80 backdrop-blur-xl h-screen sticky top-0">
      <div className="p-5 pb-4">
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </div>

      <div className="px-3 mb-3">
        <Link href="/new">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-200/50 hover:shadow-md hover:shadow-emerald-200/50 transition-shadow cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            New summary
          </motion.div>
        </Link>
      </div>

      <hr className="border-zinc-200/40 mx-4 mb-2" />

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/library" && pathname.startsWith("/summary")) ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-emerald-500/[0.08]"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <div
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "text-zinc-900"
                      : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100/50"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive && "text-emerald-600")} />
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200/40">
        <UserButton />
      </div>
    </aside>
  );
}
