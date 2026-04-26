
"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ArrowLeft, Calendar, Clock, Share2, Tag, ChevronRight, Bookmark, MessageSquare, Quote } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const blogData: Record<string, any> = {
  "future-of-web-interactivity": {
    title: "The Future of Web Interactivity with WebGL",
    date: "March 12, 2024",
    readTime: "8 min read",
    category: "Technical",
    image: "https://picsum.photos/seed/webgl/1600/900",
    imageHint: "webgl graphics",
    summary: "An exploration into how GPU-accelerated graphics are redefining user engagement in modern web architecture.",
    content: `
      <p>The web is evolving from static pages to living, breathing environments. At the heart of this transformation is WebGL—the technology that brings hardware-accelerated 3D graphics directly to the browser. We are moving away from traditional layouts into a world where spatial awareness and real-time feedback define the user experience.</p>
      
      <h3>The Shift to Spatial Web</h3>
      <p>We are no longer limited by the traditional 2D box model. As developers, we now have the power to create immersive narratives where users don't just consume content—they inhabit it. This shift requires a new mental model for design:</p>
      
      <ul>
        <li><strong>Depth Perception:</strong> Using Z-axis layering to create hierarchy and focus.</li>
        <li><strong>Real-time Physics:</strong> Making digital objects react with weight, momentum, and tactile feedback.</li>
        <li><strong>Dynamic Lighting:</strong> Setting the emotional tone through computed light sources and shadows.</li>
        <li><strong>Procedural Generation:</strong> Creating infinite variations of patterns and textures on the fly.</li>
      </ul>

      <blockquote>
        Digital architecture is the bridge between human imagination and machine execution. WebGL is the paint that makes that bridge beautiful and interactive.
      </blockquote>

      <h3>Performance and Accessibility</h3>
      <p>One of the biggest hurdles has always been performance. However, with the rise of WebGPU and more efficient GLSL shaders, we can now render millions of polygons at 60fps on mobile devices. The barrier to entry for high-end web experiences has never been lower.</p>
      
      <p>In this article, we've explored how to leverage custom shaders and GPU instances to build websites that feel like high-budget cinema. The future isn't just fast; it's visually breathtaking and deeply engaging.</p>
    `
  },
  "minimalism-in-ui-design": {
    title: "Minimalism in UI: Why Less is Still More",
    date: "Feb 28, 2024",
    readTime: "5 min read",
    category: "Design",
    image: "https://picsum.photos/seed/minimal/1600/900",
    imageHint: "minimalist design",
    summary: "A deep dive into the psychological impact of whitespace and reduced cognitive load in premium design.",
    content: `
      <p>True minimalism isn't just about white space; it's about the intentional removal of the unnecessary. In an age of information overload, simplicity is the ultimate luxury. It demands more from the designer because every remaining element must be executed with absolute precision.</p>
      
      <h3>Cognitive Load and User Peace</h3>
      <p>Every element on a screen demands attention. By reducing the number of choices and visual distractions, we allow the user's mind to rest. This leads to higher engagement and a more meaningful interaction with the core message of the application.</p>

      <blockquote>
        Minimalism is not a lack of something. It is simply the perfect amount of something. It is clarity achieved through restraint.
      </blockquote>
      
      <h3>The Pillars of Modern Premium UI</h3>
      <ul>
        <li><strong>Intentionality:</strong> Every pixel serves a functional or emotional purpose, leaving no room for decoration for its own sake.</li>
        <li><strong>Hierarchy through Space:</strong> Using gaps and margins to tell the user what's important without using bold colors or large fonts.</li>
        <li><strong>Subtle Feedback:</strong> Interactions that whisper rather than scream—smooth transitions, soft shadows, and micro-interactions.</li>
        <li><strong>Typography as Hero:</strong> Letting the typeface carry the personality of the brand.</li>
      </ul>
      
      <p>When you remove the noise, the signal becomes undeniable. That is the true power of a minimalist approach to digital architecture.</p>
    `
  },
  "scaling-nextjs-enterprise": {
    title: "Scaling Next.js Applications for Enterprise",
    date: "Jan 15, 2024",
    readTime: "12 min read",
    category: "Engineering",
    image: "https://picsum.photos/seed/scaling/1600/900",
    imageHint: "enterprise code",
    summary: "Best practices for maintaining performance and developer experience in large-scale React codebases.",
    content: `
      <p>Next.js has become the de facto standard for building production-ready React applications. But how do you handle thousands of routes and millions of concurrent users while maintaining a developer experience that doesn't slow down as the team grows?</p>
      
      <h3>Architectural Precision</h3>
      <p>Scaling starts with a clean architecture. We discuss the transition from simple Page Router patterns to the more robust App Router, leveraging Server Components for optimized data fetching and smaller client bundles.</p>

      <h3>The Four Pillars of Enterprise Scale</h3>
      <ul>
        <li><strong>Infrastructure as Code:</strong> Ensuring environments are reproducible, stable, and easily horizontally scalable.</li>
        <li><strong>Modular Domain Patterns:</strong> Breaking the monolith into manageable, testable domains.</li>
        <li><strong>Observability & Monitoring:</strong> Implementing deep tracing and performance metrics.</li>
        <li><strong>Aggressive Edge Caching:</strong> Moving data closer to the user to reduce latency globally.</li>
      </ul>

      <blockquote>
        Performance at scale is the result of a thousand small decisions made with extreme clarity. It is an engineering culture, not just a set of tools.
      </blockquote>

      <h3>Caching Strategies for the Modern Web</h3>
      <p>The secret to speed at scale is aggressive caching. From Incremental Static Regeneration (ISR) to edge middleware optimization, we dive deep into how to make your enterprise application feel instantaneous.</p>
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
        {/* Simplified Post Header */}
        <header className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex justify-center items-center gap-4 text-[10px] uppercase font-black tracking-[0.3em] text-primary">
              <span className="bg-primary/5 px-3 py-1 rounded-md border border-primary/10">
                {post.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-white/40">{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] pt-4">
              Published {post.date}
            </div>
          </motion.div>
        </header>

        {/* Cinematic Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
              data-ai-hint={post.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>

        {/* Balanced Content Body */}
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8 lg:col-start-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="prose prose-invert prose-lg max-w-none font-body text-white/70 leading-relaxed
                prose-headings:font-headline prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
                prose-h3:text-2xl md:text-3xl prose-h3:mt-12 prose-h3:mb-6
                prose-p:mb-8
                prose-blockquote:border-l-2 prose-blockquote:border-primary/50 prose-blockquote:bg-white/[0.02] prose-blockquote:py-8 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-white prose-blockquote:not-italic prose-blockquote:text-xl prose-blockquote:my-12
                prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4
                prose-li:relative prose-li:pl-8 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-primary prose-li:before:rounded-full"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <footer className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between">
              <Link href="/blog" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Journal
              </Link>
              <div className="flex gap-4">
                <button className="text-white/40 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="text-white/40 hover:text-white transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </footer>
          </div>

          {/* Simplified Meta Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-10">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Abstract</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Author</h4>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs italic">
                    KJ.
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Kartik Jindal</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/30">Architect</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-black transition-all">
              Subscribe for Updates
            </button>
          </aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}
