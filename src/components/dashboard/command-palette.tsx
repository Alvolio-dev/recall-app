"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PlusCircle,
  Library,
  Home,
  Settings,
  Mail,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
  section: "navigation" | "actions";
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    {
      id: "new",
      label: "New summary",
      icon: PlusCircle,
      action: () => router.push("/new"),
      shortcut: "N",
      section: "actions",
    },
    {
      id: "home",
      label: "Go to Dashboard",
      icon: Home,
      action: () => router.push("/dashboard"),
      section: "navigation",
    },
    {
      id: "library",
      label: "Go to Library",
      icon: Library,
      action: () => router.push("/library"),
      section: "navigation",
    },
    {
      id: "digests",
      label: "Go to Digests",
      icon: Mail,
      action: () => router.push("/digests"),
      section: "navigation",
    },
    {
      id: "settings",
      label: "Go to Settings",
      icon: Settings,
      action: () => router.push("/settings"),
      section: "navigation",
    },
  ];

  const filtered = query
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const actions = filtered.filter((c) => c.section === "actions");
  const navigation = filtered.filter((c) => c.section === "navigation");

  const allFiltered = [...actions, ...navigation];

  const runCommand = useCallback(
    (cmd: CommandItem) => {
      setOpen(false);
      setQuery("");
      cmd.action();
    },
    []
  );

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      // Global shortcuts (only when no input focused)
      const active = document.activeElement;
      const isInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement;

      if (!isInput && !open) {
        if (e.key === "n" || e.key === "N") {
          e.preventDefault();
          router.push("/new");
        }
        if (e.key === "/") {
          e.preventDefault();
          setOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, router]);

  // Handle navigation within palette
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, allFiltered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && allFiltered[selected]) {
        e.preventDefault();
        runCommand(allFiltered[selected]);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selected, allFiltered, runCommand]);

  // Reset selection when query changes
  useEffect(() => {
    setSelected(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[201] w-full max-w-lg"
          >
            <div className="mx-4 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 border-b border-zinc-100">
                <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search or jump to..."
                  className="flex-1 py-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none bg-transparent"
                />
                <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                  esc
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto py-2">
                {allFiltered.length === 0 && (
                  <p className="text-sm text-zinc-400 text-center py-8">
                    No results found
                  </p>
                )}

                {actions.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider px-4 py-1.5">
                      Actions
                    </p>
                    {actions.map((cmd, i) => (
                      <CommandRow
                        key={cmd.id}
                        cmd={cmd}
                        isSelected={i === selected}
                        onRun={() => runCommand(cmd)}
                        onHover={() => setSelected(i)}
                      />
                    ))}
                  </div>
                )}

                {navigation.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider px-4 py-1.5 mt-1">
                      Navigation
                    </p>
                    {navigation.map((cmd, i) => {
                      const globalIndex = actions.length + i;
                      return (
                        <CommandRow
                          key={cmd.id}
                          cmd={cmd}
                          isSelected={globalIndex === selected}
                          onRun={() => runCommand(cmd)}
                          onHover={() => setSelected(globalIndex)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-zinc-100 px-1 py-0.5 rounded text-[9px]">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-zinc-100 px-1 py-0.5 rounded text-[9px]">↵</kbd> select
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CommandRow({
  cmd,
  isSelected,
  onRun,
  onHover,
}: {
  cmd: CommandItem;
  isSelected: boolean;
  onRun: () => void;
  onHover: () => void;
}) {
  return (
    <button
      onClick={onRun}
      onMouseEnter={onHover}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
        isSelected
          ? "bg-emerald-50 text-emerald-700"
          : "text-zinc-700 hover:bg-zinc-50"
      )}
    >
      <cmd.icon
        className={cn(
          "w-4 h-4 flex-shrink-0",
          isSelected ? "text-emerald-600" : "text-zinc-400"
        )}
      />
      <span className="flex-1">{cmd.label}</span>
      {cmd.shortcut && (
        <kbd
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded",
            isSelected
              ? "bg-emerald-100 text-emerald-600"
              : "bg-zinc-100 text-zinc-400"
          )}
        >
          {cmd.shortcut}
        </kbd>
      )}
    </button>
  );
}
