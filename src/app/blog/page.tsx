
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Contact } from '@/components/portfolio/contact';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    title: "The Future of Web Interactivity with WebGL",
    date: "March 12, 2024",
    readTime: "8 min read",
    excerpt: "Exploring how GPU-accelerated graphics are redefining user engagement in modern web architecture.",
    category: "Technical"
  },
  {
    title: "Minimalism in UI: Why Less is Still More",
    date: "Feb 28, 2024",
    readTime: "5 min read",
    excerpt: "A deep dive into the psychological impact of whitespace and reduced cognitive load in premium design.",
    category: "Design"
  },
  {
    title: "Scaling Next.js Applications for Enterprise",
    date: "Jan 15, 2024",
    readTime: "12 min read",
    excerpt: "Best practices for maintaining performance and developer experience in large-scale React codebases.",
    category: "Engineering"
  }
];

export default function BlogPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <section className="pt-48 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24"
          >
            <span className="text-accent uppercase tracking-widest text-sm font-bold block mb-4">Writings</span>
            <h1 className="text-6xl md:text-8xl font-headline font-black mb-8 italic">Journal</h1>
            <p className="text-xl text-muted-foreground font-body">Thoughts on design, technology, and the intersection of both.</p>
          </motion.div>

          <div className="space-y-12">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group border-b border-white/5 pb-12 last:border-0"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-primary">
                      <span>{post.category}</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-muted-foreground">{post.date}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold group-hover:text-accent transition-colors cursor-pointer">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground font-body leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-sm uppercase tracking-widest font-black text-white group-hover:text-accent transition-colors cursor-pointer">
                    Read Post <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      <Contact />
    </main>
  );
}
