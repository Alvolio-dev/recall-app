"use client";

import { motion } from "framer-motion";
import { BlogCard } from "@/components/ui/blog-card";
import { posts } from "@/lib/blog-data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          re<span className="text-emerald-600 italic">call</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">Blog</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-zinc-900">
            Learn to learn <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">better.</span>
          </h1>
          <p className="text-zinc-500 text-lg font-light max-w-md mx-auto">
            Tips, research, and ideas on getting more from what you watch.
          </p>
        </motion.div>

        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <Link href={`/blog/${posts[0].slug}`}>
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-md hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
                  <img
                    src={posts[0].image}
                    alt={posts[0].title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <div className="flex gap-2 mb-4">
                    {posts[0].tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500">Featured</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-zinc-500 leading-relaxed mb-6">{posts[0].excerpt}</p>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-medium text-zinc-600">
                      {posts[0].author.initials}
                    </div>
                    <span className="font-medium text-zinc-600">{posts[0].author.name}</span>
                    <span>·</span>
                    <span>{posts[0].date}</span>
                    <span>·</span>
                    <span>{posts[0].readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(1).map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
