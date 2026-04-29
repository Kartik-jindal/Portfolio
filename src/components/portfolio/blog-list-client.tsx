'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Tag, Bookmark, Search, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogListClientProps {
  posts: any[];
}

// ─── Shared meta row ─────────────────────────────────────────────────────────
const PostMeta = ({ post }: { post: any }) => (
  <div className="flex items-center gap-6 text-white/40">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
      <Calendar className="w-3.5 h-3.5 text-primary/40" />
      <span>{post.date}</span>
    </div>
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
      <Clock className="w-3.5 h-3.5 text-primary/40" />
      <span>{post.readTime}</span>
    </div>
  </div>
);

// ─── Shared categories row ────────────────────────────────────────────────────
const PostCategories = ({ post }: { post: any }) => (
  <div className="flex flex-wrap items-center gap-3">
    {(post.categories || (post.category ? [post.category] : ['Engineering'])).map((cat: string) => (
      <div key={cat} className="flex items-center gap-2 text-primary">
        <Tag className="w-3 h-3" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">{cat}</span>
      </div>
    ))}
  </div>
);

// ─── Featured badge ───────────────────────────────────────────────────────────
const FeaturedBadge = () => (
  <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-primary/10 border border-primary/20 backdrop-blur-xl rounded-full px-4 py-2">
    <Bookmark className="w-3 h-3 text-primary" />
    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Featured</span>
  </div>
);

// ─── 1 featured: full-width cinematic card (original design) ─────────────────
const FeaturedSingle = ({ post, index }: { post: any; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    className="group relative"
  >
    <Link
      href={`/blog/${post.slug || post.id}`}
      className="block relative z-10 rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-700 bg-white/[0.02]"
    >
      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        {/* Image */}
        <div className="relative lg:w-[55%] aspect-[16/9] lg:aspect-auto overflow-hidden shrink-0">
          <Image
            src={post.image || `https://picsum.photos/seed/${post.id}/1200/800`}
            alt={post.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            sizes="(min-width: 1024px) 55vw, 100vw"
            data-ai-hint={post.imageHint || "featured blog"}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${index % 2 === 0 ? 'from-transparent to-background/80' : 'from-background/80 to-transparent'} hidden lg:block`} />
          <FeaturedBadge />
        </div>

        {/* Content */}
        <div className="lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8">
          <PostCategories post={post} />
          <div className="h-px w-8 bg-white/20 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-white group-hover:text-primary transition-colors duration-500 leading-tight tracking-tight break-words">
            {post.title}
          </h2>
          <p className="text-lg text-white/60 font-body font-light leading-relaxed line-clamp-3 break-words">
            {post.summary}
          </p>
          <PostMeta post={post} />
          <div className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors duration-500">
            Read Article
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.article>
);

// ─── Grid card: vertical stack (used in 2, 3, 4 layouts) ─────────────────────
const FeaturedGridCard = ({ post, index, large = false }: { post: any; index: number; large?: boolean }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    className="group relative h-full"
  >
    <Link
      href={`/blog/${post.slug || post.id}`}
      className="flex flex-col h-full rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-700 bg-white/[0.02]"
    >
      {/* Image */}
      <div className={`relative w-full overflow-hidden shrink-0 ${large ? 'aspect-[16/9]' : 'aspect-[16/9]'}`}>
        <Image
          src={post.image || `https://picsum.photos/seed/${post.id}/1200/800`}
          alt={post.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          sizes="(min-width: 1024px) 50vw, 100vw"
          data-ai-hint={post.imageHint || "featured blog"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        <FeaturedBadge />
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 justify-between ${large ? 'p-10 md:p-12 space-y-6' : 'p-8 space-y-5'}`}>
        <div className="space-y-4">
          <PostCategories post={post} />
          <div className="h-px w-8 bg-white/20 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
          <h2 className={`font-headline font-bold text-white group-hover:text-primary transition-colors duration-500 leading-tight tracking-tight break-words ${large ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
            {post.title}
          </h2>
          <p className={`text-white/60 font-body font-light leading-relaxed break-words line-clamp-2 ${large ? 'text-base' : 'text-sm'}`}>
            {post.summary}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <PostMeta post={post} />
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shrink-0">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  </motion.article>
);

// ─── Featured section: picks the right layout based on count ─────────────────
const FeaturedSection = ({ posts }: { posts: any[] }) => {
  const count = posts.length; // already capped at 4

  if (count === 1) {
    // Original full-width cinematic card
    return (
      <div>
        <FeaturedSingle post={posts[0]} index={0} />
      </div>
    );
  }

  if (count === 2) {
    // 2-column equal grid
    return (
      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((post, i) => (
          <FeaturedGridCard key={post.id} post={post} index={i} large />
        ))}
      </div>
    );
  }

  if (count === 3) {
    // Large card left (col-span-7) + 2 stacked smaller cards right (col-span-5)
    return (
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 h-full">
          <FeaturedGridCard post={posts[0]} index={0} large />
        </div>
        <div className="lg:col-span-5 grid grid-rows-2 gap-8">
          <FeaturedGridCard post={posts[1]} index={1} />
          <FeaturedGridCard post={posts[2]} index={2} />
        </div>
      </div>
    );
  }

  // count === 4: 2×2 grid
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {posts.map((post, i) => (
        <FeaturedGridCard key={post.id} post={post} index={i} />
      ))}
    </div>
  );
};

// ─── Blog List ────────────────────────────────────────────────────────────────
export const BlogListClient = ({ posts }: BlogListClientProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Cap featured at 4
  const allFeatured = posts.filter((p) => p.featured).slice(0, 4);
  const regularPosts = posts.filter((p) => !p.featured);

  // Derive unique categories from all posts
  const allCategories = ['All', ...Array.from(
    new Set(
      posts.flatMap((p) =>
        p.categories || (p.category ? [p.category] : ['Engineering'])
      )
    )
  )];

  // Search matcher — title, summary, categories
  const matchesSearch = (post: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const cats = (post.categories || (post.category ? [post.category] : ['Engineering'])) as string[];
    return (
      post.title?.toLowerCase().includes(q) ||
      post.summary?.toLowerCase().includes(q) ||
      cats.some((c) => c.toLowerCase().includes(q))
    );
  };

  // Filter regular posts by active category + search
  const filteredRegular = regularPosts.filter((p) => {
    const catMatch = activeCategory === 'All' ||
      (p.categories || (p.category ? [p.category] : ['Engineering'])).includes(activeCategory);
    return catMatch && matchesSearch(p);
  });

  // Filter featured by active category + search
  const visibleFeatured = allFeatured.filter((p) => {
    const catMatch = activeCategory === 'All' ||
      (p.categories || (p.category ? [p.category] : ['Engineering'])).includes(activeCategory);
    return catMatch && matchesSearch(p);
  });

  const showFeatured = visibleFeatured.length > 0;
  const showRegular = filteredRegular.length > 0;
  const totalVisible = visibleFeatured.length + filteredRegular.length;
  const isFiltering = searchQuery.trim() !== '' || activeCategory !== 'All';

  return (
    <div className="space-y-16">

      {/* ── Search + Filter row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Search bar */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary/60 transition-colors duration-300 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics, categories..."
            className="w-full h-16 bg-white/[0.02] border border-white/5 focus:border-primary/30 rounded-2xl pl-16 pr-16 text-white text-lg font-light placeholder:text-white/20 outline-none transition-all duration-300 focus:bg-white/[0.04] focus:shadow-[0_0_30px_rgba(16,185,129,0.06)]"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Category pills + result count */}
        <div className="flex flex-wrap items-center gap-3">
          {allCategories.length > 2 && allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-11 px-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] border transition-all duration-300 ${activeCategory === cat
                ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5'
                }`}
            >
              {cat}
            </button>
          ))}

          {/* Result count — only when filtering */}
          <AnimatePresence>
            {isFiltering && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="ml-auto text-[10px] font-black uppercase tracking-[0.4em] text-white/20"
              >
                {totalVisible} {totalVisible === 1 ? 'result' : 'results'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── No results ── */}
      <AnimatePresence mode="wait">
        {!showFeatured && !showRegular && posts.length > 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-20 space-y-4"
          >
            <Search className="w-10 h-10 text-white/10 mx-auto" />
            <p className="text-white/20 uppercase tracking-[0.5em] font-black text-sm">No articles found.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60 hover:text-primary transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {posts.length === 0 && (
          <motion.div
            key="no-posts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-20 text-white/20 uppercase tracking-[0.5em] font-black"
          >
            No articles published yet.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Featured Posts ── */}
      <AnimatePresence mode="wait">
        {showFeatured && (
          <motion.div
            key={`featured-${activeCategory}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            <div className="flex items-center gap-6">
              <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black">Featured</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <FeaturedSection posts={visibleFeatured} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── All / Filtered Articles ── */}
      <AnimatePresence mode="wait">
        {showRegular && (
          <motion.div
            key={`regular-${activeCategory}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            {showFeatured && (
              <div className="flex items-center gap-6">
                <span className="text-white/30 uppercase tracking-[0.5em] text-[10px] font-black">
                  {activeCategory === 'All' && !searchQuery ? 'All Articles' : activeCategory !== 'All' ? activeCategory : 'Results'}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
            )}

            <div className="grid gap-12">
              {filteredRegular.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative"
                >
                  <Link href={`/blog/${post.slug || post.id}`} className="block relative z-10 p-8 md:p-12 rounded-[2rem] hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-500">
                    <div className="grid md:grid-cols-12 gap-10 items-center">
                      <div className="md:col-span-5 flex flex-col md:flex-row gap-10 items-center md:items-start">
                        <div className="relative w-full md:w-48 lg:w-72 aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5 shrink-0 group-hover:border-primary/30 transition-all duration-500 shadow-xl">
                          <Image
                            src={post.image || `https://picsum.photos/seed/${post.id}/600/600`}
                            alt={post.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            sizes="(max-width: 768px) 100vw, 300px"
                            data-ai-hint={post.imageHint || "blog thumbnail"}
                          />
                        </div>

                        <div className="space-y-6 flex-1 w-full text-center md:text-left">
                          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                            {(post.categories || (post.category ? [post.category] : ['Engineering'])).map((cat: string) => (
                              <button
                                key={cat}
                                onClick={(e) => { e.preventDefault(); setActiveCategory(cat); }}
                                className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
                              >
                                <Tag className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{cat}</span>
                              </button>
                            ))}
                          </div>
                          <div className="h-px w-8 bg-white/20 group-hover:w-16 group-hover:bg-primary transition-all duration-500 mx-auto md:mx-0" />
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-white/70 text-xs font-bold uppercase tracking-widest justify-center md:justify-start">
                              <Calendar className="w-4 h-4 text-primary/40" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-xs font-medium uppercase tracking-widest justify-center md:justify-start">
                              <Clock className="w-4 h-4 text-primary/40" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-5 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-headline font-bold text-white group-hover:text-primary transition-colors cursor-pointer leading-tight tracking-tight break-words">
                          {post.title}
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 font-body font-light leading-relaxed break-words line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div className="md:col-span-2 flex justify-end">
                        <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-2xl">
                          <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute -bottom-6 left-0 right-0 h-px bg-white/5" />
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
