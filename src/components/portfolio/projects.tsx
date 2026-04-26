
"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight, X, ExternalLink, Target, Code } from 'lucide-react';
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
    longDesc: "Nova Orbital was engineered to solve the complex problem of visualizing massive telemetry data streams from low-earth orbit constellations. The application handles high-velocity data ingestion through a distributed socket architecture, processing over 10,000 concurrent metrics per second. The primary architectural challenge was ensuring that the main thread remained responsive for user interaction while the GPU managed high-fidelity planetary rendering and trajectory projections. We implemented a custom coordinate transformation engine to map raw satellite coordinates to the WebGL sphere in real-time, allowing for sub-millimeter precision in tracking data. This involved deep optimization of buffer attributes and custom shader passes to ensure fluid performance across varying hardware profiles.",
    methodology: "Our approach utilized a multi-threaded execution model using Web Workers to offload heavy data parsing and state management. The frontend employs a hybrid rendering strategy: Three.js handles the spatial 3D visualization using custom GLSL shaders for atmospheric effects, while a React-based UI layer provides precise data overlays. We also integrated a Rust-compiled WASM module to perform high-speed orbital calculations, significantly reducing the computational overhead compared to pure JavaScript. The data pipeline features an intelligent throttle mechanism that prioritizes critical telemetry events during periods of high network congestion, ensuring that ground control never loses sight of mission-critical metrics.",
    impact: "Successfully reduced system response latency by 65%, enabling ground control teams to respond to orbital anomalies in under 2 seconds. The platform currently monitors over 500 active satellites and has been cited as a benchmark for real-time aerospace data visualization, providing a new standard for high-fidelity situational awareness in satellite operations.",
    challenges: [
      "Real-time processing of 10k+ concurrent data streams with zero packet loss",
      "Dynamic WebGL memory management to prevent context loss during long-running sessions",
      "Achieving sub-100ms latency for critical command and control triggers",
      "Normalizing telemetry data from 14 different hardware providers in real-time",
      "Implementing a resilient failover system for high-concurrency WebSocket connections"
    ],
    tech: ["Next.js 15", "Three.js", "Rust (WASM)", "WebSockets", "GLSL"],
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
    longDesc: "Aura Atelier represents a paradigm shift in luxury digital retail. Instead of a traditional catalog, we built a cinematic journey that translates the tactile experience of high fashion into the digital realm. The core of the experience is an interactive 3D gallery where users can examine garment textures down to the thread level. We engineered a proprietary 'Fabric Shader' that simulates light scattering and physics-based movement, allowing digital textures to react naturally to mouse interaction and virtual lighting environments. The experience is designed to be highly evocative, using cinematic pacing and spatial audio to transport the user into the heart of the Parisian atelier, bridging the gap between digital convenience and physical luxury.",
    methodology: "The project followed a 'Visual-First' engineering philosophy. We used GSAP to orchestrate complex scrolling timelines that transition seamlessly between 2D editorial layouts and 3D product stages. To maintain a premium feel, we implemented a custom asset loader with intelligent pre-fetching, ensuring that 4K cinematic videos and heavy 3D models load progressively without interrupting the user's flow. The backend is built on a headless Shopify integration, keeping the frontend entirely decoupled for maximum performance and design freedom. Every interaction is mapped to a custom motion curve, ensuring that the interface feels as fluid and responsive as the fabrics it displays.",
    impact: "Led to a 40% increase in user session duration and a 25% uplift in conversion for high-ticket items. The project won several industry awards for its innovative approach to spatial commerce and mobile performance, proving that high-end visuals can coexist with rigorous performance standards in a production environment.",
    challenges: [
      "Physics-based fabric rendering with 60fps performance on mobile devices",
      "Synchronizing GSAP timelines with Three.js camera transitions seamlessly",
      "Optimizing global CDN delivery for multi-gigabyte 4K cinematic assets",
      "Implementing accessible navigation within a highly non-linear, spatial layout",
      "Developing a custom shader system for real-time anisotropic highlights on velvet textures"
    ],
    tech: ["React", "GLSL", "GSAP", "Shopify Headless", "Three.js"],
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
    longDesc: "Eco Pulse was designed as a tool for transparency and action in the global climate effort. It aggregates environmental data from satellite sensors, ground-based stations, and international registries to provide a unified 'pulse' of planetary health. The engineering challenge lay in the sheer volume and heterogeneity of the data—normalizing millions of records into a coherent, actionable narrative. We built a real-time analytics pipeline that processes incoming data and updates global heatmaps instantly, providing users with immediate feedback on carbon offset initiatives. The platform serves as a critical bridge between complex scientific data and public understanding, using interactive storytelling to highlight the direct impact of policy changes on global emissions.",
    methodology: "The architecture is centered around a robust Firebase backend that handles real-time data synchronization across thousands of clients. We integrated Google Earth Engine for historical satellite analysis and used D3.js to build complex, interactive data stories. The frontend is built with Next.js for its superior SSR capabilities, ensuring that data-heavy pages are crawlable and load quickly for users on low-bandwidth connections in developing regions. Every data point is traceable back to its source, ensuring the highest level of scientific integrity. We also implemented a custom caching layer to handle high-frequency updates to the global heatmap without compromising performance during peak usage periods.",
    impact: "The platform is currently utilized by 12 major non-profit organizations and 3 governmental bodies to track carbon neutrality progress. It has helped identify over 200 high-risk emission zones that were previously undocumented, enabling targeted intervention strategies that have already led to measurable reductions in local pollution levels.",
    challenges: [
      "Aggregation and normalization of multi-source environmental data sets with varying formats",
      "Optimizing D3.js visualizations to handle datasets with 1M+ points in real-time",
      "Automated outlier detection using custom statistical models and machine learning",
      "Ensuring offline data access for environmental researchers in remote areas",
      "Developing a low-latency geospatial indexing system for real-time carbon mapping"
    ],
    tech: ["Next.js", "Firebase", "D3.js", "Python (FastAPI)", "Google Earth Engine"],
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
    longDesc: "Stark Design is more than just a library of buttons; it is a technical ecosystem designed to scale design quality across massive organizations. It was built to solve the fragmentation of user experience that often occurs in enterprise-level software. The system includes a central token engine that manages colors, spacing, and typography across React, iOS, and Android platforms. We engineered the library with a focus on 'Zero-Runtime' performance, ensuring that the design system doesn't add unnecessary weight to the final product bundles. The architecture is designed for extreme extensibility, allowing product teams to build complex features while remaining strictly aligned with the core brand identity and accessibility standards.",
    methodology: "We implemented an Atomic Design methodology, building from basic foundations up to complex organisms. The library is built with TypeScript for absolute type-safety and uses Radix UI as the accessible primitive layer. Our CI/CD pipeline includes automated visual regression testing using Playwright and detailed accessibility audits for every component. We also developed a custom CLI tool that allows developers to scaffold new features using the Stark architecture in seconds, significantly reducing the cognitive load on engineering teams. The documentation is generated directly from the source code, ensuring that the implementation and the design specs are always in perfect sync.",
    impact: "Successfully reduced frontend development time by 30% across 5 global engineering departments. The system has become the gold standard for internal tooling, powering over 40 production applications for millions of users and ensuring a consistent, premium user experience across the entire product ecosystem.",
    challenges: [
      "Maintaining backwards compatibility across multiple major version releases",
      "Strict WCAG 2.2 Level AAA compliance for all UI components",
      "Developing a zero-runtime CSS-in-JS architecture optimized for build-time performance",
      "Creating an automated documentation engine that syncs with Figma tokens in real-time",
      "Scaling the system to support 15+ product teams with diverse technical requirements"
    ],
    tech: ["React", "TypeScript", "Tailwind", "Radix UI", "Playwright"],
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
            className="relative glass-accent p-0.5 md:p-1 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 cursor-none"
            data-cursor="View"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(1rem-1px)] md:rounded-[calc(1.5rem-1px)]">
              <Image src={project.image} alt={project.title} fill className="object-cover" />
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px] hidden md:flex items-center justify-center transition-all duration-500"
                  />
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
        <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[3rem] shadow-2xl outline-none z-[5000] cursor-none">
          <AnimatePresence>
            {selectedProject && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col max-h-[90vh]">
                <div className="relative h-64 md:h-80 w-full shrink-0 overflow-hidden">
                  <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-[6000] group">
                    <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                  </button>
                  <div className="absolute bottom-8 left-12 z-20">
                     <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-1 block">{selectedProject.role}</span>
                     <DialogTitle className="text-4xl md:text-6xl font-headline font-black text-white italic tracking-tighter">{selectedProject.title}</DialogTitle>
                  </div>
                </div>

                <div className="px-8 md:px-12 py-12 md:py-16 space-y-16 overflow-y-auto custom-scrollbar flex-1">
                  <div className="grid md:grid-cols-12 gap-12 md:gap-20">
                    <div className="md:col-span-7 space-y-16">
                      {/* The Narrative */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary"><Target className="w-4 h-4" /><h4 className="text-xs font-black uppercase tracking-[0.4em]">The Architecture</h4></div>
                        <p className="text-lg md:text-xl text-white/80 font-body font-light leading-relaxed first-letter:text-5xl first-letter:font-headline first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                          {selectedProject.longDesc}
                        </p>
                      </div>

                      {/* Methodology */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-accent"><Code className="w-4 h-4" /><h4 className="text-xs font-black uppercase tracking-[0.4em]">Strategic Methodology</h4></div>
                        <p className="text-lg text-white/60 font-body border-l-2 border-accent/20 pl-8 italic leading-relaxed">
                          {selectedProject.methodology}
                        </p>
                      </div>

                      {/* Technical Hurdles */}
                      <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Engineering Challenges</h4>
                        <ul className="grid gap-6">
                          {selectedProject.challenges.map((c: string, i: number) => (
                            <li key={i} className="flex gap-6 items-start group">
                              <div className="mt-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-150 transition-transform" />
                              <span className="text-white/50 font-body leading-tight text-base md:text-lg">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-12">
                      <div className="glass p-10 rounded-[2rem] border-white/5 space-y-10">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Project Impact</h4>
                          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                            <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed italic">
                              "{selectedProject.impact}"
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Core Arsenal</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.tech.map((t: string) => (
                              <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 uppercase tracking-widest">{t}</span>
                            ))}
                          </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        <div className="flex items-center justify-between px-2">
                          <span className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase">STATUS: DEPLOYED</span>
                          <div className="flex gap-4">
                             <Github className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
                             <ExternalLink className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
                          </div>
                        </div>
                      </div>

                      <Button asChild className="w-full py-10 rounded-[2rem] bg-white text-black hover:bg-primary transition-all font-black uppercase tracking-[0.3em] shadow-2xl group">
                        <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                          Launch Product <ArrowUpRight className="w-5 h-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
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
