
"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const flagshipProjects = [
  {
    id: "01",
    title: "Nova Dashboard",
    role: "System Architect",
    desc: "Real-time orbital tracking platform for satellite arrays. Engineered with sub-millisecond data synchronization.",
    tech: ["Next.js 15", "WebGL", "Rust", "PostgreSQL"],
    image: "https://picsum.photos/seed/nova/1600/1000",
    color: "from-primary/20 to-emerald-900/20"
  },
  {
    id: "02",
    title: "Aura Luxury",
    role: "Creative Director",
    desc: "High-end immersive experience for a Parisian luxury house. Redefining e-commerce through cinematic storytelling.",
    tech: ["React", "Three.js", "GSAP", "Shopify"],
    image: "https://picsum.photos/seed/aura/1600/1000",
    color: "from-primary/20 to-black/40"
  }
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className="min-h-screen flex flex-col justify-center items-center py-24"
    >
      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-32 max-w-7xl mx-auto px-6 items-center`}>
        {/* Visual Element */}
        <div className="flex-1 w-full group relative">
          <div className={`absolute -inset-10 bg-gradient-to-br ${project.color} blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000`} />
          <div className="relative glass p-4 overflow-hidden rounded-3xl shadow-2xl">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  data-ai-hint="luxury project visual"
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center gap-6">
                <Button className="rounded-full w-16 h-16 bg-white text-black p-0 hover:scale-110 transition-transform"><Github className="w-6 h-6" /></Button>
                <Button className="rounded-full px-10 py-8 bg-primary text-white font-black hover:scale-110 transition-transform">Visit Studio</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Element */}
        <div className="flex-1 space-y-12">
          <div className="space-y-4">
            <span className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">{project.role}</span>
            <div className="flex items-center gap-6">
              <span className="text-7xl md:text-9xl font-headline font-black text-white/10">{project.id}</span>
              <h3 className="text-5xl md:text-7xl font-headline font-bold leading-none tracking-tighter">{project.title}</h3>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground/80 font-body font-light leading-relaxed max-w-xl">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-3">
            {project.tech.map(t => (
              <span key={t} className="px-5 py-2 rounded-full glass border-white/5 text-[10px] uppercase font-black tracking-widest text-white/60">
                {t}
              </span>
            ))}
          </div>

          <motion.div whileHover={{ x: 10 }} className="pt-8">
            <a href="#" className="flex items-center gap-4 text-primary text-xl font-bold uppercase tracking-[0.2em] group">
              Case Study <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="work" className="bg-background relative">
      <div className="max-w-7xl mx-auto px-6 pt-48 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary uppercase tracking-[0.8em] text-[10px] font-black block mb-8">Selected Archives</span>
          <h2 className="text-7xl md:text-[10rem] font-headline font-black tracking-tighter leading-none">THE <br /> <span className="text-outline italic">WORKS</span></h2>
        </motion.div>
      </div>

      <div className="relative">
        {flagshipProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
