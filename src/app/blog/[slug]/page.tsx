
"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ArrowLeft, Calendar, Clock, Share2, Tag, ChevronRight, Bookmark, MessageSquare } from 'lucide-react';
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
    imageHint: "webgl graphics",
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
    imageHint: "minimalist design",
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
    imageHint: "enterprise code",
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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left"
        style={{ scaleX }}
      />

      <article className="pt-32 pb-24">
        {/* Post Header Section */}
        <header className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link href="/blog" className="group flex items-center gap-4 text-white/40 hover:text-primary transition-colors text-[10px] uppercase font-black tracking-[0.4em]">
                  <div className="w-10 h-px bg-white/20 group-hover:bg-primary group-hover:w-14 transition-all" />
                  Journal Index
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase font-black tracking-[0.3em]">
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> {post.category}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <span className="text-white/40 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-black italic tracking-tighter leading-[0.95] text-white">
                  {post.title}
                </h1>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-4 flex lg:justify-end items-end"
            >
              <div className="flex flex-col gap-2 text-right">
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Published</span>
                <span className="text-xl font-headline font-bold text-white/60 italic">{post.date}</span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Cinematic Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1400px] mx-auto px-6 mb-24"
        >
          <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover transition-transform duration-[3s] group-hover:scale-110"
              priority
              data-ai-hint={post.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            
            {/* Architectural Accent */}
            <div className="absolute bottom-10 left-10 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white/50 backdrop-blur-xl">
                <Bookmark className="w-4 h-4" />
              </div>
              <div className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white/50 backdrop-blur-xl">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Body Grid */}
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="prose prose-invert prose-lg md:prose-xl max-w-none font-body font-light text-white/70 leading-relaxed
                prose-headings:font-headline prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
                prose-h3:text-3xl md:text-4xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:italic
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:text-white prose-blockquote:not-italic prose-blockquote:text-2xl prose-blockquote:my-12
                prose-strong:text-white prose-strong:font-bold
                prose-p:mb-6 prose-p:leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Post Footer Actions */}
            <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Spread Insight</span>
                <div className="flex gap-4">
                  {[Share2, Tag].map((Icon, i) => (
                    <button key={i} className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-white/30 hover:text-primary">
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <Link href="/blog" className="flex items-center gap-6 group">
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black tracking-[0.4em] text-white/30 block mb-1">Return To</span>
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-white group-hover:text-primary transition-colors">The Journal</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </div>
              </Link>
            </footer>
          </div>

          {/* Sidebar Meta Info */}
          <aside className="lg:col-span-4 space-y-16">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10"
            >
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Summary</h4>
                <p className="text-sm text-white/60 leading-relaxed font-body">
                  An architectural deep-dive into how we build for the modern web, focusing on performance, aesthetics, and user impact.
                </p>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {["System", "Architecture", "Design", "Future"].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Author</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div>
                    <span className="text-sm font-bold text-white block">Kartik Jindal</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Lead Architect</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="p-10 border border-white/5 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent">
              <p className="text-base italic text-white/40 leading-relaxed font-light">
                "Writing is just another form of architecture. It's about building a solid foundation of ideas."
              </p>
            </div>
          </aside>
        </div>
      </article>

      <Footer />
    </main>
  );
}
