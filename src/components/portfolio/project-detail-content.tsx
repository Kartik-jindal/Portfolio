'use client';

import React from 'react';
import { Github, ArrowUpRight, ExternalLink, Target, Code, Calendar, Cpu, Sparkles, Zap, Binary, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { sanitize } from '@/lib/sanitize';
import { getAssetUrl } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProjectDetailContentProps {
  project: any;
  isModal?: boolean;
}

export const ProjectDetailContent = ({ project, isModal = false }: ProjectDetailContentProps) => {
  if (!project) return null;

  return (
    <div className={isModal ? "flex flex-col h-full max-h-[90vh]" : "flex flex-col min-h-screen pt-32 pb-24"}>
      <div className="relative h-64 md:h-96 w-full shrink-0 overflow-hidden">
        <Image
          src={getAssetUrl(project.image)}
          alt={project.title}
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
          data-ai-hint={project.imageHint || "project hero"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-12 sm:right-12 z-20">
          <div className="flex items-center gap-4 mb-1">
            <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase">{project.role}</span>
            {project.date && (
              <span className="text-white/30 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <time dateTime={project.date}>{project.date}</time>
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-headline font-black text-white italic tracking-tighter break-words leading-none">{project.title}</h1>
        </div>
      </div>

      <div className={`px-8 md:px-12 py-12 md:py-16 space-y-16 ${isModal ? 'overflow-y-auto custom-scrollbar flex-1' : ''}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-7 space-y-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <Target className="w-4 h-4" />
                <h2 className="text-xs font-black uppercase tracking-[0.4em]">The Architecture</h2>
              </div>
              <div
                className="prose prose-invert prose-lg max-w-none font-body text-white/80 leading-relaxed
                  first-letter:text-5xl first-letter:font-headline first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left
                  prose-headings:font-headline prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
                  prose-p:mb-4 prose-p:leading-relaxed
                  prose-blockquote:border-l-2 prose-blockquote:border-primary/50 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-white/60
                  prose-code:bg-white/10 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-primary/80
                  prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-accent
                  break-words"
                dangerouslySetInnerHTML={{ __html: sanitize(project.longDesc || project.desc || '') }}
              />
            </div>

            {project.methodology && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-accent">
                  <Code className="w-4 h-4" />
                  <h2 className="text-xs font-black uppercase tracking-[0.4em]">Strategic Methodology</h2>
                </div>
                <p className="text-lg text-white/60 font-body border-l-2 border-accent/20 pl-8 italic leading-relaxed break-words">
                  {project.methodology}
                </p>
              </div>
            )}

            {project.challenges && project.challenges.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Engineering Challenges</h2>
                <ul className="grid gap-6">
                  {project.challenges.map((c: string, i: number) => (
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
              {project.impact && (
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Project Impact</h2>
                  <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                    <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed italic break-words">
                      "{project.impact}"
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Core Arsenal</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((t: string) => (
                    <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 uppercase tracking-widest">{t}</span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="flex items-center justify-between px-2">
                <span className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase">STATUS: DEPLOYED</span>
                <div className="flex gap-4">
                  {project.githubUrl && project.githubUrl.trim() !== '' && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl.trim() !== '' && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {project.liveUrl && project.liveUrl.trim() !== '' && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-6 sm:py-10 rounded-[1.5rem] sm:rounded-[2rem] bg-white text-black hover:bg-primary transition-all font-black uppercase tracking-[0.3em] shadow-2xl group text-sm">
                Check Live <ArrowUpRight className="w-5 h-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            )}
          </div>
        </div>

        {/* ── Technical Intelligence (AEO/GEO) ── */}
        {(project.aeo?.quickAnswer || (project.aeo?.takeaways?.length > 0) || (project.entity?.facts?.length > 0) || (project.aeo?.faqs?.length > 0)) && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto pt-16 border-t border-white/5 space-y-20"
          >
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Cpu className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Intelligence Unit</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-headline font-black italic text-white tracking-tighter">Technical Log.</h2>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                  A high-fidelity breakdown of the build's architectural achievements and performance markers.
                </p>
              </div>

              <div className="md:w-2/3 space-y-12">
                {/* Quick Answer / Abstract */}
                {project.aeo?.quickAnswer && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative p-10 rounded-[2rem] bg-primary/[0.03] border border-primary/10 overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles className="w-20 h-20 text-primary" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-6 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Synthesis
                    </h3>
                    <p className="text-xl md:text-2xl font-headline font-medium text-white italic leading-relaxed relative z-10">
                      "{project.aeo.quickAnswer}"
                    </p>
                  </motion.div>
                )}

                {/* Technical Facts (GEO) */}
                {project.entity?.facts?.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                      <Binary className="w-3 h-3" /> Hard Evidence
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {project.entity.facts.map((fact: string, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="px-5 py-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 group hover:border-primary/30 transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                          <span className="text-[11px] font-mono text-white/60 uppercase tracking-wider">{fact}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Takeaways */}
                {project.aeo?.takeaways?.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {project.aeo.takeaways.map((takeaway: string, i: number) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="glass p-8 rounded-3xl border-white/5 flex gap-5 group hover:bg-white/[0.04] transition-all"
                      >
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Marker {i + 1}</span>
                          <p className="text-sm text-white/70 font-medium leading-relaxed">{takeaway}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* FAQs */}
                {project.aeo?.faqs?.length > 0 && (
                  <div className="space-y-8 pt-8 border-t border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Query Archive</h3>
                    <div className="space-y-4">
                      {project.aeo.faqs.map((faq: any, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                          className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4"
                        >
                          <div className="text-base font-bold text-white flex gap-4">
                            <span className="text-primary/40 font-mono text-xs mt-1">0{i+1}</span>
                            {faq.q}
                          </div>
                          <div className="pl-9 text-sm text-white/40 leading-relaxed font-body">
                            {faq.a}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
