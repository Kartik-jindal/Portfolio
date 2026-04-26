
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    slug: "future-of-web-interactivity",
    title: "The Future of Web Interactivity with WebGL",
    date: "March 12, 2024",
    readTime: "8 min read",
    excerpt: "Exploring how GPU-accelerated graphics are redefining user engagement in modern web architecture.",
    category: "Technical"
  },
  {
    slug: "minimalism-in-ui-design",
    title: "Minimalism in UI: Why Less is Still More",
    date: "Feb 28, 2024",
    readTime: "5 min read",
    excerpt: "A deep dive into the psychological impact of whitespace and reduced cognitive load in premium design.",
    category: "Design"
  },
  {
    slug: "scaling-nextjs-enterprise",
    title: "Scaling Next.js Applications for Enterprise",
    date: "Jan 15, 2024",
    readTime: "12 min read",
    excerpt: "Best practices for maintaining performance and developer experience in large-scale React codebases.",
    category: "Engineering"
  }
];

export default function BlogPage() {
  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      
      {/* Blog Hero Section */}
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-32"
          >
            <span className="text-primary uppercase tracking-[0.6em] text-xs font-black block mb-6">Archive of Thoughts</span>
            <h1 className="text-7xl md:text-[10rem] font-headline font-black mb-8 italic tracking-tighter leading-none">
              The <span className="text-outline">Journal</span>.
            </h1>
            <p className="text-xl md:text-3xl text-muted-foreground font-body font-light max-w-3xl leading-relaxed">
              An exploration into the intersection of code, design, and digital architecture.
            </p>
          </motion.div>

          <div className="grid gap-20">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="grid md:grid-cols-12 gap-12 items-center">
                    {/* Date/Category Sidebar */}
                    <div className="md:col-span-3 space-y-4">
                      <div className="flex items-center gap-3 text-primary">
                        <Tag className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">{post.category}</span>
                      </div>
                      <div className="h-px w-12 bg-white/10 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-muted-foreground/50 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground/50 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:col-span-7 space-y-6">
                      <h2 className="text-4xl md:text-6xl font-headline font-bold text-white group-hover:text-primary transition-colors cursor-pointer leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-xl text-muted-foreground font-body font-light leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="md:col-span-2 flex justify-end">
                      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="absolute -bottom-10 left-0 right-0 h-px bg-white/5" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
