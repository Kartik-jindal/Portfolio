
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configSnap = await getDoc(doc(db, 'site_config', 'global'));
        if (configSnap.exists()) setConfig(configSnap.data());

        const q = query(
          collection(db, 'blog'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
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
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-32"
          >
            <span className="text-primary uppercase tracking-[0.6em] text-sm font-black block mb-6">Archive of Thoughts</span>
            <h1 className="text-5xl md:text-8xl font-headline font-black mb-8 italic tracking-tighter leading-tight">
              The <span className="text-outline">Journal</span>.
            </h1>
            <p className="text-xl md:text-3xl text-white/80 font-body font-light max-w-3xl leading-relaxed">
              An exploration into the intersection of code, design, and digital architecture.
            </p>
          </motion.div>

          <div className="grid gap-20">
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
                  <Link href={`/blog/${post.slug || post.id}`} className="block">
                    <div className="grid md:grid-cols-12 gap-8 items-center">
                      <div className="md:col-span-3 space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                          <Tag className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">{post.category}</span>
                        </div>
                        <div className="h-px w-8 bg-white/20 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-white/50 text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/50 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-headline font-bold text-white group-hover:text-primary transition-colors cursor-pointer leading-tight tracking-tight">
                          {post.title}
                        </h2>
                        <p className="text-lg md:text-xl text-white/60 font-body font-light leading-relaxed">
                          {post.summary}
                        </p>
                      </div>

                      <div className="md:col-span-2 flex justify-end">
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute -bottom-10 left-0 right-0 h-px bg-white/5" />
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
