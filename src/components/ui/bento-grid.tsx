"use client";

import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
}

function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-5 rounded-xl overflow-hidden transition-all duration-300",
            "border border-zinc-200/80 bg-white",
            "hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
            "hover:-translate-y-0.5 will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
            {
              "shadow-[0_2px_12px_rgba(0,0,0,0.04)] -translate-y-0.5": item.hasPersistentHover,
            }
          )}
        >
          <div
            className={`absolute inset-0 ${
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-50 border border-zinc-100 group-hover:bg-gradient-to-br group-hover:from-zinc-50 group-hover:to-white transition-all duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span
                  className={cn(
                    "text-[10px] font-medium px-2.5 py-1 rounded-lg",
                    "bg-zinc-50 border border-zinc-100 text-zinc-500",
                    "transition-colors duration-300 group-hover:bg-zinc-100"
                  )}
                >
                  {item.status}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-medium text-zinc-900 tracking-tight text-[15px]">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-zinc-400 font-normal">
                    {item.meta}
                  </span>
                )}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-md bg-zinc-50 border border-zinc-100 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.cta || "Learn more →"}
              </span>
            </div>
          </div>

          <div
            className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-zinc-100/50 to-transparent ${
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}
          />
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };
