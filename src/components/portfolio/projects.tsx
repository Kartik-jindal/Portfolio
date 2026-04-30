"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Github, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProjectDetailContent } from '@/components/portfolio/project-detail-content';

// Shared easing used throughout the design system
const EASE = [0.16, 1, 0.3, 1] as const;

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

  function handleMouse(event: React.MouseEvent<HTMLElement>) {
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
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Info column slides in from the opposite side of the image
  const infoXDir = index % 2 === 0 ? 40 : -40;

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
          priority={index === 0}
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

        {/* ── Image ── */}
        {useModal ? (
          <div
            className="lg:w-[60%] w-full group relative block cursor-none"
            onMouseMove={handleMouse}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
            onClick={() => onCaseStudyClick(project)}
          >
            <div
              className="absolute -inset-2 md:-inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[40px] md:blur-[80px] -z-10"
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
              className="absolute -inset-2 md:-inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[40px] md:blur-[80px] -z-10"
              style={{ backgroundColor: project.accentColor || '#10B981' }}
            />
            {imageContent}
          </Link>
        )}

        {/* ── Info column — staggered children ── */}
        <motion.div
          className="lg:w-[40%] w-full space-y-6 md:space-y-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {/* Role + date */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: infoXDir },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="space-y-4 md:space-y-6 text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <span className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">{project.role}</span>
              {project.date && (
                <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">{project.date}</span>
              )}
            </div>

            {/* Animated accent line */}
            <motion.div
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 0.6, ease: EASE, delay: 0.1 } },
              }}
              className="h-px bg-gradient-to-r from-primary/60 to-transparent origin-left hidden lg:block"
            />
          </motion.div>

          {/* Title */}
          <motion.h3
            variants={{
              hidden: { opacity: 0, x: infoXDir, filter: "blur(8px)" },
              visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
            }}
            className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter break-words"
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="text-lg md:text-xl text-muted-foreground font-body font-light leading-relaxed max-w-xl mx-auto lg:mx-0 break-words line-clamp-4"
          >
            {project.desc}
          </motion.p>

          {/* Tech pills — each pops in */}
          <motion.div
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {project.tech?.map((t: string) => (
              <motion.div
                key={t}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 8 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                }}
                className="px-4 py-2 glass border-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/50"
              >
                {t}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
            className="pt-4 flex items-center justify-center lg:justify-start gap-12"
          >
            {useModal ? (
              <button
                onClick={() => onCaseStudyClick(project)}
                className="text-white text-sm font-black uppercase tracking-[0.3em] group hover:text-primary transition-colors flex items-center gap-3 cursor-none"
              >
                Case Study
                <motion.span
                  whileHover={{ x: 3, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.span>
              </button>
            ) : (
              <Link
                href={`/work/${project.slug || project.id}`}
                className="text-white text-sm font-black uppercase tracking-[0.3em] group hover:text-primary transition-colors flex items-center gap-3"
              >
                Case Study
                <motion.span
                  whileHover={{ x: 3, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.span>
              </Link>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="text-white/20 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </motion.a>
            )}
          </motion.div>
        </motion.div>

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
  const projects = initialData || [];
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <>
      <section id="work" className={cn("relative bg-transparent", hideHeader ? "pt-0 pb-24 md:pb-48" : "py-24 md:py-48")}>

        {!hideHeader && (
          <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className="max-w-3xl text-center lg:text-left"
            >
              {/* Label + expanding line */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                }}
                className="flex items-center gap-4 justify-center lg:justify-start mb-6"
              >
                <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black">Archive</span>
                <motion.div
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE, delay: 0.2 } },
                  }}
                  className="h-px w-16 bg-primary/30 origin-left"
                />
              </motion.div>

              {/* Headline — each word animates in */}
              <div className="overflow-hidden mb-8">
                <motion.h2
                  variants={{
                    hidden: { opacity: 0, y: 60, filter: "blur(12px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: EASE } },
                  }}
                  className="text-5xl sm:text-6xl md:text-8xl font-headline font-black tracking-tighter leading-none break-words"
                >
                  SELECTED <br /> <span className="text-outline italic">WORKS.</span>
                </motion.h2>
              </div>

              {/* Description */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                }}
                className="text-muted-foreground/60 text-lg md:text-xl font-light max-w-2xl font-body mx-auto lg:mx-0 break-words"
              >
                A curated collection of high-performance digital products where architectural precision meets emotive design.
              </motion.p>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-24 flex justify-center"
          >
            <Link href="/work">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 sm:px-16 py-5 sm:py-8 text-[12px] font-black uppercase tracking-[0.4em] border-white/10 hover:bg-primary hover:text-black transition-all"
              >
                View All Creations
              </Button>
            </Link>
          </motion.div>
        )}
      </section>

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
