'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/portfolio/breadcrumbs';

export default function PostClient({ post, config }: { post: any, config: any }) {
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

  // Handle legacy single-category posts
  const postCategories = post.categories || (post.category ? [post.category] : ['Engineering']);

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar resumeUrl={config?.resume?.fileUrl} />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left"
        style={{ scaleX }}
      />

      <article className="pt-32 pb-24">
        <header className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <Breadcrumbs items={[{ label: 'Journal', href: '/blog' }, { label: post.title }]} />
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] uppercase font-black tracking-[0.3em] text-primary">
              <div className="flex flex-wrap gap-2">
                {postCategories.map((cat: string) => (
                  <span key={cat} className="bg-primary/5 px-3 py-1 rounded-md border border-primary/10">
                    {cat}
                  </span>
                ))}
              </div>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-white/40">{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight leading-[1.1] break-words">
              {post.title}
            </h1>
            
            <div className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] pt-4">
              Published {post.date}
            </div>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1600px] mx-auto px-6 mb-20"
        >
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <Image 
              src={post.image || 'https://picsum.photos/seed/blog/1600/900'} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
              data-ai-hint={post.imageHint || "blog post"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>

        <div className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-20">
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
                prose-li:relative prose-li:pl-8 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-primary prose-li:before:rounded-full break-words"
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

          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-10">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Abstract</h4>
                <p className="text-sm text-white/50 leading-relaxed break-words">
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
      <Footer config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.summary,
            "image": post.image,
            "datePublished": typeof post.createdAt === 'number' ? new Date(post.createdAt).toISOString() : (post.createdAt?.toDate ? post.createdAt.toDate().toISOString() : undefined),
            "author": {
              "@type": "Person",
              "name": "Kartik Jindal"
            }
          })
        }}
      />
    </main>
  );
}
