
"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight, ArrowRight, X, ExternalLink, ShieldCheck, Zap, Layers } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const flagshipProjects = [
  {
    id: "01",
    title: "Nova Orbital",
    role: "System Architect",
    desc: "A mission-critical dashboard for real-time satellite telemetry. Leverages WebGL for planetary visualization and high-throughput data streams.",
    longDesc: "Nova Orbital was engineered to handle massive streams of telemetry data from orbital constellations. The primary challenge was rendering high-fidelity planetary models while simultaneously processing thousands of data points per second without UI latency.",
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
    longDesc: "Aura Atelier redefines luxury e-commerce by blending traditional high-fashion editorial aesthetics with cutting-edge 3D interactivity. We focused on creating a 'silent' UI that highlights product craftsmanship through physics-based fabric simulation.",
    challenges: [
      "Physics-based fabric rendering in the browser",
      "Seamless cinematic transitions between catalog and detail views",
      "Global CDN optimization for high-resolution 4K assets"
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
    longDesc: "Eco Pulse provides governmental bodies with the data needed to make climate policy decisions. The platform aggregates data from diverse IoT sensors and satellite imagery to provide a real-time carbon footprint of the planet.",
    challenges: [
      "Aggregation of multi-source environmental data sets",
      "Dynamic D3.js visualizations for complex temporal data",
      "Highly accessible interface for non-technical stakeholders"
    ],
    tech: ["Next.js", "Firebase", "D3.js", "Google Earth Engine"],
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
    longDesc: "Stark Design is more than a UI kit; it's a technical framework for consistency. Built with a focus on atomic design principles, it ensures that thousands of developers can ship accessible, performant, and branded experiences with zero friction.",
    challenges: [
      "Zero-runtime CSS architecture for maximum performance",
      "Strict WCAG 2.2 Level AAA accessibility compliance",
      "Automated visual regression testing for 200+ components"
    ],
    tech: ["React", "Tailwind", "Radix UI", "Storybook"],
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
                        Preview Study <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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
            <button 
              onClick={() => onOpen(project)}
              className="flex items-center gap-3 md:gap-4 text-white text-sm md:text-base lg:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.3em] group transition-colors hover:text-primary outline-none"
            >
              Case Study <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </button>
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
  const [selectedProject, setSelectedProject] = useState<any>(null);

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
          <ProjectCard key={project.title} project={project} index={index} onOpen={setSelectedProject} />
        ))}
      </div>

      {/* Case Study Preview Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <AnimatePresence>
            {selectedProject && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                {/* Visual Header */}
                <div className="relative aspect-video md:aspect-[21/9] w-full overflow-hidden">
                  <Image 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-20"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>

                  <div className="absolute bottom-8 left-10 z-10">
                     <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-2 block">{selectedProject.role}</span>
                     <DialogTitle className="text-4xl md:text-6xl font-headline font-black text-white italic tracking-tighter">
                       {selectedProject.title}
                     </DialogTitle>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-10 md:p-14 space-y-12 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-7 space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">The Mission</h4>
                        <p className="text-lg md:text-xl text-muted-foreground font-body font-light leading-relaxed">
                          {selectedProject.longDesc}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Technical Hurdles</h4>
                        <ul className="space-y-4">
                          {selectedProject.challenges.map((challenge: string, i: number) => (
                            <li key={i} className="flex gap-4 items-start">
                              <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-3 h-3 text-primary" />
                              </div>
                              <span className="text-muted-foreground/80 font-body text-base">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-10">
                      <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Core Arsenal</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tech.map((t: string) => (
                            <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 tracking-wider">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                           <Zap className="w-4 h-4 text-accent" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Project Specs</span>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                               <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Status</div>
                               <div className="text-xs font-bold text-white">Production</div>
                            </div>
                            <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                               <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Year</div>
                               <div className="text-xs font-bold text-white">2024</div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest uppercase text-white/40">Next Objective</p>
                        <p className="text-sm font-bold text-white">Enterprise Scalability</p>
                      </div>
                    </div>
                    
                    <Button 
                      asChild
                      className="w-full md:w-auto px-10 py-8 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 font-black uppercase tracking-[0.2em] group"
                    >
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                        Visit Production <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                    </Button>
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
