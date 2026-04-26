
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { Projects } from '@/components/portfolio/projects';
import { ArrowUpRight, Github, Code2, Globe, Cpu } from 'lucide-react';
import { flagshipProjects } from '@/components/portfolio/projects';

const smallProjects = [
  {
    title: "Vesper Shader Lab",
    type: "Experiment",
    desc: "A collection of high-performance GLSL shaders exploring procedural textures.",
    tech: ["WebGL", "GLSL", "Three.js"],
    link: "#"
  },
  {
    title: "Kryptos Auth",
    type: "Utility",
    desc: "Zero-knowledge proof authentication library for decentralized applications.",
    tech: ["TypeScript", "Cryptography"],
    link: "#"
  },
  {
    title: "Onyx Grid",
    type: "Library",
    desc: "A CSS-in-JS layout engine optimized for ultra-low latency dashboards.",
    tech: ["React", "Stylus"],
    link: "#"
  },
  {
    title: "Aether CMS",
    type: "Tool",
    desc: "Minimalist headless CMS architecture designed for static site generation.",
    tech: ["Go", "Next.js"],
    link: "#"
  }
];

export default function WorkPage() {
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
                className="glass p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all duration-500 group relative flex flex-col justify-between h-[320px]"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                      <Code2 className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{project.type}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-headline font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.desc}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span key={t} className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t}</span>
                    ))}
                  </div>
                  <a href={project.link} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-primary transition-colors">
                    View Lab <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
