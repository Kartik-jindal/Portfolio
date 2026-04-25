
"use client";

import React from 'react';
import { motion } from 'framer-motion';

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
  return (
    <section id="experience" className="py-24 px-6 md:py-32 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3">
          <span className="text-accent uppercase tracking-widest text-sm font-bold block mb-4">Journey</span>
          <h2 className="text-5xl font-headline font-black mb-8">Career <br />Path</h2>
          <p className="text-muted-foreground text-lg font-body leading-relaxed">
            I've had the privilege of working with forward-thinking teams to build tools that empower millions. Here's a glimpse into my professional evolution.
          </p>
        </div>

        <div className="lg:w-2/3 space-y-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative pl-12 pb-12 border-l border-white/10 last:border-0 last:pb-0"
            >
              <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-accent bg-background" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-headline font-bold text-white">{exp.company}</h3>
                  <span className="text-primary font-bold text-sm tracking-widest uppercase">{exp.role}</span>
                </div>
                <div className="text-muted-foreground text-sm font-mono whitespace-nowrap bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                  {exp.period}
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-2xl font-body">
                {exp.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
