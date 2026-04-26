
"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight, ArrowRight, X, ExternalLink, ShieldCheck, Zap, Layers, Target, Code, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export const flagshipProjects = [
  {
    id: "01",
    title: "Nova Orbital",
    role: "System Architect",
    desc: "A mission-critical dashboard for real-time satellite telemetry. Leverages WebGL for planetary visualization and high-throughput data streams.",
    longDesc: "Nova Orbital was engineered to handle massive streams of telemetry data from orbital constellations. The primary challenge was rendering high-fidelity planetary models while simultaneously processing thousands of data points per second without UI latency.",
    methodology: "We utilized a multi-threaded architecture with Web Workers to handle data parsing off the main thread, while implementing a custom shaders system in Three.js for efficient planetary rendering.",
    impact: "Successfully reduced system response time by 65% and enabled real-time monitoring for over 500+ active satellites simultaneously.",
    challenges: [
      "Real-time processing of 10k+ concurrent data streams",
      "GPU-accelerated WebGL visualization for global tracking",
      "Sub-100ms latency for critical command and control triggers"
    ],
    tech: ["Next.js 15", "Three.js", "Rust", "WebSockets"],
    image: "https://picsum.photos/seed/nova/1600/1000",
    color: "rgba(16, 185, 129, 0.05)",
    accent: "#10B981",
    liveUrl: "https://nova-orbital.example.com"
  },
  {
    id: "02",
    title: "Aura Atelier",
    role: "Creative Director",
    desc: "Immersive e-commerce experience for a luxury Parisian fashion house. Features 3D product interaction and cinematic storytelling.",
    longDesc: "Aura Atelier redefines luxury e-commerce by blending traditional high-fashion editorial aesthetics with cutting-edge 3D interactivity.",
    methodology: "The project employed a 'Visual-First' engineering approach, using GSAP for complex timeline orchestrations and a custom headless Shopify integration.",
    impact: "Led to a 40% increase in user session duration and a significant 25% uplift in conversion.",
    challenges: [
      "Physics-based fabric rendering in the browser",
      "Seamless cinematic transitions",
      "Global CDN optimization for 4K assets"
    ],
    tech: ["React", "GLSL", "GSAP", "Shopify API"],
    image: "https://picsum.photos/seed/aura/1600/1000",
    color: "rgba(255, 255, 255, 0.03)",
    accent: "#ffffff",
    liveUrl: "https://aura-atelier.example.com"
  },
  {
    id: "03",
    title: "Eco Pulse",
    role: "Full Stack Dev",
    desc: "Environmental monitoring system tracking global carbon emissions in real-time. Built for massive scalability and accuracy.",
    longDesc: "Eco Pulse provides governmental bodies with the data needed to make climate policy decisions.",
    methodology: "Built on a robust Firebase backend with Google Earth Engine integration, the system utilizes D3.js for complex data storytelling.",
    impact: "Currently utilized by 12 non-profit organizations to track carbon offset initiatives.",
    challenges: [
      "Aggregation of multi-source environmental data sets",
      "Dynamic D3.js visualizations",
      "Automated outlier detection"
    ],
    tech: ["Next.js", "Firebase", "D3.js", "Python"],
    image: "https://picsum.photos/seed/eco/1600/1000",
    color: "rgba(16, 185, 129, 0.05)",
    accent: "#10B981",
    liveUrl: "https://eco-pulse.example.com"
  },
  {
    id: "04",
    title: "Stark Design",
    role: "Lead Engineer",
    desc: "A comprehensive design system and component library adopted by Fortune 500 product teams.",
    longDesc: "Stark Design is more than a UI kit; it's a technical framework for consistency.",
    methodology: "Implemented a strict architectural boundary between presentation logic and data handling.",
    impact: "Reduced front-end development time by 30% across 5 global engineering departments.",
    challenges: [
      "Zero-runtime CSS architecture",
      "Strict WCAG 2.2 Level AAA compliance",
      "Automated visual regression testing"
    ],
    tech: ["React", "Tailwind", "Radix UI", "Jest"],
    image: "https://picsum.photos/seed/stark/1600/1000",
    color: "rgba(255, 255, 255, 0.03)",
    accent: "#ffffff",
    liveUrl: "https://stark-design.example.com"
  }
];

const ProjectCard = ({ project, index, onOpen }: { project: any, index: number, onOpen: (p: any) => void }) => {
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
        <div 
          className="lg:w-[60%] w-full group relative"
          onMouseMove={handleMouse}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
          onClick={() => onOpen(project)}
        >
          <div 
            className="absolute -inset-4 md:-inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[40px] md:blur-[80px] -z-10"
            style={{ backgroundColor: project.accent }}
          />
          
          <motion.div 
            style={{ rotateX: y, rotateY: x, perspective: 1500 }}
            className="relative glass-accent p-0.5 md:p-1 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 cursor-pointer"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(1rem-1px)] md:rounded-[calc(1.5rem-1px)]">
              <Image src={project.image} alt={project.title} fill className="object-cover" />
              <AnimatePresence>
                {isHovered && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/30 backdrop-blur-[2px] hidden md:flex items-center justify-center">
                    <Button className="rounded-full px-10 py-7 bg-white text-black hover:bg-primary transition-all font-black uppercase tracking-[0.2em] text-[12px]">
                      Case Study <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="lg:w-[40%] w-full space-y-6 md:space-y-10">
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            <span className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">{project.role}</span>
            <h3 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter">{project.title}</h3>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-body font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
             {project.tech.map((t: string) => (
               <div key={t} className="px-4 py-2 glass border-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/50">{t}</div>
             ))}
          </div>
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-12">
            <button onClick={() => onOpen(project)} className="text-white text-sm font-black uppercase tracking-[0.3em] group hover:text-primary transition-colors flex items-center gap-3">
              Case Study <ArrowUpRight className="w-4 h-4" />
            </button>
            <a href="#" className="text-white/20 hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = ({ limit = 0 }: { limit?: number }) => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const displayProjects = limit > 0 ? flagshipProjects.slice(0, limit) : flagshipProjects;

  return (
    <section id="work" className="relative py-24 md:py-48 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl text-center lg:text-left">
          <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black block mb-6">Archive</span>
          <h2 className="text-5xl md:text-8xl font-headline font-black tracking-tighter leading-none mb-8">
            SELECTED <br /> <span className="text-outline italic">WORKS.</span>
          </h2>
          <p className="text-muted-foreground/60 text-lg md:text-xl font-light max-w-2xl font-body mx-auto lg:mx-0">
            A curated collection of high-performance digital products where architectural precision meets emotive design.
          </p>
        </motion.div>
      </div>

      <div className="space-y-12">
        {displayProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} onOpen={setSelectedProject} />
        ))}
      </div>

      {limit > 0 && (
        <div className="mt-24 flex justify-center">
          <Link href="/work">
            <Button variant="outline" size="lg" className="rounded-full px-16 py-8 text-[12px] font-black uppercase tracking-[0.4em] border-white/10 hover:bg-primary hover:text-black transition-all">
              View All Creations
            </Button>
          </Link>
        </div>
      )}

      {/* Case Study Preview Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[3rem] shadow-2xl">
          <AnimatePresence>
            {selectedProject && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-30">
                    <X className="w-6 h-6 text-white" />
                  </button>
                  <div className="absolute bottom-8 left-12 z-20">
                     <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-1 block">{selectedProject.role}</span>
                     <DialogTitle className="text-4xl md:text-6xl font-headline font-black text-white italic tracking-tighter">{selectedProject.title}</DialogTitle>
                  </div>
                </div>

                <div className="px-12 py-16 space-y-16 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid md:grid-cols-12 gap-20">
                    <div className="md:col-span-7 space-y-12">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary"><Target className="w-4 h-4" /><h4 className="text-xs font-black uppercase tracking-[0.4em]">The Mission</h4></div>
                        <p className="text-xl text-muted-foreground/90 font-body font-light leading-relaxed">{selectedProject.longDesc}</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-accent"><Code className="w-4 h-4" /><h4 className="text-xs font-black uppercase tracking-[0.4em]">Methodology</h4></div>
                        <p className="text-lg text-muted-foreground/80 font-body border-l-2 border-accent/20 pl-8 italic">{selectedProject.methodology}</p>
                      </div>
                      <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Technical Hurdles</h4>
                        <ul className="space-y-4">
                          {selectedProject.challenges.map((c: string, i: number) => (
                            <li key={i} className="flex gap-4 items-center group">
                              <ShieldCheck className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground/80 font-body">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-12">
                      <div className="glass p-10 rounded-3xl border-white/5 space-y-8">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Strategic Impact</h4>
                          <p className="text-sm font-medium text-white/90 leading-relaxed bg-primary/5 p-6 rounded-2xl border border-primary/10">{selectedProject.impact}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Core Arsenal</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.tech.map((t: string) => (
                              <span key={t} className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-bold text-white/60">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button asChild className="w-full py-10 rounded-full bg-white text-black hover:bg-primary transition-all font-black uppercase tracking-[0.3em]">
                        <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">Launch Product <ExternalLink className="w-5 h-5 ml-4" /></a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};
