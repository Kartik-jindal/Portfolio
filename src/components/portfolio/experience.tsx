
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { db } from '@/lib/firebase/firestore';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export const Experience = ({ initialData }: { initialData?: any[] }) => {
  const [experiences, setExperiences] = useState<any[]>(initialData || []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  useEffect(() => {
    if (!initialData) {
      const fetchExp = async () => {
        const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        setExperiences(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchExp();
    }
  }, [initialData]);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" ref={scrollRef} className="py-24 md:py-32 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-24">
        <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit text-center lg:text-left">
          <span className="text-primary uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[12px] font-black block mb-4 md:mb-6">Evolution</span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-black mb-6 md:mb-8 tracking-tighter leading-none">Career <br /> <span className="text-outline italic">Path</span></h2>
          <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl font-body font-light leading-relaxed mx-auto lg:mx-0 max-w-md lg:max-w-none">
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

          <div className="space-y-16 md:space-y-24">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id || i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-8 md:pl-20"
              >
                <div className="absolute left-0 top-4 md:top-6 -translate-x-1/2 w-3 md:w-5 h-3 md:h-5 bg-primary shadow-[0_0_15px_md:0_0_25px_rgba(16,185,129,0.6)]" />
                
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-6 mb-6 md:mb-8">
                  <div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-white mb-2 md:mb-3">{exp.company}</h3>
                    <span className="text-primary font-black text-xs md:text-sm lg:text-base tracking-[0.3em] md:tracking-[0.4em] uppercase">{exp.role}</span>
                  </div>
                  <div className="text-muted-foreground text-[10px] md:text-sm font-black tracking-widest uppercase border border-white/10 px-4 md:px-8 py-2 md:py-3 w-fit">
                    {exp.period}
                  </div>
                </div>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl font-light font-body text-muted-foreground">
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
