
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ArrowLeft, Calendar, Clock, Share2, Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

// Mock post lookup
const blogData: Record<string, any> = {
  "future-of-web-interactivity": {
    title: "The Future of Web Interactivity with WebGL",
    date: "March 12, 2024",
    readTime: "8 min read",
    category: "Technical",
    image: "https://picsum.photos/seed/webgl/1600/900",
    content: `
      <p>The web is evolving from static pages to living, breathing environments. At the heart of this transformation is WebGL—the technology that brings hardware-accelerated 3D graphics directly to the browser.</p>
      
      <h3>The Shift to Spatial Web</h3>
      <p>We are no longer limited by the traditional 2D box model. As developers, we now have the power to create immersive narratives where users don't just consume content—they inhabit it. From high-fidelity product configurators to data visualizations that span virtual galaxies, the possibilities are infinite.</p>

      <blockquote>
        "Digital architecture is the bridge between human imagination and machine execution. WebGL is the paint that makes that bridge beautiful."
      </blockquote>

      <h3>Performance and Accessibility</h3>
      <p>One of the biggest hurdles has always been performance. However, with the rise of WebGPU and more efficient GLSL shaders, we can now render millions of polygons at 60fps on mobile devices. The barrier to entry for high-end web experiences has never been lower.</p>
      
      <p>In this article, we'll explore how to leverage custom shaders and GPU instances to build websites that feel like high-budget cinema.</p>
    `
  },
  "minimalism-in-ui-design": {
    title: "Minimalism in UI: Why Less is Still More",
    date: "Feb 28, 2024",
    readTime: "5 min read",
    category: "Design",
    image: "https://picsum.photos/seed/minimal/1600/900",
    content: `
      <p>True minimalism isn't just about white space; it's about the intentional removal of the unnecessary. In an age of information overload, simplicity is the ultimate luxury.</p>
      
      <h3>Cognitive Load and User Peace</h3>
      <p>Every element on a screen demands attention. By reducing the number of choices and visual distractions, we allow the user's mind to rest. This leads to higher engagement and a more meaningful interaction with the core message.</p>
      
      <h3>The "Silent" UI</h3>
      <p>Modern premium designs are moving toward a 'silent' interface. Typography becomes the main character, and motion provides the personality. We explore how leading luxury brands are using whitespace as a functional tool rather than just an aesthetic choice.</p>
    `
  },
  "scaling-nextjs-enterprise": {
    title: "Scaling Next.js Applications for Enterprise",
    date: "Jan 15, 2024",
    readTime: "12 min read",
    category: "Engineering",
    image: "https://picsum.photos/seed/scaling/1600/900",
    content: `
      <p>Next.js has become the de facto standard for building production-ready React applications. But how do you handle thousands of routes and millions of concurrent users?</p>
      
      <h3>Architectural Precision</h3>
      <p>Scaling starts with a clean architecture. We discuss the transition from simple Page Router patterns to the more robust App Router, leveraging Server Components for optimized data fetching and smaller client bundles.</p>
      
      <h3>Caching Strategies</h3>
      <p>The secret to speed at scale is aggressive caching. From Incremental Static Regeneration (ISR) to edge middleware optimization, we dive deep into how to make your enterprise app feel instantaneous across the globe.</p>
    `
  }
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogData[slug as string];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-headline font-bold text-white">Post not found</h1>
          <Link href="/blog" className="text-primary uppercase tracking-widest font-black text-xs inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />

      <article className="pt-32 pb-24">
        {/* Post Header */}
        <header className="max-w-4xl mx-auto px-6 mb-16 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/blog" className="group flex items-center gap-4 text-white/40 hover:text-primary transition-colors text-[10px] uppercase font-black tracking-[0.4em]">
              <div className="w-10 h-px bg-white/20 group-hover:bg-primary group-hover:w-14 transition-all" />
              Back to Journal
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase font-black tracking-[0.3em] text-primary">
              <span className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20"><Tag className="w-3.5 h-3.5" /> {post.category}</span>
              <span className="flex items-center gap-2 text-white/50"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
              <span className="flex items-center gap-2 text-white/50"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-headline font-black italic tracking-tighter leading-tight text-white">
              {post.title}
            </h1>
          </motion.div>
        </header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>

        {/* Content Body */}
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert prose-lg md:prose-xl max-w-none font-body font-light text-white/70 leading-relaxed
              prose-headings:font-headline prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
              prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-6 prose-blockquote:px-10 prose-blockquote:rounded-2xl prose-blockquote:italic prose-blockquote:text-white prose-blockquote:not-italic
              prose-strong:text-white prose-strong:font-bold
              prose-h3:text-3xl md:text-4xl prose-h3:mt-20 prose-h3:mb-8
              prose-p:mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Post Footer */}
          <footer className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30">Share Insight</span>
              <div className="flex gap-3">
                {[Share2, Tag].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-white/40 hover:text-primary">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <Link href="/blog" className="flex items-center gap-4 group">
              <span className="text-sm font-black uppercase tracking-[0.3em] text-white/60 group-hover:text-primary transition-colors">Next Insight</span>
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ChevronRight className="w-6 h-6" />
              </div>
            </Link>
          </footer>
        </div>
      </article>

      <Footer />
    </main>
  );
}
