
"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const experiences = [
  {
    company: "Lumina Labs",
    role: "Senior Full Stack Engineer",
    period: "2022 — Present",
    desc: "Spearheading the core platform redesign using Next.js and Go. Improved load times by 40% and developer velocity by 2x."
  },
  {
    company: "Veridian Agency",
    role: "Creative Developer",
    period: "2020 — 2022",
    desc: "Built award-winning digital experiences for Fortune 500 clients. Specialized in GSAP animations and Three.js integrations."
  },
  {
    company: "Stark Tech",
    role: "Frontend Developer",
    period: "2018 — 2020",
    desc: "Developed a comprehensive design system adopted by 5 product teams. Optimized React rendering cycles for high-traffic dashboards."
  }
];

export const Experience = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section id="experience" ref={scrollRef} className="py-32 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-24">
        <div className="lg:w-1/3 sticky top-32 h-fit">
          <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black block mb-6">Evolution</span>
          <h2 className="text-6xl font-headline font-black mb-8 tracking-tighter leading-none">Career <br /> <span className="text-outline italic">Path</span></h2>
          <p className="text-muted-foreground text-lg font-body font-light leading-relaxed">
            I've had the privilege of working with forward-thinking teams to build tools that empower millions. Here's a glimpse into my professional evolution.
          </p>
        </div>

        <div className="lg:w-2/3 relative">
          <div className="absolute left-0 top-4 bottom-4 w-[1px] bg-white/5">
            <motion.div 
              style={{ scaleY: pathLength, originY: 0 }}
              className="w-full h-full bg-primary"
            />
          </div>

          <div className="space-y-16">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-12 md:pl-16"
              >
                <div className="absolute left-0 top-4 -translate-x-1/2 w-4 h-4 bg-primary shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-headline font-bold text-white mb-2">{exp.company}</h3>
                    <span className="text-primary font-black text-xs tracking-[0.3em] uppercase">{exp.role}</span>
                  </div>
                  <div className="text-muted-foreground text-xs font-black tracking-widest uppercase border border-white/10 px-6 py-2 w-fit">
                    {exp.period}
                  </div>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl font-light font-body">
                  {exp.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
