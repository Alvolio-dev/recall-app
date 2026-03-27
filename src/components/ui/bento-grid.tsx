"use client";

import { useEffect, useRef } from "react";
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

function GlowWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", e.clientX.toFixed(2));
        cardRef.current.style.setProperty("--xp", (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty("--y", e.clientY.toFixed(2));
        cardRef.current.style.setProperty("--yp", (e.clientY / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const inlineStyles: Record<string, any> = {
    "--base": 120,
    "--spread": 200,
    "--radius": "14",
    "--border": "2",
    "--backdrop": "hsl(0 0% 100% / 1)",
    "--backup-border": "hsl(0 0% 90% / 0.5)",
    "--size": "200",
    "--outer": "1",
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 150) * 1px)",
    "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.06)), transparent
    )`,
    backgroundColor: "var(--backdrop, transparent)",
    backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
    backgroundPosition: "50% 50%",
    backgroundAttachment: "fixed",
    border: "var(--border-size) solid var(--backup-border)",
    position: "relative" as const,
    touchAction: "none" as const,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        [data-bento-glow]::before,
        [data-bento-glow]::after {
          pointer-events: none;
          content: "";
          position: absolute;
          inset: calc(var(--border-size) * -1);
          border: var(--border-size) solid transparent;
          border-radius: calc(var(--radius) * 1px);
          background-attachment: fixed;
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-repeat: no-repeat;
          background-position: 50% 50%;
          mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
          mask-clip: padding-box, border-box;
          mask-composite: intersect;
        }
        [data-bento-glow]::before {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
          );
          filter: brightness(2);
        }
        [data-bento-glow]::after {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
          );
        }
        [data-bento-glow] [data-bento-glow-inner] {
          position: absolute;
          inset: 0;
          will-change: filter;
          opacity: var(--outer, 1);
          border-radius: calc(var(--radius) * 1px);
          border-width: calc(var(--border-size) * 20);
          filter: blur(calc(var(--border-size) * 10));
          background: none;
          pointer-events: none;
          border: none;
        }
        [data-bento-glow] > [data-bento-glow-inner]::before {
          inset: -10px;
          border-width: 10px;
        }
      `}} />
      <div
        ref={cardRef}
        data-bento-glow
        style={inlineStyles}
        className={`rounded-[14px] relative backdrop-blur-[5px] ${className}`}
      >
        <div data-bento-glow-inner />
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}

function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
      {items.map((item, index) => (
        <GlowWrapper
          key={index}
          className={cn(
            "group p-5 overflow-hidden transition-all duration-300",
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
        </GlowWrapper>
      ))}
    </div>
  );
}

export { BentoGrid };
