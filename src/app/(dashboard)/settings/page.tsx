"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { Crown, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "true";
  const { toast } = useToast();
  const [plan] = useState<"FREE" | "PRO">(upgraded ? "PRO" : "FREE");
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast(data.error || "Failed to start checkout", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setUpgrading(false);
    }
  };

  const handleManage = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast("Could not open billing portal", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your account and subscription.
        </p>
      </div>

      {/* Upgrade success */}
      {upgraded && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700"
        >
          <Check className="w-4 h-4 flex-shrink-0" />
          Welcome to Pro! Your 7-day free trial has started.
        </motion.div>
      )}

      {/* Subscription */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-semibold text-zinc-900">Subscription</h2>
        </div>

        {plan === "PRO" ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-zinc-900">Pro plan</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Unlimited follow-ups, saved library, weekly digests and export.
            </p>
            <button
              onClick={handleManage}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Manage subscription
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-zinc-500 mb-4">
              You are on the Free plan. Upgrade for unlimited follow-ups, saved library, weekly digests and export.
            </p>

            {/* Interval toggle */}
            <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg w-fit mb-4">
              <button
                onClick={() => setInterval("month")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-colors",
                  interval === "month"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval("year")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                  interval === "year"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                )}
              >
                Yearly
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">
                  -33%
                </span>
              </button>
            </div>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-zinc-900">
                ${interval === "year" ? "1.99" : "2.99"}
              </span>
              <span className="text-sm text-zinc-400">/mo</span>
              {interval === "year" && (
                <span className="text-xs text-zinc-400 ml-2">
                  Billed $23.88/year
                </span>
              )}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {upgrading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Crown className="w-4 h-4" />
              )}
              Start 7-day free trial
            </button>
            <p className="text-[10px] text-zinc-400 mt-2">
              Cancel anytime. No charge during trial.
            </p>
          </div>
        )}
      </div>

      {/* Account (Clerk) */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Account</h2>
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "shadow-none border-0 w-full",
              navbar: "hidden",
              pageScrollBox: "p-0",
            },
          }}
        />
      </div>
    </div>
  );
}
