
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Code2, Zap, Globe, Sparkles, Cpu } from 'lucide-react';
import { db } from '@/lib/firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

const ICON_MAP: Record<string, any> = {
  Code2,
  Zap,
  Globe,
  Cpu,
  Sparkles
};

export const About = ({ initialData }: { initialData?: any }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (!initialData) {
      const fetchAbout = async () => {
        const docRef = doc(db, 'site_config', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      };
      fetchAbout();
    }
  }, [initialData]);

  // Fallback defaults matching original hardcoded content
  const content = data || {
    philosophy: "The Philosophy",
    headlineMain: "Fusing",
    headlineOutline: "Logic",
    headlinePrimary: "Artistry.",
    narrative1: "I am a Full Stack Architect dedicated to building digital landscapes that are as high-performance as they are emotionally resonant.",
    narrative2: "With over six years of experience in the engineering trenches, I've learned that the best products aren't just built with code—they're crafted with a deep understanding of human interaction and technical scalability. My approach is rooted in precision, curiosity, and a relentless drive for excellence.",
    pillars: [
      { icon: "Code2", title: "Engineering", desc: "Building robust, scalable systems with architectural precision." },
      { icon: "Zap", title: "Performance", desc: "Optimizing for low-latency and high-fidelity user experiences." },
      { icon: "Globe", title: "Strategy", desc: "Bridging the gap between technical vision and business goals." }
    ],
    skills: ["TypeScript", "Next.js", "React", "Node.js", "Python", "Tailwind", "WebGL", "Cloud Architecture"],
    stat1Value: "6k+",
    stat1Label: "Coding Hours",
    stat2Value: "50+",
    stat2Label: "Projects Shipped",
    quote: "Digital architecture is the bridge between human imagination and machine execution. I strive to make that bridge invisible and beautiful."
  };

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
              <span className="text-primary tracking-[0.6em] uppercase text-xs font-black block">{content.philosophy}</span>
              <h2 className="text-6xl md:text-8xl font-headline font-black leading-[1.1] tracking-tighter">
                {content.headlineMain} <span className="text-outline italic">{content.headlineOutline}</span> with <br />
                <span className="text-primary italic">{content.headlinePrimary}</span>
              </h2>
            </div>

            <div className="space-y-10 max-w-3xl">
              <p className="text-2xl md:text-4xl text-white font-body font-light leading-snug">
                {content.narrative1}
              </p>
              <p className="text-xl md:text-2xl text-muted-foreground font-body leading-relaxed">
                {content.narrative2}
              </p>
            </div>

            {/* Simple Pillars Grid */}
            <div className="grid sm:grid-cols-3 gap-10 pt-12">
              {content.pillars?.map((pillar: any, i: number) => {
                const IconComp = ICON_MAP[pillar.icon] || Code2;
                return (
                  <div key={i} className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <IconComp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3">{pillar.title}</h3>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
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
            <div className="glass p-12 rounded-[2.5rem] border-white/5 space-y-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                <Sparkles className="w-16 h-16 text-primary" />
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xs uppercase tracking-[0.5em] font-black text-white/50">Core Arsenal</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {content.skills?.map((skill: string) => (
                    <Badge 
                      key={skill} 
                      variant="outline"
                      className="px-6 py-3 rounded-xl text-xs uppercase font-black tracking-widest border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-12 border-t border-white/5">
                <div className="flex items-center gap-12">
                  <div>
                    <div className="text-5xl md:text-6xl font-headline font-bold text-white mb-2">{content.stat1Value}</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-black">{content.stat1Label}</div>
                  </div>
                  <div className="w-px h-16 bg-white/5" />
                  <div>
                    <div className="text-5xl md:text-6xl font-headline font-bold text-white mb-2">{content.stat2Value}</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-black">{content.stat2Label}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 border border-white/5 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent">
              <p className="text-lg italic text-muted-foreground/80 leading-relaxed font-light">
                "{content.quote}"
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
