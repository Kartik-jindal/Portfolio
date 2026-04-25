
"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
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
  
  const x = useSpring(0, { stiffness: 60, damping: 20 });
  const y = useSpring(0, { stiffness: 60, damping: 20 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 10;
    const yPct = (mouseY / height - 0.5) * -10;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.98, 1, 1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className="py-16 md:py-32 first:pt-0"
    >
      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 max-w-[1800px] mx-auto px-6 items-center w-full`}>
        
        <div 
          className="lg:w-[65%] w-full group relative"
          onMouseMove={handleMouse}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          data-cursor="view"
        >
          <div className={`absolute -inset-12 bg-gradient-to-br ${project.color} blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000 animate-pulse-slow`} />
          
          <motion.div 
            style={{ rotateX: y, rotateY: x, perspective: 2000 }}
            className="relative glass p-1.5 md:p-2 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 group-hover:shadow-primary/20 group-hover:ring-1 group-hover:ring-primary/20"
          >
            <div className="relative aspect-[21/10] overflow-hidden rounded-[2.2rem]">
              <motion.div 
                style={{ scale: imageScale }} 
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-75"
                />
              </motion.div>
              
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[4px] flex flex-col items-center justify-center gap-8"
                  >
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex gap-6"
                    >
                      <Button className="rounded-full w-20 h-20 bg-white text-black p-0 hover:scale-110 transition-all duration-500 shadow-xl relative overflow-hidden group/play">
                        <Play className="fill-current w-6 h-6 relative z-10" />
                        <div className="absolute inset-0 bg-primary/20 scale-0 group-hover/play:scale-100 transition-transform duration-500 rounded-full" />
                      </Button>
                      <Button variant="outline" className="rounded-full px-10 py-8 border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-500">
                        Case Study
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                animate={{ opacity: isHovered ? 1 : 0.8, x: isHovered ? 0 : 0 }}
                className="absolute top-8 right-8 pointer-events-none"
              >
                <div className="glass px-6 py-3 rounded-full border-white/10 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                  Live System
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="lg:w-[35%] w-full space-y-10 lg:py-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-px bg-primary/40 animate-pulse" />
               <span className="text-primary font-black tracking-[0.8em] text-[10px] uppercase">{project.role}</span>
            </div>
            
            <div className="relative">
              <span className="absolute -left-12 -top-10 text-[10rem] font-headline font-black text-white/[0.03] select-none pointer-events-none">{project.id}</span>
              <h3 className="text-6xl md:text-8xl font-headline font-bold leading-none tracking-tighter relative z-10">
                {project.title.split(' ')[0]} <br />
                <span className="text-outline italic">{project.title.split(' ')[1]}</span>
              </h3>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground/80 font-body font-light leading-relaxed max-w-lg">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-4">
             {project.tech.map((t, i) => (
               <div key={t} className="flex items-center gap-3 group/item">
                  <div className="w-8 h-8 rounded-xl glass border-white/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-black transition-all duration-500 group-hover/item:rotate-12">
                     {i % 2 === 0 ? <Code2 className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
                  </div>
                  <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/50 group-hover/item:text-white transition-colors">{t}</span>
               </div>
             ))}
          </div>

          <div className="pt-8 flex items-center gap-12">
            <motion.a 
              href="#" 
              whileHover={{ x: 15 }}
              className="flex items-center gap-4 text-primary text-xl font-bold uppercase tracking-[0.2em] group"
            >
              Full Archive <ArrowUpRight className="w-6 h-6 group-hover:-translate-y-1.5 group-hover:translate-x-1.5 transition-transform duration-500" />
            </motion.a>
            <a href="#" className="text-white/20 hover:text-white transition-all duration-500 hover:scale-125">
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
    <section id="work" className="bg-transparent relative py-48">
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <span className="text-primary uppercase tracking-[1.2em] text-[12px] font-black block relative">
            Featured Productions
            <span className="absolute -left-8 top-1/2 w-4 h-px bg-primary/40 animate-pulse" />
          </span>
          <h2 className="text-7xl md:text-[10rem] font-headline font-black tracking-tighter leading-none">THE <br /> <span className="text-outline italic">CATALOG</span></h2>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
            <p className="max-w-xl text-muted-foreground/60 text-xl font-light leading-relaxed">
              Synthesizing complex engineering requirements into seamless, high-fidelity digital interfaces.
            </p>
            <div className="text-xs font-black tracking-widest uppercase text-white/20 border-l border-white/10 pl-8 h-fit">
              Selected Works <br /> 2022 — 2024
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative space-y-12 md:space-y-0">
        {flagshipProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>

      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.03] -z-10" />
    </section>
  );
};
