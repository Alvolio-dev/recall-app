"use client";

import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export function GridBackground({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  const dotMask = useMotionTemplate`radial-gradient(700px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative">
      {/* Static dot pattern — very faint */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 0.8px, transparent 0.8px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Mouse-reveal dot pattern — brighter near cursor */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none opacity-70"
        style={{
          backgroundImage: "radial-gradient(circle, #a1a1aa 0.8px, transparent 0.8px)",
          backgroundSize: "24px 24px",
          maskImage: dotMask,
          WebkitMaskImage: dotMask,
        }}
      />

      {/* Ambient color blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute right-[-10%] top-[-10%] w-[30%] h-[30%] rounded-full bg-emerald-300/10 blur-[120px]" />
        <div className="absolute left-[-5%] bottom-[20%] w-[25%] h-[25%] rounded-full bg-violet-300/8 blur-[100px]" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
