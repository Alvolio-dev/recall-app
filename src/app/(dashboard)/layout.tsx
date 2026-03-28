"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { Topbar } from "@/components/dashboard/topbar";
import { ToastProvider } from "@/components/ui/toast";
import { CommandPalette } from "@/components/dashboard/command-palette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Topbar />

          {/* Ambient background glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 right-0 w-[600px] h-[400px] bg-emerald-400/[0.03] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-[20%] w-[400px] h-[300px] bg-violet-400/[0.02] rounded-full blur-[100px]" />
          </div>

          <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <MobileNav />
        <CommandPalette />
      </div>
    </ToastProvider>
  );
}
