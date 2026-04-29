"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Github, ArrowUpRight, X, ExternalLink, Target, Code, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ProjectDetailContent } from '@/components/portfolio/project-detail-content';

const ProjectCard = ({
  project,
  index,
  useModal,
  onCaseStudyClick,
}: {
  project: any;
  index: number;
  useModal: boolean;
  onCaseStudyClick: (project: any) => void;
}) => {
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

  const imageContent = (
    <motion.div
      style={{ rotateX: y, rotateY: x, perspective: 1500 }}
      className="relative glass-accent p-0.5 md:p-1 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 cursor-none"
      data-cursor="View"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(1rem-1px)] md:rounded-[calc(1.5rem-1px)]">
        <Image
          src={project.image || 'https://picsum.photos/seed/placeholder/1600/1000'}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 60vw, 100vw"
          data-ai-hint={project.imageHint || "project cover"}
        />
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
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className="py-12 md:py-24"
    >
      <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-12 lg:gap-20 max-w-[1600px] mx-auto px-6 items-center`}>

        {/* Image — modal click on homepage, Link navigation on /work */}
        {useModal ? (
          <div
            className="lg:w-[60%] w-full group relative block cursor-none"
            onMouseMove={handleMouse}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
            onClick={() => onCaseStudyClick(project)}
          >
            <div
              className="absolute -inset-4 md:-inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[40px] md:blur-[80px] -z-10"
              style={{ backgroundColor: project.accentColor || '#10B981' }}
            />
            {imageContent}
          </div>
        ) : (
          <Link
            href={`/work/${project.slug || project.id}`}
            className="lg:w-[60%] w-full group relative block"
            onMouseMove={handleMouse}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
          >
            <div
              className="absolute -inset-4 md:-inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[40px] md:blur-[80px] -z-10"
              style={{ backgroundColor: project.accentColor || '#10B981' }}
            />
            {imageContent}
          </Link>
        )}

        <div className="lg:w-[40%] w-full space-y-6 md:space-y-10">
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <span className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">{project.role}</span>
              {project.date && (
                <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">{project.date}</span>
              )}
            </div>
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
            {/* Case Study — modal on homepage, navigate on /work */}
            {useModal ? (
              <button
                onClick={() => onCaseStudyClick(project)}
                className="text-white text-sm font-black uppercase tracking-[0.3em] group hover:text-primary transition-colors flex items-center gap-3 cursor-none"
              >
                Case Study <ArrowUpRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href={`/work/${project.slug || project.id}`}
                className="text-white text-sm font-black uppercase tracking-[0.3em] group hover:text-primary transition-colors flex items-center gap-3"
              >
                Case Study <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
            {project.githubUrl && <a href={project.githubUrl} className="text-white/20 hover:text-white transition-colors"><Github className="w-6 h-6" /></a>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = ({
  initialData,
  limit = 0,
  hideHeader = false,
  useModal = false,
}: {
  initialData?: any[];
  limit?: number;
  hideHeader?: boolean;
  useModal?: boolean;
}) => {
  const [projects, setProjects] = useState<any[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    if (!initialData) {
      const fetchProjects = async () => {
        try {
          const q = query(
            collection(db, 'projects'),
            where('status', '==', 'published')
          );
          const snap = await getDocs(q);
          const data = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((p: any) => p.type === 'FLAGSHIP')
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

          setProjects(limit > 0 ? data.slice(0, limit) : data);
        } catch (err) {
          console.error("Projects Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    }
  }, [initialData, limit]);

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
    </div>
  );

  return (
    <>
      <section id="work" className={cn("relative bg-transparent", hideHeader ? "pt-0 pb-24 md:pb-48" : "py-24 md:py-48")}>
        {!hideHeader && (
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
        )}

        <div className="space-y-12">
          {projects.length === 0 ? (
            <div className="text-center py-20 text-white/20 uppercase tracking-[0.5em] font-black">
              No flagship builds discovered yet.
            </div>
          ) : (
            projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                useModal={useModal}
                onCaseStudyClick={setSelectedProject}
              />
            ))
          )}
        </div>

        {limit > 0 && projects.length > 0 && (
          <div className="mt-24 flex justify-center">
            <Link href="/work">
              <Button variant="outline" size="lg" className="rounded-full px-16 py-8 text-[12px] font-black uppercase tracking-[0.4em] border-white/10 hover:bg-primary hover:text-black transition-all">
                View All Creations
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Modal only renders when useModal=true (homepage) */}
      {useModal && (
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[3rem] shadow-2xl outline-none z-[5000] cursor-none">
            <DialogTitle className="sr-only">Project Detail</DialogTitle>
            {selectedProject && <ProjectDetailContent project={selectedProject} isModal />}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
