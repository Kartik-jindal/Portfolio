
"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
    <section ref={targetRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-12 md:py-24 px-6">
      {/* Background Atmosphere - Local Gradient for Hero depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-[2]" />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl w-full mx-auto my-6 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 md:mb-6 mt-4 md:mt-8"
        >
          <span className="flex items-center gap-2 text-primary tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-[12px] font-black bg-primary/5 px-6 md:px-8 py-2 md:py-3 rounded-full border border-primary/20 backdrop-blur-xl animate-pulse-slow">
            <Sparkles className="w-3 h-3 text-primary animate-spin-slow" />
            Full Stack Architect
          </span>
        </motion.div>

        <div className="relative mb-12 md:mb-16 animate-float w-full overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] sm:text-[14vw] md:text-[9rem] my-4 font-headline font-black leading-[1.2] md:leading-[1.4] tracking-tight text-gradient px-4"
          >
            KARTIK <span className="text-outline italic">JINDAL</span>
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 2, delay: 0.6, ease: "circOut" }}
            className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-8 md:mt-12 mx-auto"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="max-w-2xl text-base md:text-xl text-muted-foreground/70 mb-12 md:mb-16 font-body font-light leading-relaxed px-4 md:px-6"
        >
          Engineering <span className="text-white font-medium">high-fidelity</span> digital landscapes where 
          <span className="text-primary italic font-headline ml-1">architectural precision</span> meets artistic motion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.3, ease: "backOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0"
        >
          <Button size="lg" className="rounded-full px-12 py-7 md:py-8 text-base md:text-lg font-black bg-primary text-primary-foreground hover:bg-accent transition-all duration-500 hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)] group relative overflow-hidden w-full sm:w-auto">
            <span className="relative z-10">Explore Work</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-12 py-7 md:py-8 text-base md:text-lg font-black border-white/10 hover:bg-white/5 transition-all duration-500 backdrop-blur-md w-full sm:w-auto">
            The Vision
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
