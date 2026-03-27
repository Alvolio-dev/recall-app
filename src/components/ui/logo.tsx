"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

export function Logo({ className, size = "md", variant = "light" }: LogoProps) {
  const sizes = {
    sm: { text: "text-lg", icon: "w-5 h-5", triangle: "4,2 4,8 8,5" },
    md: { text: "text-xl", icon: "w-6 h-6", triangle: "4.5,2 4.5,9 9,5.5" },
    lg: { text: "text-2xl", icon: "w-7 h-7", triangle: "5,2.5 5,9.5 10,6" },
  };

  const s = sizes[size];
  const isDark = variant === "dark";

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
      isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-white/80",
      className
    )}>
      <div className={cn(
        "rounded-lg flex items-center justify-center",
        s.icon,
        isDark ? "bg-emerald-400" : "bg-emerald-600"
      )}>
        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
          <polygon points={s.triangle} fill="white" />
        </svg>
      </div>
      <span className={cn(
        "font-semibold tracking-tight",
        s.text,
        isDark ? "text-white" : "text-zinc-900"
      )}>
        re<span className={isDark ? "text-emerald-400 italic" : "text-emerald-600 italic"}>call</span>
      </span>
    </div>
  );
}
