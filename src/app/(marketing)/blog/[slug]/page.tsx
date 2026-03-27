"use client";

import { useParams } from "next/navigation";
import { posts } from "@/lib/blog-data";
import Link from "next/link";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.image,
            datePublished: new Date(post.date).toISOString(),
            author: {
              "@type": "Person",
              name: post.author.name,
            },
            publisher: {
              "@type": "Organization",
              name: "Recall",
              url: "https://getrecall.app",
            },
            mainEntityOfPage: `https://getrecall.app/blog/${post.slug}`,
          }),
        }}
      />
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <Link href="/"><Logo size="sm" /></Link>
        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All articles
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-zinc-400 mb-6">
            <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-zinc-700 transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-600 truncate max-w-[200px]">{post.title}</span>
          </nav>

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
            <div className="relative aspect-[2/1]">
              <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
            </div>
          </div>

          {/* Article body */}
          <div className="max-w-none">
            <p className="text-lg text-zinc-600 leading-relaxed mb-8">
              {post.excerpt}
            </p>
            {post.body?.map((block, i) => {
              switch (block.type) {
                case "h2":
                  return <h2 key={i} className="text-xl font-bold text-zinc-900 mt-10 mb-4">{block.text}</h2>;
                case "h3":
                  return <h3 key={i} className="text-lg font-semibold text-zinc-800 mt-8 mb-3">{block.text}</h3>;
                case "quote":
                  return <blockquote key={i} className="border-l-2 border-emerald-400 pl-4 my-6 text-zinc-600 italic">{block.text}</blockquote>;
                case "p":
                default:
                  return <p key={i} className="text-zinc-500 leading-relaxed mb-6">{block.text}</p>;
              }
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl border border-zinc-200 bg-zinc-50 text-center flex flex-col items-center">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Ready to remember more?</h3>
            <p className="text-zinc-500 text-sm mb-6">Try Recall free. No account needed.</p>
            <Link href="/">
              <MotionButton label="Try Recall" className="w-40" />
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
