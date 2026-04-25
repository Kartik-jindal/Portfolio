
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Layers, Zap, Cpu, Code2, Globe, Sparkles } from 'lucide-react';

const skills = ["TypeScript", "Next.js", "React", "Node.js", "Python", "Tailwind", "WebGL", "Cloud Arch"];

export const About = () => {
  return (
    <section id="about" className="py-32 md:py-56 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Title Card - Spans 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 glass p-10 md:p-16 rounded-[2.5rem] flex flex-col justify-center border-white/5 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
               <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <span className="text-primary tracking-[0.6em] uppercase text-[10px] font-black mb-8 block">The Architect</span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black mb-10 tracking-tighter leading-[0.9]">
              FUSING <span className="text-outline italic">LOGIC</span> WITH <br />
              <span className="text-primary italic">ARTISTRY.</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground/90 font-body font-light leading-relaxed max-w-2xl">
              I specialize in building digital ecosystems that are as high-performance as they are emotionally resonant. My work lives at the intersection of rigorous engineering and cinematic motion.
            </p>
          </motion.div>

          {/* Stats Box - Spans 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-4 glass-accent p-10 rounded-[2.5rem] flex flex-col justify-between border-primary/10"
          >
            <div className="space-y-12">
              <div className="group">
                <div className="text-6xl font-headline font-bold text-white mb-2 tabular-nums group-hover:text-primary transition-colors">100%</div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">Architecture Integrity</div>
              </div>
              <div className="group">
                <div className="text-6xl font-headline font-bold text-white mb-2 tabular-nums group-hover:text-primary transition-colors">6.2k+</div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">Engineering Hours</div>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5 mt-8">
              <p className="text-sm text-muted-foreground/60 italic font-light">"Precision is the foundation of digital legacy."</p>
            </div>
          </motion.div>

          {/* Tech Stack Bento - Spans 5 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 glass p-10 rounded-[2.5rem] border-white/5"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xs uppercase tracking-[0.5em] font-black text-white/40">Core Arsenal</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Badge key={skill} className="px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest glass border-white/5 hover:bg-primary hover:text-black transition-all cursor-default">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Experience/Services Bento - Spans 7 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 glass p-10 rounded-[2.5rem] border-white/5 overflow-hidden relative"
          >
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                { icon: Code2, title: "Systems", desc: "Low-latency cloud architecture." },
                { icon: Zap, title: "Motion", desc: "Fluid, high-fidelity interactions." },
                { icon: Globe, title: "Scalability", desc: "Built for enterprise volume." }
              ].map((item, i) => (
                <div key={i} className="space-y-4 group">
                  <div className="p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-white font-black text-[11px] uppercase tracking-widest mb-2">{item.title}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Subtle Abstract SVG Background for this card */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <Layers className="w-64 h-64 text-white" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
