
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const skills = ["TypeScript", "Next.js 15", "React", "Node.js", "Three.js", "GSAP", "Framer Motion", "UI/UX Architecture"];

export const About = () => {
  return (
    <section id="about" className="py-48 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full" />
          <h2 className="text-6xl md:text-8xl font-headline font-black mb-12 tracking-tighter leading-[0.9]">
            DESIGN IS <br /><span className="text-primary italic">INTELLIGENCE</span> <br /> MADE VISIBLE.
          </h2>
          <div className="space-y-8 text-xl text-muted-foreground/80 font-body font-light leading-relaxed max-w-xl">
            <p>
              I build systems that bridge the gap between high-level architectural complexity and refined user-centric simplicity. 
            </p>
            <p>
              Every pixel is a decision. Every line of code is a commitment to performance and scalability. I specialize in crafting digital landscapes that don't just work—they resonate.
            </p>
          </div>

          <div className="mt-20 flex gap-12 border-t border-white/5 pt-12">
            {[
              { label: "Crafting Since", value: "2018" },
              { label: "Digital Units", value: "45+" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-headline font-bold text-white">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="lg:pl-20 space-y-20"
        >
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.8em] font-black mb-12 text-white/40">TECH STACK / ARSENAL</h3>
            <div className="flex flex-wrap gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Badge className="px-8 py-4 rounded-full text-[10px] uppercase font-black tracking-[0.2em] glass border-white/5 hover:bg-primary transition-colors cursor-default">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass p-12 rounded-[2rem] border-white/5 space-y-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <h4 className="font-headline text-3xl font-bold italic relative">The Workflow</h4>
            <div className="space-y-8 relative">
              {[
                { title: "Architectural Integrity", desc: "Building scalable foundations with modern patterns." },
                { title: "Motion Direction", desc: "Using fluid transitions to guide users naturally." },
                { title: "Performance First", desc: "Optimizing for sub-second load times and 60FPS interactivity." }
              ].map((item, i) => (
                <div key={i} className="flex gap-8">
                   <div className="w-px h-12 bg-primary/20" />
                   <div>
                     <div className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-2">{item.title}</div>
                     <p className="text-sm text-muted-foreground">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
