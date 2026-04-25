
"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight, Play, Layout, Code2, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const flagshipProjects = [
  {
    id: "01",
    title: "Nova Orbital",
    role: "System Architect",
    desc: "A mission-critical dashboard for real-time satellite telemetry. Leverages WebGL for planetary visualization and high-throughput data streams.",
    tech: ["Next.js 15", "Three.js", "Rust"],
    image: "https://picsum.photos/seed/nova/1600/1000",
    color: "rgba(16, 185, 129, 0.05)",
    accent: "#10B981"
  },
  {
    id: "02",
    title: "Aura Atelier",
    role: "Creative Director",
    desc: "Immersive e-commerce experience for a luxury Parisian fashion house. Features 3D product interaction and cinematic storytelling.",
    tech: ["React", "GLSL", "GSAP"],
    image: "https://picsum.photos/seed/aura/1600/1000",
    color: "rgba(255, 255, 255, 0.03)",
    accent: "#ffffff"
  }
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Refined Spring Motion
  const x = useSpring(0, { stiffness: 40, damping: 25 });
  const y = useSpring(0, { stiffness: 40, damping: 25 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / rect.width - 0.5) * 5; // Reduced intensity for elegance
    const yPct = (mouseY / rect.height - 0.5) * -5;
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

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className="py-12 md:py-24"
    >
      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 max-w-[1600px] mx-auto px-6 items-center`}>
        
        {/* Elegant Image Container */}
        <div 
          className="lg:w-[60%] w-full group relative"
          onMouseMove={handleMouse}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          data-cursor="view"
        >
          {/* Subtle Back Glow */}
          <div 
            className="absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[80px] -z-10"
            style={{ backgroundColor: project.accent }}
          />
          
          <motion.div 
            style={{ rotateX: y, rotateY: x, perspective: 1500 }}
            className="relative glass-accent p-1 rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(1.5rem-1px)]">
              <motion.div 
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-1000"
                />
              </motion.div>
              
              {/* Minimalist Overlay */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Button className="rounded-full px-8 py-6 bg-white text-black hover:bg-primary hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl group/btn">
                        View Production <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Minimalist Text Info */}
        <div className="lg:w-[40%] w-full space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">{project.role}</span>
               <div className="h-px w-8 bg-white/10" />
            </div>
            
            <h3 className="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-white">
              {project.title}
            </h3>
          </div>
          
          <p className="text-lg text-muted-foreground font-body font-light leading-relaxed max-w-md">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
             {project.tech.map((t) => (
               <div key={t} className="px-4 py-2 glass border-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/40">
                 {t}
               </div>
             ))}
          </div>

          <div className="pt-6 flex items-center gap-10">
            <motion.a 
              href="#" 
              whileHover={{ x: 10 }}
              className="flex items-center gap-4 text-white text-sm font-black uppercase tracking-[0.3em] group transition-colors hover:text-primary"
            >
              Case Study <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a href="#" className="text-white/20 hover:text-white transition-all duration-300">
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
    <section id="work" className="relative py-32 md:py-48 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <span className="text-primary uppercase tracking-[1em] text-[10px] font-black block mb-6">Archive</span>
          <h2 className="text-7xl md:text-9xl font-headline font-black tracking-tighter leading-none mb-10">
            SELECTED <br /> <span className="text-outline italic">WORKS.</span>
          </h2>
          <p className="text-muted-foreground/60 text-lg md:text-xl font-light leading-relaxed max-w-xl font-body">
            A curated collection of high-performance digital products where architectural precision meets emotive design.
          </p>
        </motion.div>
      </div>

      <div className="space-y-12">
        {flagshipProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
