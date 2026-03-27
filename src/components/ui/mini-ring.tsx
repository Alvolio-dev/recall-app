"use client";

import { motion } from "framer-motion";

interface MiniRingProps {
  value: number;
  max: number;
  label: string;
  display: string;
  color: string;
  gradientTo: string;
  size?: number;
}

export function MiniRing({ value, max, label, display, color, gradientTo, size = 80 }: MiniRingProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((max - value) / max) * circumference;
  const gradientId = `ring-${label.replace(/\s/g, "")}`;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: gradientTo, stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-100"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: progress }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-zinc-900">{display}</span>
        </div>
      </div>
      <span className="text-xs text-zinc-400 font-medium">{label}</span>
    </div>
  );
}
