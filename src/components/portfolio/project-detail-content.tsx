import React from 'react';
import { Github, ArrowUpRight, ExternalLink, Target, Code, Calendar } from 'lucide-react';
import Image from 'next/image';

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
          src={project.image || 'https://picsum.photos/seed/placeholder/1600/1000'}
          alt={project.title}
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
          data-ai-hint={project.imageHint || "project hero"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-8 left-12 right-12 z-20">
          <div className="flex items-center gap-4 mb-1">
            <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase">{project.role}</span>
            {project.date && (
              <span className="text-white/30 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {project.date}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-7xl font-headline font-black text-white italic tracking-tighter break-words leading-none">{project.title}</h1>
        </div>
      </div>

      <div className={`px-8 md:px-12 py-12 md:py-16 space-y-16 ${isModal ? 'overflow-y-auto custom-scrollbar flex-1' : ''}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-7 space-y-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <Target className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-[0.4em]">The Architecture</h4>
              </div>
              <p className="text-lg md:text-xl text-white/80 font-body font-light leading-relaxed first-letter:text-5xl first-letter:font-headline first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left break-words">
                {project.longDesc || project.desc}
              </p>
            </div>

            {project.methodology && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-accent">
                  <Code className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-[0.4em]">Strategic Methodology</h4>
                </div>
                <p className="text-lg text-white/60 font-body border-l-2 border-accent/20 pl-8 italic leading-relaxed break-words">
                  {project.methodology}
                </p>
              </div>
            )}

            {project.challenges && project.challenges.length > 0 && (
              <div className="space-y-8">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Engineering Challenges</h4>
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
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Project Impact</h4>
                  <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                    <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed italic break-words">
                      "{project.impact}"
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Core Arsenal</h4>
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
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener"><Github className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" /></a>}
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener"><ExternalLink className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" /></a>}
                </div>
              </div>
            </div>

            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-10 rounded-[2rem] bg-white text-black hover:bg-primary transition-all font-black uppercase tracking-[0.3em] shadow-2xl group text-sm">
                Check Live <ArrowUpRight className="w-5 h-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
