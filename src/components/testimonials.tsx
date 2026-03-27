"use client";

import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

const col1: Testimonial[] = [
  { text: "I used to take notes during every lecture video. Now I paste the link and get better notes than I ever wrote myself.", name: "Emma Liu", role: "PhD Researcher", initials: "EL", color: "bg-emerald-500" },
  { text: "The step-by-step mode is incredible. I followed a 40-minute coding tutorial in 10 minutes flat.", name: "Marcus K.", role: "Junior Developer", initials: "MK", color: "bg-orange-500" },
  { text: "Worth my time mode saves me at least an hour a day. I wish this existed when I was in uni.", name: "Kira Reddy", role: "Product Designer", initials: "KR", color: "bg-violet-500" },
  { text: "I watch 10+ videos a week and now I actually know what I learned. The digest connects the dots for me.", name: "Tom Chen", role: "Content Creator", initials: "TC", color: "bg-blue-500" },
];

const col2: Testimonial[] = [
  { text: "Saved me 2 hours this week alone. I just paste links and Recall does the rest.", name: "Jamie L.", role: "Marketing Manager", initials: "JL", color: "bg-teal-500" },
  { text: "The timestamps are clutch. I can jump straight to the part that matters instead of scrubbing through.", name: "Aisha T.", role: "Data Analyst", initials: "AT", color: "bg-pink-500" },
  { text: "I use it for every lecture video. My GPA genuinely went up this semester.", name: "Nina W.", role: "Med Student", initials: "NW", color: "bg-emerald-600" },
  { text: "Better than any note-taking app I've tried. And I've tried all of them.", name: "Dan P.", role: "Freelance Writer", initials: "DP", color: "bg-purple-500" },
];

const col3: Testimonial[] = [
  { text: "The weekly digest changed everything. It's like having a personal research assistant.", name: "Sarah R.", role: "UX Researcher", initials: "SR", color: "bg-violet-600" },
  { text: "I was skeptical about AI summaries but Recall actually captures the nuance. Really impressed.", name: "Liam O.", role: "Teacher", initials: "LO", color: "bg-amber-500" },
  { text: "Follow-up questions are a game changer. I asked what grinder was recommended and got the exact timestamp.", name: "Priya M.", role: "Home Barista", initials: "PM", color: "bg-rose-500" },
  { text: "I recommend Recall to every student I mentor. It's the tool I wish I had.", name: "Dr. James H.", role: "Professor", initials: "JH", color: "bg-cyan-600" },
];

function TestimonialsColumn({ testimonials, duration = 20, className }: { testimonials: Testimonial[]; duration?: number; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-4 pb-4"
      >
        {[0, 1].map((_, idx) => (
          <React.Fragment key={idx}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-300 max-w-xs w-full"
              >
                <p className="text-sm text-zinc-600 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-zinc-100">
                  <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 leading-tight">{t.name}</p>
                    <p className="text-xs text-zinc-400 leading-tight">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 mb-4">What people are saying</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900">
            Trusted by curious <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">minds.</span>
          </h2>
          <p className="text-zinc-500 text-lg font-light max-w-md mx-auto">
            Students, researchers, creators — anyone who watches to learn.
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 max-h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
          <TestimonialsColumn testimonials={col1} duration={18} className="hidden md:block" />
          <TestimonialsColumn testimonials={col2} duration={22} />
          <TestimonialsColumn testimonials={col3} duration={16} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
