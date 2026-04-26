"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { Projects } from '@/components/portfolio/projects';
import { ArrowUpRight, Github, Code2, Globe, Cpu, X, ExternalLink, Box, Terminal, Activity, Zap, Shield, Database, Sparkles, Binary, Info } from 'lucide-react';
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
    desc: "A collection of high-performance GLSL shaders exploring procedural textures and fluid dynamics.",
    longDesc: "Vesper is an experimental playground for testing noise algorithms and fluid simulations. It pushes the boundaries of what's possible with Fragment Shaders in a browser environment. By offloading complex calculations to the GPU, we achieve liquid-smooth 60fps animations even with millions of simultaneous calculations. The architecture focuses on modular shader chunks that can be recompiled in real-time without losing state, allowing for rapid iteration of visual effects. This project specifically explores the intersection of Perlin noise and Voronoi tessellation to create organic, breathing digital environments that respond to user proximity and environmental data. The underlying engine utilizes a custom build pipeline that optimizes GLSL code for various hardware profiles, ensuring consistent visual fidelity across both high-end desktop GPUs and mobile chipsets.",
    tech: ["WebGL", "GLSL", "Three.js", "Vite"],
    image: "https://picsum.photos/seed/shader/1200/800",
    imageHint: "webgl shaders",
    link: "#"
  },
  {
    title: "Kryptos Auth",
    type: "Utility",
    desc: "Zero-knowledge proof authentication library for decentralized applications.",
    longDesc: "A cryptographic utility designed for privacy-first applications. It implements secure handshake protocols without ever exposing user credentials to the server. This project solves the problem of 'trust-less' identity verification by using modular arithmetic and elliptic curve cryptography. The library is optimized for bundle size, coming in at under 12kb gzipped, making it ideal for edge-computing scenarios where initial payload size is critical for user experience. Beyond simple auth, Kryptos implements a multi-round challenge-response system that protects against replay attacks and man-in-the-middle vulnerabilities. The engineering focus was on creating a zero-dependency architecture, ensuring that the library remains auditable and secure without the risk of supply chain compromises. It leverages the Web Crypto API for hardware-accelerated operations where available.",
    tech: ["TypeScript", "Cryptography", "Node.js", "WebCrypto"],
    image: "https://picsum.photos/seed/crypto/1200/800",
    imageHint: "encryption security",
    link: "#"
  },
  {
    title: "Onyx Grid",
    type: "Library",
    desc: "A CSS-in-JS layout engine optimized for ultra-low latency dashboards.",
    longDesc: "Onyx Grid solves the problem of DOM thrashing in heavy data environments. It uses a virtualized layout engine to render thousands of cells with minimal layout shift. By calculating viewport dimensions and only rendering visible rows, we achieve a flat O(1) rendering cost regardless of dataset size. This is particularly effective for financial terminals or satellite telemetry dashboards where data updates occur at sub-second intervals. The redesign of the layout engine focused on reducing the number of paint calls and layout recalculations, using a custom diffing algorithm that identifies only the necessary DOM nodes to update. This ensures that even with 50,000+ data points being updated via WebSockets, the main thread remains free for user interaction, maintaining a perfect 60fps interaction profile.",
    tech: ["React", "TypeScript", "Vite", "WebWorkers"],
    image: "https://picsum.photos/seed/grid/1200/800",
    imageHint: "data grid",
    link: "#"
  },
  {
    title: "Aether CMS",
    type: "Tool",
    desc: "Minimalist headless CMS architecture designed for static site generation.",
    longDesc: "A lightweight content management solution that prioritizes developer speed. It features a Git-based workflow and instant edge-deployment triggers. Aether bypasses the traditional database-driven CMS model by treating the file system as the source of truth, leveraging high-speed caching layers in Redis to serve content at the edge. This results in Time-To-First-Byte metrics that are 3x faster than traditional SaaS CMS offerings. The system includes a custom markdown parser and a real-time preview engine that allows editors to see changes instantly without a full build step. By utilizing a hybrid incremental build strategy, Aether can update individual pages across a multi-thousand page site in under 2 seconds. The security model is built directly into the Git provider, using fine-grained access control to manage content permissions without a separate user database.",
    tech: ["Go", "Next.js", "Redis", "GitHub API"],
    image: "https://picsum.photos/seed/cms/1200/800",
    imageHint: "headless cms",
    link: "#"
  }
];

export default function WorkPage() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {smallProjects.map((project, i) => (
              <motion.div
                key={project.title}
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
                      src={project.image} 
                      alt={project.title} 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      data-ai-hint={project.imageHint}
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-headline font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{project.desc}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
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
        </div>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-6xl bg-background/98 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl outline-none z-[5000] cursor-none">
          <AnimatePresence>
            {selectedProject && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[90vh] md:h-auto max-h-[90vh]">
                {/* Fixed Header */}
                <div className="relative h-64 md:h-80 w-full shrink-0 overflow-hidden">
                  <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover opacity-30 grayscale" />
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

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-8 md:p-16">
                    <div className="grid lg:grid-cols-12 gap-16">
                      {/* Primary Content Area */}
                      <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-8">
                          <div className="flex items-center gap-3 text-primary">
                            <Terminal className="w-5 h-5" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em]">Architectural Narrative</h4>
                          </div>
                          <div className="prose prose-invert max-w-none">
                            <p className="text-white/80 text-lg md:text-xl leading-relaxed font-body font-light first-letter:text-5xl first-letter:font-headline first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                              {selectedProject.longDesc}
                            </p>
                          </div>
                        </div>

                        <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                          <div className="flex items-center gap-3 text-accent/50">
                            <Sparkles className="w-4 h-4" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em]">Development Insight</h4>
                          </div>
                          <p className="text-sm md:text-base text-white/50 leading-relaxed italic font-light">
                            "The engineering challenge here wasn't just functionality, but the balance of computational overhead against visual fluidity. By prioritizing modularity in the shader logic, we ensured the system remains extensible for future atmospheric rendering experiments."
                          </p>
                        </div>
                      </div>

                      {/* Metadata Sidebar */}
                      <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-8 p-10 rounded-[2rem] glass-accent border-primary/10">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Technology Stack</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.tech.map((t: string) => (
                                <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/70 uppercase tracking-widest">{t}</span>
                              ))}
                            </div>
                          </div>

                          <div className="h-px bg-white/5" />

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Phase Status</h4>
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                              <span className="text-sm font-bold text-white uppercase tracking-widest">Live Experiment</span>
                            </div>
                          </div>

                          <a 
                            href={selectedProject.link} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white text-black text-[12px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-black transition-all shadow-2xl group"
                          >
                            Explore Source <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                        </div>
                        
                        <div className="flex items-center justify-between px-6 pt-4">
                          <span className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase">Ref_ID: {selectedProject.title.substring(0,3).toUpperCase()}</span>
                          <div className="flex gap-4">
                             <Github className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
                             <Globe className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
                          </div>
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

      <Footer />
    </main>
  );
}
