"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  date: string;
  readTime: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
  className?: string;
  index?: number;
}

export function BlogCard({ post, className, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn("w-full", className)}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="group relative h-full overflow-hidden rounded-2xl border-zinc-200/80 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-20" />

            <div className="absolute bottom-3 left-3 flex gap-2">
              {post.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-white/70 backdrop-blur-sm text-zinc-600 border border-zinc-200/50"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white shadow-lg"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Read article
              </motion.span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 p-5">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold leading-tight tracking-tight text-zinc-900 transition-colors group-hover:text-emerald-600">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-sm text-zinc-500 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 border border-zinc-200/50">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-xs">
                  <span className="font-medium text-zinc-700">{post.author.name}</span>
                  <span className="text-zinc-400">{post.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Clock className="h-3 w-3" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
