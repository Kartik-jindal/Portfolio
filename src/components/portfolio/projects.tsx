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
  
  // 3D Tilt State
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 20;
    const yPct = (mouseY / height - 0.5) * -20;
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

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className="py-24 first:pt-0"
    >
      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 max-w-7xl mx-auto px-6 items-center w-full`}>
        
        {/* Interactive Visual Element */}
        <div 
          className="flex-1 w-full group relative"
          onMouseMove={handleMouse}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          data-cursor="view"
        >
          <div className={`absolute -inset-10 bg-gradient-to-br ${project.color} blur-[100px] opacity-10 group-hover:opacity-25 transition-opacity duration-1000`} />
          
          <motion.div 
            style={{ rotateX: y, rotateY: x, perspective: 1000 }}
            className="relative glass p-2 md:p-3 rounded-[2rem] shadow-2xl overflow-hidden transition-shadow duration-500 group-hover:shadow-primary/10"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]">
              <motion.div style={{ scale: imageScale }} className="absolute inset-0">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
              
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-6"
                  >
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <Button className="rounded-full w-16 h-16 bg-white text-black p-0 hover:scale-110 transition-transform">
                        <Play className="fill-current w-5 h-5" />
                      </Button>
                    </motion.div>
                    <Button variant="outline" className="rounded-full px-8 py-6 border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all">
                      Case Study
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Content Element */}
        <div className="flex-1 space-y-8 lg:py-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-8 h-px bg-primary/40" />
               <span className="text-primary font-black tracking-[0.6em] text-[10px] uppercase">{project.role}</span>
            </div>
            
            <div className="relative">
              <span className="absolute -left-10 -top-6 text-7xl font-headline font-black text-white/[0.03] select-none">{project.id}</span>
              <h3 className="text-5xl md:text-7xl font-headline font-bold leading-none tracking-tighter relative z-10">
                {project.title.split(' ')[0]} <br />
                <span className="text-outline italic">{project.title.split(' ')[1]}</span>
              </h3>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground/80 font-body font-light leading-relaxed max-w-xl">
            {project.desc}
          </p>

          <div className="grid grid-cols-2 gap-3">
             {project.tech.map((t, i) => (
               <div key={t} className="flex items-center gap-3 group/item">
                  <div className="w-7 h-7 rounded-lg glass border-white/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-black transition-colors">
                     {i % 2 === 0 ? <Code2 className="w-3.5 h-3.5" /> : <Layout className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">{t}</span>
               </div>
             ))}
          </div>

          <div className="pt-6 flex items-center gap-10">
            <motion.a 
              href="#" 
              whileHover={{ x: 10 }}
              className="flex items-center gap-3 text-primary text-lg font-bold uppercase tracking-[0.2em] group"
            >
              Full Case <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="work" className="bg-background relative py-32">
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="text-primary uppercase tracking-[1em] text-[10px] font-black block">Curated Works</span>
          <h2 className="text-6xl md:text-9xl font-headline font-black tracking-tighter leading-none">THE <br /> <span className="text-outline italic">GALLERY</span></h2>
          <p className="max-w-xl mx-auto text-muted-foreground/60 text-lg font-light leading-relaxed pt-4">
            A selection of high-performance systems and immersive interfaces crafted for industry leaders.
          </p>
        </motion.div>
      </div>

      <div className="relative space-y-12">
        {flagshipProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
