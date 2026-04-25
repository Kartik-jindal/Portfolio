
"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight, ArrowRight } from 'lucide-react';
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
  },
  {
    id: "03",
    title: "Eco Pulse",
    role: "Full Stack Dev",
    desc: "Environmental monitoring system tracking global carbon emissions in real-time. Built for massive scalability and accuracy.",
    tech: ["Next.js", "Firebase", "D3.js"],
    image: "https://picsum.photos/seed/eco/1600/1000",
    color: "rgba(16, 185, 129, 0.05)",
    accent: "#10B981"
  },
  {
    id: "04",
    title: "Stark Design",
    role: "Lead Engineer",
    desc: "A comprehensive design system and component library adopted by Fortune 500 product teams.",
    tech: ["React", "Tailwind", "Radix"],
    image: "https://picsum.photos/seed/stark/1600/1000",
    color: "rgba(255, 255, 255, 0.03)",
    accent: "#ffffff"
  }
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useSpring(0, { stiffness: 40, damping: 25 });
  const y = useSpring(0, { stiffness: 40, damping: 25 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    if (window.innerWidth < 1024) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / rect.width - 0.5) * 5; 
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
      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-12 lg:gap-20 max-w-[1600px] mx-auto px-6 items-center`}>
        
        {/* Image Container */}
        <div 
          className="lg:w-[60%] w-full group relative"
          onMouseMove={handleMouse}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          data-cursor="view"
        >
          <div 
            className="absolute -inset-4 md:-inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[40px] md:blur-[80px] -z-10"
            style={{ backgroundColor: project.accent }}
          />
          
          <motion.div 
            style={{ rotateX: y, rotateY: x, perspective: 1500 }}
            className="relative glass-accent p-0.5 md:p-1 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(1rem-1px)] md:rounded-[calc(1.5rem-1px)]">
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
              
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px] hidden md:flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Button className="rounded-full px-10 py-7 bg-white text-black hover:bg-primary hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl group/btn">
                        View Production <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Text Info */}
        <div className="lg:w-[40%] w-full space-y-6 md:space-y-10">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4">
               <span className="text-primary font-black tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[12px] uppercase">{project.role}</span>
               <div className="h-px w-6 md:w-10 bg-white/10" />
            </div>
            
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tighter text-white leading-[1.1]">
              {project.title}
            </h3>
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-body font-light leading-relaxed max-w-xl">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-2 md:gap-4 pt-2">
             {project.tech.map((t) => (
               <div key={t} className="px-3 md:px-5 py-1.5 md:py-2.5 glass border-white/5 rounded-full text-[10px] md:text-[12px] uppercase font-bold tracking-widest text-white/50 whitespace-nowrap">
                 {t}
               </div>
             ))}
          </div>

          <div className="pt-4 md:pt-8 flex items-center gap-8 md:gap-12">
            <motion.a 
              href="#" 
              whileHover={{ x: 10 }}
              className="flex items-center gap-3 md:gap-4 text-white text-sm md:text-base lg:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.3em] group transition-colors hover:text-primary"
            >
              Case Study <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a href="#" className="text-white/20 hover:text-white transition-all duration-300">
              <Github className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="work" className="relative py-24 md:py-48 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl text-center lg:text-left"
        >
          <span className="text-primary uppercase tracking-[0.5em] md:tracking-[1em] text-[10px] md:text-[12px] font-black block mb-6 md:mb-8">Archive</span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-headline font-black tracking-tighter leading-none mb-8 md:mb-12">
            SELECTED <br /> <span className="text-outline italic">WORKS.</span>
          </h2>
          <p className="text-muted-foreground/60 text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-2xl font-body mx-auto lg:mx-0">
            A curated collection of high-performance digital products where architectural precision meets emotive design.
          </p>
        </motion.div>
      </div>

      <div className="space-y-4 md:space-y-12">
        {flagshipProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
