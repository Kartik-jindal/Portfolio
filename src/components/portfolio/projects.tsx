
"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight, Play, Layout, Code2 } from 'lucide-react';
import Image from 'next/image';

const flagshipProjects = [
  {
    id: "01",
    title: "Nova Orbital",
    role: "System Architect",
    desc: "A mission-critical dashboard for real-time satellite telemetry. Leverages WebGL for planetary visualization and high-throughput data streams.",
    tech: ["Next.js 15", "Rust", "Three.js", "gRPC"],
    image: "https://picsum.photos/seed/nova/1600/1000",
    color: "from-primary/20 via-primary/5 to-transparent",
    accent: "#10B981"
  },
  {
    id: "02",
    title: "Aura Atelier",
    role: "Creative Director",
    desc: "Immersive e-commerce experience for a luxury Parisian fashion house. Features 3D product interaction and cinematic storytelling.",
    tech: ["React", "GLSL", "GSAP", "Shopify Plus"],
    image: "https://picsum.photos/seed/aura/1600/1000",
    color: "from-white/10 via-white/5 to-transparent",
    accent: "#ffffff"
  }
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className="min-h-screen flex flex-col justify-center items-center py-32"
    >
      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 max-w-7xl mx-auto px-6 items-center w-full`}>
        
        {/* Interactive Visual Element */}
        <div 
          className="flex-1 w-full group relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`absolute -inset-20 bg-gradient-to-br ${project.color} blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000`} />
          
          <motion.div 
            whileHover={{ y: -10, rotateX: 2, rotateY: index % 2 === 0 ? 2 : -2 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative glass p-2 md:p-4 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
              <motion.div style={{ scale: imageScale }} className="absolute inset-0">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  data-ai-hint="luxury interface"
                />
              </motion.div>
              
              {/* Overlay Content */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-6"
                  >
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <Button className="rounded-full w-20 h-20 bg-white text-black p-0 hover:scale-110 transition-transform">
                        <Play className="fill-current w-6 h-6" />
                      </Button>
                    </motion.div>
                    <Button variant="outline" className="rounded-full px-12 py-10 border-white/20 text-white font-bold hover:bg-white hover:text-black">
                      Live Case
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Content Element */}
        <div className="flex-1 space-y-10 lg:py-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-px bg-primary/40" />
               <span className="text-primary font-black tracking-[0.6em] text-[10px] uppercase">{project.role}</span>
            </div>
            
            <div className="relative">
              <span className="absolute -left-12 -top-8 text-8xl font-headline font-black text-white/[0.03] select-none">{project.id}</span>
              <h3 className="text-5xl md:text-8xl font-headline font-bold leading-none tracking-tighter relative z-10">
                {project.title.split(' ')[0]} <br />
                <span className="text-outline italic">{project.title.split(' ')[1]}</span>
              </h3>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground/80 font-body font-light leading-relaxed max-w-xl">
            {project.desc}
          </p>

          <div className="grid grid-cols-2 gap-4">
             {project.tech.map((t, i) => (
               <div key={t} className="flex items-center gap-3 group/item">
                  <div className="w-8 h-8 rounded-lg glass border-white/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-black transition-colors">
                     {i % 2 === 0 ? <Code2 className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">{t}</span>
               </div>
             ))}
          </div>

          <div className="pt-8 flex items-center gap-12">
            <motion.a 
              href="#" 
              whileHover={{ x: 10 }}
              className="flex items-center gap-4 text-primary text-xl font-bold uppercase tracking-[0.2em] group"
            >
              Full Project <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="work" className="bg-background relative pt-32">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-primary/5 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-primary/5 blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <span className="text-primary uppercase tracking-[1em] text-[10px] font-black block">Curated Works</span>
          <h2 className="text-7xl md:text-[12rem] font-headline font-black tracking-tighter leading-none">THE <br /> <span className="text-outline italic">GALLERY</span></h2>
          <p className="max-w-xl mx-auto text-muted-foreground/60 text-lg font-light leading-relaxed pt-8">
            A selection of high-performance systems and immersive interfaces crafted for industry leaders.
          </p>
        </motion.div>
      </div>

      <div className="relative space-y-32">
        {flagshipProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
