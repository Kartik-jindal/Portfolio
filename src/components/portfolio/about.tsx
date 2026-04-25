
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const skills = ["TypeScript", "Next.js", "React", "Node.js", "Tailwind CSS", "Three.js", "GSAP", "PostgreSQL", "Docker", "AWS", "Framer Motion", "UI/UX Design"];

export const About = () => {
  return (
    <section id="about" className="py-24 px-6 md:py-32 relative overflow-hidden bg-card/30">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-8">Crafting Digital <br /><span className="text-accent italic">Excellence</span></h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              I am a Full Stack Developer with a deep obsession for detail and a drive for technical perfection. With over 5 years of experience, I've worked across the stack to build products that are as performant as they are beautiful.
            </p>
            <p>
              My philosophy is simple: technology should be invisible. The best user experiences feel natural, fluid, and effortless. I bridge the gap between high-level design and robust engineering to create digital products that leave a lasting impression.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-12">
            {[
              { label: "Experience", value: "5+ Years" },
              { label: "Projects", value: "40+" },
              { label: "Coffee/Day", value: "Too Much" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-headline font-bold text-accent">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:pl-12"
        >
          <h3 className="text-xl uppercase tracking-[0.3em] font-bold mb-10 text-primary">Core Arsenal</h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge variant="secondary" className="px-5 py-2.5 rounded-full text-sm font-medium border-white/10 hover:border-accent transition-colors bg-white/5">
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-accent/10 to-transparent p-8 rounded-2xl border border-accent/20">
            <h4 className="font-headline text-xl mb-4 italic">My Approach</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <span className="font-bold block">User-Centric Architecture</span>
                  <p className="text-sm text-muted-foreground">Building systems that prioritize the end-user journey and data integrity.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <span className="font-bold block">Motion Storytelling</span>
                  <p className="text-sm text-muted-foreground">Using animation to guide, delight, and enhance the digital narrative.</p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
