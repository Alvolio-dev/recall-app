"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle, Mail, MessageSquare, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const topics = [
  { id: "general", label: "General question", icon: HelpCircle },
  { id: "billing", label: "Billing & subscription", icon: Mail },
  { id: "bug", label: "Bug report", icon: MessageSquare },
];

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState("general");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          re<span className="text-emerald-600 italic">call</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">Support</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            How can we <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">help?</span>
          </h1>
          <p className="text-zinc-500 text-lg font-light">
            We typically respond within 24 hours.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Topic selector */}
              <div>
                <label className="text-sm font-medium text-zinc-900 mb-2 block">What&apos;s this about?</label>
                <div className="grid grid-cols-3 gap-2">
                  {topics.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        topic === t.id
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                      }`}
                    >
                      <t.icon className="w-5 h-5" />
                      <span className="text-xs text-center">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="support-name" className="text-sm font-medium text-zinc-900 mb-2 block">Name</label>
                <input
                  id="support-name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 bg-white border border-zinc-200 rounded-xl outline-none focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="support-email" className="text-sm font-medium text-zinc-900 mb-2 block">Email</label>
                <input
                  id="support-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 bg-white border border-zinc-200 rounded-xl outline-none focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="support-message" className="text-sm font-medium text-zinc-900 mb-2 block">Message</label>
                <textarea
                  id="support-message"
                  required
                  rows={5}
                  placeholder="Tell us what's going on…"
                  className="w-full px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 bg-white border border-zinc-200 rounded-xl outline-none focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <Send className="w-4 h-4" />
                Send message
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Message sent!</h2>
              <p className="text-zinc-500 mb-8">We&apos;ll get back to you within 24 hours.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Recall
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
