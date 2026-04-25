
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Code2, Zap, Globe, Sparkles, Cpu } from 'lucide-react';

const skills = ["TypeScript", "Next.js", "React", "Node.js", "Python", "Tailwind", "WebGL", "Cloud Architecture"];

const pillars = [
  {
    icon: Code2,
    title: "Engineering",
    desc: "Building robust, scalable systems with architectural precision."
  },
  {
    icon: Zap,
    title: "Performance",
    desc: "Optimizing for low-latency and high-fidelity user experiences."
  },
  {
    icon: Globe,
    title: "Strategy",
    desc: "Bridging the gap between technical vision and business goals."
  }
];

export const About = () => {
  return (
    <section id="about" className="py-24 md:py-48 px-6 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-12"
          >
            <div className="space-y-6">
              <span className="text-primary tracking-[0.6em] uppercase text-[10px] font-black block">The Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-headline font-black leading-[1.1] tracking-tighter">
                Fusing <span className="text-outline italic">Logic</span> with <br />
                <span className="text-primary italic">Artistry.</span>
              </h2>
            </div>

            <div className="space-y-8 max-w-2xl">
              <p className="text-xl md:text-2xl text-muted-foreground/90 font-body font-light leading-relaxed">
                I am a Full Stack Architect dedicated to building digital landscapes that are as high-performance as they are emotionally resonant. 
              </p>
              <p className="text-lg text-muted-foreground/70 font-body leading-relaxed">
                With over six years of experience in the engineering trenches, I've learned that the best products aren't just built with code—they're crafted with a deep understanding of human interaction and technical scalability. My approach is rooted in precision, curiosity, and a relentless drive for excellence.
              </p>
            </div>

            {/* Simple Pillars Grid */}
            <div className="grid sm:grid-cols-3 gap-8 pt-8">
              {pillars.map((pillar, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <pillar.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">{pillar.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Skills & Focus */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 space-y-12 lg:pl-12"
          >
            <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xs uppercase tracking-[0.5em] font-black text-white/40">Core Arsenal</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="outline"
                      className="px-5 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-4xl font-headline font-bold text-white mb-1">6k+</div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-primary font-black">Coding Hours</div>
                  </div>
                  <div className="w-px h-10 bg-white/5" />
                  <div>
                    <div className="text-4xl font-headline font-bold text-white mb-1">50+</div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-primary font-black">Projects Shipped</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 border border-white/5 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent">
              <p className="text-sm italic text-muted-foreground/60 leading-relaxed font-light">
                "Digital architecture is the bridge between human imagination and machine execution. I strive to make that bridge invisible and beautiful."
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
