"use client";

import { FC } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MotionButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
}

const MotionButton: FC<MotionButtonProps> = ({ label, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative h-auto w-48 cursor-pointer rounded-full border-none p-1 outline-none bg-[#fafafa]",
        "focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        className
      )}
    >
      <span
        className="block h-10 w-10 overflow-hidden rounded-full bg-zinc-900 transition-all duration-500 group-hover:w-full"
        aria-hidden="true"
      />
      <div className="absolute top-1/2 left-3.5 -translate-y-1/2 transition-transform duration-500 group-hover:translate-x-1.5">
        <ArrowRight className="w-5 h-5 text-white" />
      </div>
      <span className="absolute top-1/2 left-1/2 ml-3 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-zinc-900 whitespace-nowrap transition-colors duration-500 group-hover:text-white">
        {label}
      </span>
    </button>
  );
};

export { MotionButton };
