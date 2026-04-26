
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight, X, ExternalLink, Target, Code } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, getDocs, limit as firestoreLimit } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

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
            style={{ backgroundColor: project.accentColor || '#10B981' }}
          />
          
          <motion.div 
            style={{ rotateX: y, rotateY: x, perspective: 1500 }}
            className="relative glass-accent p-0.5 md:p-1 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 cursor-none"
            data-cursor="View"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(1rem-1px)] md:rounded-[calc(1.5rem-1px)]">
              <Image src={project.image || 'https://picsum.photos/seed/placeholder/1600/1000'} alt={project.title} fill className="object-cover" />
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
            <h3 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter break-words">{project.title}</h3>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-body font-light leading-relaxed max-w-xl mx-auto lg:mx-0 break-words line-clamp-4">
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
             {project.tech?.map((t: string) => (
               <div key={t} className="px-4 py-2 glass border-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/50">{t}</div>
             ))}
          </div>
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-12">
            <button onClick={() => onOpen(project)} className="text-white text-sm font-black uppercase tracking-[0.3em] group hover:text-primary transition-colors flex items-center gap-3">
              Case Study <ArrowUpRight className="w-4 h-4" />
            </button>
            {project.githubUrl && <a href={project.githubUrl} className="text-white/20 hover:text-white transition-colors"><Github className="w-6 h-6" /></a>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = ({ initialData, limit = 0 }: { initialData?: any[], limit?: number }) => {
  const [projects, setProjects] = useState<any[]>(initialData || []);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    if (!initialData) {
      const fetchProjects = async () => {
        const q = query(
          collection(db, 'projects'),
          where('status', '==', 'published'),
          where('type', '==', 'FLAGSHIP'),
          orderBy('order', 'asc'),
          ...(limit > 0 ? [firestoreLimit(limit)] : [])
        );
        const snap = await getDocs(q);
        setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchProjects();
    }
  }, [initialData, limit]);

  return (
    <section id="work" className="relative py-24 md:py-48 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl text-center lg:text-left">
          <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black block mb-6">Archive</span>
          <h2 className="text-5xl md:text-8xl font-headline font-black tracking-tighter leading-none mb-8 break-words">
            SELECTED <br /> <span className="text-outline italic">WORKS.</span>
          </h2>
          <p className="text-muted-foreground/60 text-lg md:text-xl font-light max-w-2xl font-body mx-auto lg:mx-0 break-words">
            A curated collection of high-performance digital products where architectural precision meets emotive design.
          </p>
        </motion.div>
      </div>

      <div className="space-y-12">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} onOpen={setSelectedProject} />
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
                  <Image src={selectedProject.image || 'https://picsum.photos/seed/placeholder/1600/1000'} alt={selectedProject.title} fill className="object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-[6000] group">
                    <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                  </button>
                  <div className="absolute bottom-8 left-12 z-20">
                     <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-1 block">{selectedProject.role}</span>
                     <DialogTitle className="text-4xl md:text-6xl font-headline font-black text-white italic tracking-tighter break-words">{selectedProject.title}</DialogTitle>
                  </div>
                </div>

                <div className="px-8 md:px-12 py-12 md:py-16 space-y-16 overflow-y-auto custom-scrollbar flex-1">
                  <div className="grid md:grid-cols-12 gap-12 md:gap-20">
                    <div className="md:col-span-7 space-y-16">
                      {/* The Narrative */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary"><Target className="w-4 h-4" /><h4 className="text-xs font-black uppercase tracking-[0.4em]">The Architecture</h4></div>
                        <p className="text-lg md:text-xl text-white/80 font-body font-light leading-relaxed first-letter:text-5xl first-letter:font-headline first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left break-words">
                          {selectedProject.longDesc || selectedProject.desc}
                        </p>
                      </div>

                      {/* Methodology */}
                      {selectedProject.methodology && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-accent"><Code className="w-4 h-4" /><h4 className="text-xs font-black uppercase tracking-[0.4em]">Strategic Methodology</h4></div>
                          <p className="text-lg text-white/60 font-body border-l-2 border-accent/20 pl-8 italic leading-relaxed break-words">
                            {selectedProject.methodology}
                          </p>
                        </div>
                      )}

                      {/* Technical Hurdles */}
                      {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                        <div className="space-y-8">
                          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Engineering Challenges</h4>
                          <ul className="grid gap-6">
                            {selectedProject.challenges.map((c: string, i: number) => (
                              <li key={i} className="flex gap-6 items-start group">
                                <div className="mt-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-150 transition-transform" />
                                <span className="text-white/50 font-body leading-tight text-base md:text-lg break-words">{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-5 space-y-12">
                      <div className="glass p-10 rounded-[2rem] border-white/5 space-y-10">
                        {selectedProject.impact && (
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Project Impact</h4>
                            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                              <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed italic break-words">
                                "{selectedProject.impact}"
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Core Arsenal</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.tech?.map((t: string) => (
                              <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 uppercase tracking-widest">{t}</span>
                            ))}
                          </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        <div className="flex items-center justify-between px-2">
                          <span className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase">STATUS: DEPLOYED</span>
                          <div className="flex gap-4">
                             {selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" rel="noopener"><Github className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" /></a>}
                             {selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" rel="noopener"><ExternalLink className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" /></a>}
                          </div>
                        </div>
                      </div>

                      {selectedProject.liveUrl && (
                        <Button asChild className="w-full py-10 rounded-[2rem] bg-white text-black hover:bg-primary transition-all font-black uppercase tracking-[0.3em] shadow-2xl group">
                          <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                            Launch Product <ArrowUpRight className="w-5 h-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                        </Button>
                      )}
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
