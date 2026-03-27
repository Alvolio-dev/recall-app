"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock, Star, ListOrdered, MessageSquare, FolderOpen, Mail, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureNode {
  id: number;
  title: string;
  content: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "core" | "pro" | "new";
  color: string;
  example: string;
}

const featureData: FeatureNode[] = [
  {
    id: 1,
    title: "Worth my time?",
    content: "A 3-sentence verdict. What the video covers, who it\'s for, whether it delivers. Decide in 10 seconds.",
    icon: Clock,
    relatedIds: [2, 3],
    status: "core",
    color: "#10b981",
    example: "Worth watching for espresso beginners — first 20 min are gold.",
  },
  {
    id: 2,
    title: "Key takeaways",
    content: "The 5-7 ideas that matter, with timestamps so you can jump straight to the moment it\'s discussed.",
    icon: Star,
    relatedIds: [1, 4],
    status: "core",
    color: "#8b5cf6",
    example: "1. Grind size is the highest-leverage variable → 3:12",
  },
  {
    id: 3,
    title: "Step by step",
    content: "A numbered action list you can actually follow. No filler, no preamble. Just what to do and in what order.",
    icon: ListOrdered,
    relatedIds: [1, 4],
    status: "new",
    color: "#f97316",
    example: "1. Set grinder to medium-fine  2. Pull test shot at 18g",
  },
  {
    id: 4,
    title: "Ask follow-ups",
    content: "Not sure about something? Ask anything and Recall answers from the transcript directly.",
    icon: MessageSquare,
    relatedIds: [2, 3],
    status: "core",
    color: "#10b981",
    example: "\"What grinder does he recommend?\" → Niche Zero, at 24:10",
  },
  {
    id: 5,
    title: "Your library",
    content: "Every summary you\'ve created, saved and searchable. Never lose a good idea buried in a tab.",
    icon: FolderOpen,
    relatedIds: [6],
    status: "core",
    color: "#8b5cf6",
    example: "Search across all your summaries instantly.",
  },
  {
    id: 6,
    title: "Weekly digest",
    content: "Every Sunday, a recap of what you watched and what you learned. Your knowledge, made visible.",
    icon: Mail,
    relatedIds: [5],
    status: "pro",
    color: "#f97316",
    example: "3 themes this week: espresso, running form, sourdough.",
  },
];

export function Features() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [, forceUpdate] = useState(0);

  const updatePositions = useCallback(() => {
    const total = featureData.length;
    const radius = 180;
    nodeRefs.current.forEach((node, index) => {
      if (!node) return;
      const angle = ((index / total) * 360 + angleRef.current) % 360;
      const radian = (angle * Math.PI) / 180;
      const x = radius * Math.cos(radian);
      const y = radius * Math.sin(radian);
      const zIndex = Math.round(100 + 50 * Math.cos(radian));
      const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2)));
      node.style.transform = `translate(${x}px, ${y}px)`;
      node.style.zIndex = String(zIndex);
      node.style.opacity = String(opacity);
    });
  }, []);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedId(null);
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      setAutoRotate(true);
    } else {
      setExpandedId(id);
      setAutoRotate(false);
      const idx = featureData.findIndex((f) => f.id === id);
      const targetAngle = (idx / featureData.length) * 360;
      angleRef.current = 270 - targetAngle;
      updatePositions();
      forceUpdate((n) => n + 1);
    }
  };

  useEffect(() => {
    if (!autoRotate) return;
    let lastTime = performance.now();
    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      angleRef.current = (angleRef.current + delta * 0.012) % 360;
      updatePositions();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoRotate, updatePositions]);


  const getStatusLabel = (status: string) => {
    switch (status) {
      case "core": return "Core";
      case "pro": return "Pro";
      case "new": return "New";
      default: return "";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "core": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "pro": return "bg-orange-50 text-orange-700 border border-orange-200";
      case "new": return "bg-violet-50 text-violet-700 border border-violet-200";
      default: return "";
    }
  };

  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-1 md:order-2"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">What it does</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900">
            One link does <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">a lot.</span>
          </h2>
          <p className="text-zinc-500 text-base font-light leading-relaxed mb-4">
            Summaries, takeaways, follow-ups, and more — all from one YouTube link.
          </p>
          <p className="text-zinc-400 text-sm">Click a node to explore each feature.</p>
        </motion.div>

        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className="relative w-full h-[500px] flex items-center justify-center order-2 md:order-1"
        >
          <div
            ref={orbitRef}
            className="absolute w-full h-full flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            {/* Center orb */}
            <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center z-10 shadow-lg shadow-emerald-200">
              <div className="absolute w-18 h-18 rounded-full border border-emerald-300/30 animate-ping opacity-50" style={{ width: 72, height: 72 }} />
              <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md" />
            </div>

            {/* Orbit ring */}
            <div className="absolute w-[360px] h-[360px] rounded-full border border-zinc-200/60" />

            {/* Nodes */}
            {featureData.map((feature, index) => {
              const isExpanded = expandedId === feature.id;
              const isRelated = expandedId !== null && featureData.find(f => f.id === expandedId)?.relatedIds.includes(feature.id);
              const Icon = feature.icon;

              return (
                <div
                  key={feature.id}
                  ref={(el) => { nodeRefs.current[index] = el; }}
                  className="absolute cursor-pointer"
                  style={isExpanded ? { zIndex: 200, opacity: 1 } : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(feature.id);
                  }}
                >
                  {/* Glow */}
                  <div
                    className={`absolute rounded-full ${isRelated ? "animate-pulse" : ""}`}
                    style={{
                      background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
                      width: 60,
                      height: 60,
                      left: -10,
                      top: -10,
                    }}
                  />

                  {/* Node circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isExpanded
                        ? "bg-zinc-900 text-white border-zinc-900 scale-125 shadow-lg"
                        : isRelated
                        ? "bg-white text-zinc-900 border-zinc-400 animate-pulse"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Label */}
                  <div className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isExpanded ? "text-zinc-900" : "text-zinc-500"
                  }`}>
                    {feature.title}
                  </div>

                  {/* Expanded card */}
                  {isExpanded && (
                    <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-white/95 backdrop-blur-lg border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-visible z-50">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-zinc-300" />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Badge className={`px-2 text-[10px] ${getStatusStyle(feature.status)}`}>
                            {getStatusLabel(feature.status)}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm mt-2 text-zinc-900">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-zinc-600">
                        <p className="leading-relaxed">{feature.content}</p>

                        <div className="mt-3 pt-3 border-t border-zinc-100">
                          <p className="text-[10px] font-medium text-zinc-400 mb-1.5">Example output</p>
                          <p className="text-xs italic" style={{ color: feature.color }}>{feature.example}</p>
                        </div>

                        {feature.relatedIds.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-zinc-100">
                            <p className="text-[10px] font-medium text-zinc-400 mb-1.5">Related features</p>
                            <div className="flex flex-wrap gap-1">
                              {feature.relatedIds.map((relId) => {
                                const rel = featureData.find((f) => f.id === relId);
                                return (
                                  <button
                                    key={relId}
                                    className="flex items-center h-6 px-2 text-[10px] rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(relId);
                                    }}
                                  >
                                    {rel?.title}
                                    <ArrowRight size={8} className="ml-1 text-zinc-400" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
