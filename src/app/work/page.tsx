
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { Projects } from '@/components/portfolio/projects';
import { ArrowUpRight, Github, Code2, Globe, Cpu, X, ExternalLink, Box, Terminal, Activity, Zap, Shield, Database, Sparkles, Binary, Info } from 'lucide-react';
import Image from 'next/image';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export default function WorkPage() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get Config
        const configSnap = await getDoc(doc(db, 'site_config', 'global'));
        if (configSnap.exists()) setConfig(configSnap.data());

        // Get Experiments - Simple query to avoid composite index requirements
        const q = query(
          collection(db, 'projects'),
          where('status', '==', 'published')
        );
        const snap = await getDocs(q);
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((p: any) => p.type === 'EXPERIMENT')
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        
        setExperiments(data);
      } catch (err) {
        console.error("Work Page Fetch Error:", err);
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
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24"
          >
            <span className="text-primary uppercase tracking-[0.6em] text-sm font-black block mb-6">Portfolio Archive</span>
            <h1 className="text-6xl md:text-[10rem] font-headline font-black tracking-tighter leading-none mb-12">
              The <span className="text-outline italic">Works</span>.
            </h1>
            <p className="text-2xl md:text-4xl text-white/60 font-body font-light max-w-4xl leading-tight">
              A comprehensive showcase of high-fidelity engineering, creative motion, and architectural precision.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-xs uppercase tracking-[0.5em] font-black text-primary border-b border-primary/20 pb-4 inline-block">Flagship Builds</h2>
        </div>
        <Projects />
      </section>

      {config?.visibility?.showExperiments && (
        <section className="py-32 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div>
                <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black block mb-4">Technical Lab</span>
                <h2 className="text-5xl md:text-7xl font-headline font-black tracking-tighter">Small Projects <br /> & <span className="text-outline italic">Experiments</span></h2>
              </div>
              <p className="text-xl text-muted-foreground/60 max-w-md font-body font-light">
                Niche utilities, performance benchmarks, and experimental interaction studies.
              </p>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>
            ) : experiments.length === 0 ? (
              <div className="text-center py-20 text-white/20 uppercase tracking-[0.5em] font-black">
                The experimental lab is currently empty.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {experiments.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedProject(project)}
                    className="glass p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all duration-500 group relative flex flex-col justify-between min-h-[480px] cursor-none"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                          <Binary className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{project.type}</span>
                      </div>
                      
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-8 border border-white/5 shadow-2xl">
                        <Image 
                          src={project.image || 'https://picsum.photos/seed/placeholder/600/400'} 
                          alt={project.title} 
                          fill 
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-2xl font-headline font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{project.desc}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {project.tech?.map((t: string) => (
                          <span key={t} className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary transition-colors">
                        Access Lab Notes <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-6xl bg-background/98 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl outline-none z-[5000] cursor-none">
          <AnimatePresence>
            {selectedProject && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[90vh] md:h-auto max-h-[90vh]">
                <div className="relative h-64 md:h-80 w-full shrink-0 overflow-hidden">
                  <Image src={selectedProject.image || 'https://picsum.photos/seed/placeholder/1200/800'} alt={selectedProject.title} fill className="object-cover opacity-30 grayscale" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  
                  <button 
                    onClick={() => setSelectedProject(null)} 
                    className="absolute top-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all z-30 group"
                  >
                    <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                  </button>

                  <div className="absolute bottom-10 left-12 right-12 z-20">
                     <div className="flex items-center gap-4 mb-3">
                        <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase bg-primary/10 px-3 py-1 rounded-md border border-primary/20">Technical_Case_{selectedProject.type}</span>
                        <div className="h-px flex-1 bg-white/10" />
                     </div>
                     <DialogTitle className="text-4xl md:text-7xl font-headline font-black text-white italic tracking-tighter leading-tight">{selectedProject.title}</DialogTitle>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-8 md:p-16">
                    <div className="grid lg:grid-cols-12 gap-16">
                      <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-8">
                          <div className="flex items-center gap-3 text-primary">
                            <Terminal className="w-5 h-5" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em]">Architectural Narrative</h4>
                          </div>
                          <div className="prose prose-invert max-w-none">
                            <p className="text-white/80 text-lg md:text-xl leading-relaxed font-body font-light first-letter:text-5xl first-letter:font-headline first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left break-words">
                              {selectedProject.longDesc || selectedProject.desc}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-8 p-10 rounded-[2rem] glass-accent border-primary/10">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Technology Stack</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.tech?.map((t: string) => (
                                <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/70 uppercase tracking-widest">{t}</span>
                              ))}
                            </div>
                          </div>
                          <a 
                            href={selectedProject.liveUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white text-black text-[12px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-black transition-all shadow-2xl group"
                          >
                            Check Live <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Footer config={config} />
    </main>
  );
}
