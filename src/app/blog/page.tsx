
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configSnap = await getDoc(doc(db, 'site_config', 'global'));
        if (configSnap.exists()) setConfig(configSnap.data());

        // Fetching without orderBy to avoid composite index requirements
        const q = query(
          collection(db, 'blog'),
          where('status', '==', 'published')
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort in-memory: latest posts first
        const sortedData = data.sort((a: any, b: any) => {
          const timeA = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt?.toMillis?.() || 0);
          const timeB = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt?.toMillis?.() || 0);
          return timeB - timeA;
        });

        setPosts(sortedData);
      } catch (err) {
        console.error("Journal Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar resumeUrl={config?.resume?.fileUrl} />
      
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-32"
          >
            <span className="text-primary uppercase tracking-[0.6em] text-sm font-black block mb-6">Archive of Thoughts</span>
            <h1 className="text-5xl md:text-8xl font-headline font-black mb-8 italic tracking-tighter leading-tight break-words">
              The <span className="text-outline">Journal</span>.
            </h1>
            <p className="text-xl md:text-3xl text-white/80 font-body font-light max-w-3xl leading-relaxed break-words">
              An exploration into the intersection of code, design, and digital architecture.
            </p>
          </motion.div>

          <div className="grid gap-12">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>
            ) : posts.length === 0 ? (
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
                        {/* Thumbnail Container */}
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
                          <div className="flex items-center gap-3 text-primary justify-center md:justify-start">
                            <Tag className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{post.category}</span>
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
        </div>
      </section>

      <Contact />
      <Footer config={config} />
    </main>
  );
}
