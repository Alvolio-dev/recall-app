import { Clock, Star, ListOrdered } from "lucide-react";

export const SUMMARY_MODES = [
  { id: "verdict", label: "Worth my time?", icon: Clock, color: "emerald" },
  { id: "takeaways", label: "Key takeaways", icon: Star, color: "violet" },
  { id: "steps", label: "Step by step", icon: ListOrdered, color: "orange" },
] as const;

export const COLOR_MAP = {
  emerald: {
    tab: "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100",
    panel: "border-emerald-200 bg-emerald-50/30 border-l-4 border-l-emerald-400",
  },
  violet: {
    tab: "bg-zinc-900 border-zinc-900 text-white shadow-sm",
    panel: "border-violet-200 bg-violet-50/30 border-l-4 border-l-violet-400",
  },
  orange: {
    tab: "bg-orange-50 border-orange-200 text-orange-700 shadow-sm shadow-orange-100",
    panel: "border-orange-200 bg-orange-50/30 border-l-4 border-l-orange-400",
  },
} as const;
