"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
    color: "from-emerald-600/20 to-teal-400/20"
  },
  {
    title: "Aura Commerce",
    role: "Full Stack Developer",
    desc: "An ultra-premium headless commerce solution for luxury fashion brands, featuring cinematic product storytelling.",
    tech: ["Shopify", "React", "GSAP", "Tailwind"],
    image: "https://picsum.photos/seed/aura/1200/800",
    color: "from-emerald-900/40 to-black/20"
  }
];

const minorProjects = [
  { title: "Pulse UI Kit", category: "Open Source", tags: ["Design Systems", "Figma"] },
  { title: "Crypto Tracker", category: "Web App", tags: ["API", "Vue"] },
  { title: "Zen Notes", category: "PWA", tags: ["Offline", "IndexedDB"] },
  { title: "Lumina Art", category: "Generative", tags: ["Canvas", "Math"] }
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
    >
      <div className="flex-1 w-full relative group">
        <div className={`absolute -inset-4 bg-gradient-to-br ${project.color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
        <div className="relative overflow-hidden border border-white/5 aspect-video lg:aspect-[4/3] shadow-2xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
            data-ai-hint="luxury project screenshot"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
            <Button variant="outline" className="rounded-none bg-white/10 backdrop-blur-md border-white/20"><Github className="w-5 h-5" /></Button>
            <Button className="rounded-none bg-primary text-primary-foreground font-black px-8">View Live</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div className="flex items-center gap-6">
          <span className="text-primary font-black tracking-tighter text-5xl">0{index + 1}</span>
          <div className="w-16 h-[1px] bg-primary/30" />
          <span className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-black">{project.role}</span>
        </div>
        <h3 className="text-5xl md:text-7xl font-headline font-bold leading-none">{project.title}</h3>
        <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-xl font-light">{project.desc}</p>
        <div className="flex flex-wrap gap-3 pt-4">
          {project.tech.map(t => (
            <span key={t} className="text-[10px] uppercase font-black tracking-widest text-primary/70 border border-primary/20 px-4 py-2">{t}</span>
          ))}
        </div>
        <div className="pt-8">
          <Button variant="link" className="p-0 text-primary group flex items-center gap-3 text-xl font-bold uppercase tracking-widest">
            Deep Dive <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform w-6 h-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="work" className="py-24 px-6 md:py-48 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 text-center"
        >
          <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black block mb-6">Archive</span>
          <h2 className="text-6xl md:text-9xl font-headline font-black tracking-tighter">Selected <br /> <span className="text-outline italic">Works</span></h2>
        </motion.div>

        {/* Flagship Projects */}
        <div className="space-y-48 md:space-y-80">
          {flagshipProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* Small Projects */}
        <div className="mt-80 pt-32 border-t border-white/5">
          <div className="flex justify-between items-end mb-24">
            <div>
              <span className="text-primary uppercase tracking-[0.3em] text-[10px] font-black block mb-4">Experiments</span>
              <h2 className="text-4xl md:text-6xl font-headline font-bold">Side Chapters</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {minorProjects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card/50 p-10 group border border-white/5 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 group-hover:bg-primary/20 transition-colors">
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-4 block">{project.category}</span>
                <h4 className="text-2xl font-headline font-bold mb-6 group-hover:text-primary transition-colors">{project.title}</h4>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{tag}</span>
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
