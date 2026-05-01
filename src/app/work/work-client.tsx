"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { Projects } from '@/components/portfolio/projects';
import { ProjectDetailContent } from '@/components/portfolio/project-detail-content';
import { ArrowUpRight, Binary } from 'lucide-react';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/utils';

export default function WorkClient({ config, initialExperiments, initialFlagships }: { config: any, initialExperiments: any[], initialFlagships: any[] }) {
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar resumeUrl={config?.resume?.fileUrl} />

      <section className="pt-48 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span className="text-primary uppercase tracking-[0.6em] text-sm font-black block mb-6">Portfolio Archive</span>
            <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-headline font-black tracking-tighter leading-none mb-12">
              The <span className="text-outline italic">Works</span>.
            </h1>
            <p className="text-xl sm:text-2xl md:text-4xl text-white/60 font-body font-light max-w-4xl leading-tight">
              A comprehensive showcase of high-fidelity engineering, creative motion, and architectural precision.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black block mb-6">Discovery</span>
            <h2 className="text-5xl md:text-8xl font-headline font-black tracking-tighter leading-none">
              FLAGSHIP <br /> <span className="text-outline italic">BUILDS.</span>
            </h2>
          </motion.div>
        </div>
        <Projects initialData={initialFlagships} hideHeader />
      </section>

      {config?.visibility?.showExperiments && (
        <section className="py-32 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div>
                <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black block mb-4">Technical Lab</span>
                <h2 className="text-5xl md:text-7xl font-headline font-black tracking-tighter">Small Projects <br /> & <span className="text-outline italic">Experiments</span></h2>
              </div>
              <p className="text-xl text-muted-foreground/60 max-w-md font-body font-light">
                Niche utilities, performance benchmarks, and experimental interaction studies.
              </p>
            </div>

            {initialExperiments.length === 0 ? (
              <div className="text-center py-20 text-white/20 uppercase tracking-[0.5em] font-black">
                The experimental lab is currently empty.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {initialExperiments.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 sm:p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all duration-500 group relative flex flex-col justify-between min-h-[400px] sm:min-h-[480px] cursor-none"
                  >
                    <button
                      onClick={() => setSelectedExperiment(project)}
                      className="absolute inset-0 z-10 cursor-none"
                      aria-label={`View ${project.title} case study`}
                    />

                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                          <Binary className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{project.type}</span>
                      </div>

                      <div className="relative aspect-video rounded-xl overflow-hidden mb-8 border border-white/5 shadow-2xl">
                        <Image
                          src={getAssetUrl(project.image)}
                          alt={project.title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          data-ai-hint={project.imageHint || "experiment cover"}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-headline font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                          {project.date && (
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{project.date}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{project.desc}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {project.tech?.map((t: string) => (
                          <span key={t} className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary transition-colors">
                        Access Lab Notes <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer config={config} />

      {/* Experiment modal — opens inline without routing */}
      <Dialog open={!!selectedExperiment} onOpenChange={(open) => !open && setSelectedExperiment(null)}>
        <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] shadow-2xl outline-none z-[5000] cursor-none">
          <DialogTitle className="sr-only">Project Detail</DialogTitle>
          {selectedExperiment && <ProjectDetailContent project={selectedExperiment} isModal />}
        </DialogContent>
      </Dialog>
    </main>
  );
}
