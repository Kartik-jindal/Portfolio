
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const skills = ["TypeScript", "Next.js", "React", "Node.js", "Python","Tailwind" ,"WebGL", "Vercel", "Cloud Architecture"];

export const About = () => {
  return (
    <section id="about" className="py-24 md:py-48 px-6 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:sticky lg:top-32"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -left-32 -top-32 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 blur-[100px] md:blur-[150px] rounded-full -z-10 animate-pulse-slow" />
          
          <div className="space-y-6 md:space-y-10 text-center lg:text-left">
            <span className="text-primary tracking-[0.4em] md:tracking-[0.8em] uppercase text-[10px] md:text-[12px] font-black block relative">
              The Visionary Path
              <span className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full animate-ping" />
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-headline font-black mb-6 md:mb-8 tracking-tighter leading-[1] md:leading-[0.85]">
              CRAFTING <br /><span className="text-primary italic">DIGITAL</span> <br /> REALITIES.
            </h2>
            <div className="space-y-4 md:space-y-6 text-lg md:text-xl text-muted-foreground/80 font-body font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              <p>
                I thrive at the intersection of complex systems and emotive design. My goal is to build software that doesn't just function—it performs with a soul.
              </p>
              <p>
                From low-latency architectures to high-fidelity user interactions, I treat every project as a piece of digital craftsmanship.
              </p>
            </div>
            
            <div className="flex justify-center lg:justify-start gap-8 md:gap-16 pt-8 md:pt-12 border-t border-white/5">
              {[
                { label: "Engineering Units", value: "6.2k" },
                { label: "Success Rate", value: "100%" }
              ].map((stat, i) => (
                <div key={i} className="group">
                  <div className="text-3xl md:text-5xl font-headline font-bold text-white tabular-nums group-hover:text-primary transition-colors duration-500">{stat.value}</div>
                  <div className="text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-primary font-black mt-2 md:mt-3">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="lg:pl-12 space-y-16 md:space-y-24"
        >
          <div>
            <h3 className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] md:tracking-[1em] font-black mb-8 md:mb-12 text-white/30 text-center lg:text-left">CORE ARSENAL</h3>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Badge className="px-5 md:px-8 py-3 md:py-4 rounded-full text-[10px] md:text-[12px] uppercase font-black tracking-[0.2em] md:tracking-[0.3em] glass border-white/5 hover:bg-primary hover:text-black hover:shadow-primary/20 transition-all cursor-default shadow-xl whitespace-nowrap">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-12 md:space-y-16">
             <h3 className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] md:tracking-[1em] font-black text-white/30 text-center lg:text-left">THE METHODOLOGY</h3>
             <div className="space-y-8 md:space-y-12">
                {[
                  { title: "System Scalability", desc: "Building foundations that grow with the user base, using modern cloud patterns.", icon: "01" },
                  { title: "Motion Architecture", desc: "Every animation serves a purpose: to guide, to delight, and to focus.", icon: "02" },
                  { title: "Performance Engineering", desc: "Optimizing the critical path for sub-100ms interactions.", icon: "03" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 md:gap-10 group cursor-default text-center sm:text-left items-center sm:items-start"
                  >
                     <span className="text-2xl md:text-3xl font-headline font-bold text-white/10 group-hover:text-primary/40 transition-colors duration-500 sm:group-hover:translate-x-2 inline-block shrink-0">{item.icon}</span>
                     <div>
                       <div className="text-white font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] mb-2 md:mb-3 group-hover:text-primary transition-colors">{item.title}</div>
                       <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-light">{item.desc}</p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
