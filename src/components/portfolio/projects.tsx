
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const flagshipProjects = [
  {
    title: "Nova Dashboard",
    role: "Lead Architect",
    desc: "A futuristic real-time analytics engine for space-tech startups, handling millions of data points with zero latency.",
    tech: ["Next.js", "WebGL", "Socket.io", "Redis"],
    image: "https://picsum.photos/seed/nova/1200/800",
    color: "from-blue-600/20 to-cyan-400/20"
  },
  {
    title: "Aura Commerce",
    role: "Full Stack Developer",
    desc: "An ultra-premium headless commerce solution for luxury fashion brands, featuring cinematic product storytelling.",
    tech: ["Shopify", "React", "GSAP", "Tailwind"],
    image: "https://picsum.photos/seed/aura/1200/800",
    color: "from-purple-600/20 to-pink-400/20"
  }
];

const minorProjects = [
  { title: "Pulse UI Kit", category: "Open Source", tags: ["Design Systems", "Figma"] },
  { title: "Crypto Tracker", category: "Web App", tags: ["API", "Vue"] },
  { title: "Zen Notes", category: "PWA", tags: ["Offline", "IndexedDB"] },
  { title: "Lumina Art", category: "Generative", tags: ["Canvas", "Math"] }
];

export const Projects = () => {
  return (
    <section id="work" className="py-24 px-6 md:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span className="text-accent uppercase tracking-widest text-sm font-bold block mb-4">Selected Works</span>
          <h2 className="text-5xl md:text-7xl font-headline font-black">Major Chapters</h2>
        </motion.div>

        {/* Flagship Projects */}
        <div className="space-y-32 md:space-y-48">
          {flagshipProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              <div className="flex-1 w-full relative group">
                <div className={`absolute -inset-4 bg-gradient-to-br ${project.color} rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 aspect-video lg:aspect-[4/3] shadow-2xl">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    data-ai-hint="luxury project screenshot"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                    <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/20"><Github className="w-5 h-5" /></Button>
                    <Button className="rounded-full bg-accent text-accent-foreground font-bold px-6">View Live</Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold tracking-tighter text-4xl">0{index + 1}</span>
                  <div className="w-12 h-px bg-white/20" />
                  <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">{project.role}</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-headline font-bold group-hover:text-accent transition-colors">{project.title}</h3>
                <p className="text-lg text-muted-foreground font-body leading-relaxed">{project.desc}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tech.map(t => (
                    <span key={t} className="text-[10px] uppercase font-black tracking-widest text-white/40 border border-white/10 px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="pt-6">
                  <Button variant="link" className="p-0 text-accent group flex items-center gap-2 text-lg">
                    Deep Dive <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Small Projects */}
        <div className="mt-48 pt-24 border-t border-white/5">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-primary uppercase tracking-widest text-xs font-bold block mb-2">Extended Archive</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Side Explorations</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {minorProjects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-2xl group hover:border-accent/50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-2 block">{project.category}</span>
                <h4 className="text-xl font-headline font-bold mb-4">{project.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[9px] uppercase font-bold text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
