"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is Recall?",
    answer:
      "Recall is an AI-powered tool that turns YouTube videos into concise, structured summaries. Paste any YouTube link and get key takeaways, step-by-step breakdowns, and a quick verdict on whether the video is worth your time.",
  },
  {
    question: "What types of YouTube videos work best?",
    answer:
      "Recall works with any YouTube video that has captions or subtitles available. It's especially useful for educational content, tutorials, podcasts, lectures, and long-form videos. If a video doesn't have captions, Recall won't be able to generate a summary.",
  },
  {
    question: "What are the three summary modes?",
    answer:
      "Recall offers three ways to summarise a video. \"Worth my time?\" gives you a 3-sentence verdict so you can decide in seconds. \"Key takeaways\" pulls out the 5\u20137 most important ideas with timestamps. \"Step by step\" creates a numbered action list you can follow along with.",
  },
  {
    question: "Do I need an account to use Recall?",
    answer:
      "No. You can try Recall with one free summary, no sign-up needed. Upgrading to Pro unlocks unlimited summaries, follow-up questions, your saved library, weekly digests, and more.",
  },
  {
    question: "What's the difference between Free and Pro?",
    answer:
      "The free tier lets you try one summary in any mode so you can see how Recall works. Pro gives you unlimited summaries, unlimited follow-up questions, a saved library across sessions, weekly digest emails, export to Markdown and Notion, cross-video topic synthesis, and priority support.",
  },
  {
    question: "How much does Pro cost?",
    answer:
      "Pro is $2.99/month or $23.88/year (that's $1.99/month, a 33% saving). There's a 7-day free trial and you can cancel anytime.",
  },
  {
    question: "What are follow-up questions?",
    answer:
      "After generating a summary, you can ask Recall anything about the video and it will answer directly from the transcript. It's like having a conversation with the video. Free users get 2 follow-ups per video, Pro users get unlimited.",
  },
  {
    question: "What is the weekly digest?",
    answer:
      "Every Sunday, Pro users receive an email recap of what they watched and learned that week. It's a great way to reinforce what you've picked up without re-watching anything.",
  },
  {
    question: "Can I export my summaries?",
    answer:
      "Pro users can export summaries to Markdown and Notion. This makes it easy to save summaries into your existing note-taking workflow.",
  },
  {
    question: "What YouTube URL formats are supported?",
    answer:
      "Recall supports all common YouTube URL formats including youtube.com/watch?v=, youtu.be/ short links, youtube.com/live/ livestreams, and youtube.com/shorts/. You can also paste just the 11-character video ID.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. We don't store video content \u2014 only the summaries you generate. Your data is never shared with third parties. You can read our full privacy policy for more details.",
  },
  {
    question: "How do I cancel my Pro subscription?",
    answer:
      "You can cancel anytime from your account settings. You'll keep Pro access until the end of your current billing period. No questions asked.",
  },
];

function FaqAccordion({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-start justify-between gap-4 text-left py-5 transition-colors",
          index > 0 && "border-t border-zinc-200"
        )}
        aria-expanded={open}
      >
        <span className="text-base font-medium text-zinc-900 pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5 transition-transform duration-200",
            open && "rotate-180 text-emerald-500"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-zinc-500 leading-relaxed pb-5">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            Frequently asked{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
              questions
            </span>
          </h1>
          <p className="text-zinc-500 text-lg font-light">
            Everything you need to know about Recall.
          </p>
        </motion.div>

        <div className="bg-white border border-zinc-200 rounded-2xl px-6">
          {faqs.map((faq, i) => (
            <FaqAccordion key={i} item={faq} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-zinc-500 mb-3">
            Still have questions?
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
          >
            Get in touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
