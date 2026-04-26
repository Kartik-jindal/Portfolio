
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { Projects } from '@/components/portfolio/projects';
import { ArrowUpRight, Github, Code2, Globe, Cpu, X, ExternalLink, Box, Terminal, Activity, Zap, Shield, Database } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const smallProjects = [
  {
    title: "Vesper Shader Lab",
    type: "Experiment",
    desc: "A collection of high-performance GLSL shaders exploring procedural textures.",
    longDesc: "Vesper is an experimental playground for testing noise algorithms and fluid simulations. It pushes the boundaries of what's possible with Fragment Shaders in a browser environment. By offloading complex calculations to the GPU, we achieve liquid-smooth 60fps animations even with millions of simultaneous calculations. The architecture focuses on modular shader chunks that can be recompiled in real-time without losing state, allowing for rapid iteration of visual effects.",
    tech: ["WebGL", "GLSL", "Three.js"],
    image: "https://picsum.photos/seed/shader/800/600",
    imageHint: "webgl shaders",
    link: "#",
    metrics: { 
      "Runtime Environment": "GPU-Accelerated",
      "Memory Allocation": "45MB VRAM",
      "Compute Density": "High-Fidelity",
      "Frame Latency": "< 8ms",
      "Architecture": "Custom GLSL Pipeline"
    }
  },
  {
    title: "Kryptos Auth",
    type: "Utility",
    desc: "Zero-knowledge proof authentication library for decentralized applications.",
    longDesc: "A cryptographic utility designed for privacy-first applications. It implements secure handshake protocols without ever exposing user credentials to the server. This project solves the problem of 'trust-less' identity verification by using modular arithmetic and elliptic curve cryptography. The library is optimized for bundle size, coming in at under 12kb gzipped, making it ideal for edge-computing scenarios where initial payload size is critical for user experience.",
    tech: ["TypeScript", "Cryptography", "Node.js"],
    image: "https://picsum.photos/seed/crypto/800/600",
    imageHint: "encryption security",
    link: "#",
    metrics: {
      "Protocol Type": "ZKP Handshake",
      "Encryption Std": "AES-256-GCM",
      "Bundle Weight": "11.8kb (Gzip)",
      "Verify Time": "42ms Average",
      "Compliance": "NIST Standard"
    }
  },
  {
    title: "Onyx Grid",
    type: "Library",
    desc: "A CSS-in-JS layout engine optimized for ultra-low latency dashboards.",
    longDesc: "Onyx Grid solves the problem of DOM thrashing in heavy data environments. It uses a virtualized layout engine to render thousands of cells with minimal layout shift. By calculating viewport dimensions and only rendering visible rows, we achieve a flat O(1) rendering cost regardless of dataset size. This is particularly effective for financial terminals or satellite telemetry dashboards where data updates occur at sub-second intervals.",
    tech: ["React", "Stylus", "Vite"],
    image: "https://picsum.photos/seed/grid/800/600",
    imageHint: "data grid",
    link: "#",
    metrics: {
      "Render Complexity": "O(1) Constant",
      "Update Velocity": "250ms Refresh",
      "DOM Nodes": "Virtual Stack",
      "Memory Leakage": "None Detected",
      "Integration": "React Hook Pattern"
    }
  },
  {
    title: "Aether CMS",
    type: "Tool",
    desc: "Minimalist headless CMS architecture designed for static site generation.",
    longDesc: "A lightweight content management solution that prioritizes developer speed. It features a Git-based workflow and instant edge-deployment triggers. Aether bypasses the traditional database-driven CMS model by treating the file system as the source of truth, leveraging high-speed caching layers in Redis to serve content at the edge. This results in Time-To-First-Byte metrics that are 3x faster than traditional SaaS CMS offerings.",
    tech: ["Go", "Next.js", "Redis"],
    image: "https://picsum.photos/seed/cms/800/600",
    imageHint: "headless cms",
    link: "#",
    metrics: {
      "Storage Model": "Flat-File Git",
      "Cache Strat": "Redis Edge",
      "TTFB Metric": "120ms (Global)",
      "Deployment": "Atomic Sync",
      "Build Trigger": "Webhook Native"
    }
  }
];

export default function WorkPage() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      
      {/* Header Section */}
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

      {/* Flagship Projects Section */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-xs uppercase tracking-[0.5em] font-black text-primary border-b border-primary/20 pb-4 inline-block">Flagship Builds</h2>
        </div>
        <Projects />
      </section>

      {/* Small Projects / Experiments Grid */}
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {smallProjects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="glass p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all duration-500 group relative flex flex-col justify-between h-[420px] cursor-pointer"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                      <Code2 className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{project.type}</span>
                  </div>
                  
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-8 border border-white/5">
                    <Image 
                      src={project.image} 
                      alt={project.title} 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      data-ai-hint={project.imageHint}
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-headline font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{project.desc}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span key={t} className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary transition-colors">
                    Analyze Entry <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Entry Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[2rem] shadow-2xl outline-none">
          <AnimatePresence>
            {selectedProject && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover opacity-40 grayscale" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-30">
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute bottom-8 left-12 z-20">
                     <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-1 block">Lab Entry_{selectedProject.type}</span>
                     <DialogTitle className="text-4xl md:text-6xl font-headline font-black text-white italic tracking-tighter">{selectedProject.title}</DialogTitle>
                  </div>
                </div>

                <div className="p-10 md:p-14 space-y-12">
                  <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
                    <div className="md:col-span-7 space-y-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                          <Terminal className="w-4 h-4" />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Development Abstract</h4>
                        </div>
                        <p className="text-white/80 text-xl leading-relaxed font-body font-light">
                          {selectedProject.longDesc}
                        </p>
                      </div>
                      
                      <div className="space-y-4 pt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Architecture Stack</h4>
                        <div className="flex flex-wrap gap-3">
                          {selectedProject.tech.map((t: string) => (
                            <span key={t} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/60">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-10">
                      <div className="flex items-center gap-3 text-accent">
                        <Activity className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">System Diagnostics</h4>
                      </div>
                      
                      <div className="space-y-1">
                        {Object.entries(selectedProject.metrics).map(([key, val]: [string, any], idx) => (
                          <div key={key} className="flex justify-between items-center p-6 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] transition-colors rounded-xl">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-primary transition-colors">Metric_{idx + 1}</span>
                              <span className="text-sm font-bold text-white/70">{key}</span>
                            </div>
                            <span className="text-base font-mono text-primary font-bold bg-primary/5 px-4 py-2 rounded-lg border border-primary/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]">{val}</span>
                          </div>
                        ))}
                      </div>
                      
                      <a href={selectedProject.link} className="flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white text-black text-[12px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all mt-6 shadow-2xl group">
                        Explore Repository <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
