"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero3D } from './hero-3d';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

export const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={targetRef} className="relative min-h-[120vh] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Background 3D Scene */}
      <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
        <Hero3D />
      </motion.div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-4"
        >
          <span className="text-primary tracking-[0.4em] uppercase text-xs font-black">Full Stack Developer & Creative Engineer</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-9xl lg:text-[12rem] font-headline font-black leading-[0.85] mb-8 tracking-tighter"
        >
          Kartik <br /> <span className="text-outline italic">Jindal</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 font-body font-light leading-relaxed"
        >
          Architecting premium digital experiences through refined design systems and scalable engineering. I turn complex challenges into elegant solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Button size="lg" className="rounded-none px-10 py-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 group transition-all duration-300">
            View Projects <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-none px-10 py-8 text-lg border-white/20 hover:bg-white/5 group transition-all duration-300">
            Preview Resume <FileText className="ml-2 w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-black">Scroll</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
};
