"use client";

import { useParams } from "next/navigation";
import { posts } from "@/lib/blog-data";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { MotionButton } from "@/components/ui/motion-button";

export default function BlogPostPage() {
  const params = useParams();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Post not found</h1>
          <Link href="/blog" className="text-emerald-600 hover:underline text-sm">Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          re<span className="text-emerald-600 italic">call</span>
        </Link>
        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All articles
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author + meta */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-200">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-medium text-zinc-600">
              {post.author.initials}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">{post.author.name}</p>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>{post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10 border border-zinc-200">
            <img src={post.image} alt={post.title} className="w-full aspect-[2/1] object-cover" />
          </div>

          {/* Article body (placeholder) */}
          <div className="prose prose-zinc max-w-none">
            <p className="text-lg text-zinc-600 leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <p className="text-zinc-500 leading-relaxed mb-6">
              This is where the full article content would go. For now, this is a placeholder to show the layout and typography. The actual content would be pulled from a CMS or markdown files.
            </p>
            <h2 className="text-xl font-bold text-zinc-900 mt-10 mb-4">The problem with passive watching</h2>
            <p className="text-zinc-500 leading-relaxed mb-6">
              Most of us treat YouTube like background noise. We hit play, half-watch, and move on. But the videos we choose to watch — the tutorials, the lectures, the deep dives — deserve better. They contain ideas we wanted to learn. The gap isn&apos;t motivation. It&apos;s the lack of a system.
            </p>
            <h2 className="text-xl font-bold text-zinc-900 mt-10 mb-4">A better approach</h2>
            <p className="text-zinc-500 leading-relaxed mb-6">
              What if every video you watched came with a summary tailored to your needs? Not a generic transcript, but the actual ideas — distilled, timestamped, and ready to reference later. That&apos;s what Recall does, and it changes the way you think about video content entirely.
            </p>
            <h2 className="text-xl font-bold text-zinc-900 mt-10 mb-4">Try it yourself</h2>
            <p className="text-zinc-500 leading-relaxed mb-6">
              Paste any YouTube link into Recall and see the difference. No account needed, no credit card. Just the ideas that matter.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-zinc-900 text-center flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to remember more?</h3>
            <p className="text-zinc-400 text-sm mb-6">Try Recall free — no account needed.</p>
            <Link href="/">
              <MotionButton label="Try Recall" className="w-40" />
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
