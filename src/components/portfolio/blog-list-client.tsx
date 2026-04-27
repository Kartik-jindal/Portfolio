'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogListClientProps {
  posts: any[];
}

export const BlogListClient = ({ posts }: BlogListClientProps) => {
  return (
    <div className="grid gap-12">
      {posts.length === 0 ? (
        <div className="text-center py-20 text-white/20 uppercase tracking-[0.5em] font-black">
          No articles published yet.
        </div>
      ) : (
        posts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
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
                        <div key={cat} className="flex items-center gap-2 text-primary">
                          <Tag className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">{cat}</span>
                        </div>
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
        ))
      )}
    </div>
  );
};
