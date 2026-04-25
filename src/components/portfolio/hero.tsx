
"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero3D } from './hero-3d';
import { Button } from '@/components/ui/button';
import { MoveDown, Sparkles } from 'lucide-react';

export const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 150]);

  return (
    <section ref={targetRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 px-6">
      {/* 3D Background */}
      <motion.div style={{ opacity, scale }} className="fixed inset-0 z-0 pointer-events-none">
        <Hero3D />
      </motion.div>

      <div className="absolute inset-0 bg-grain z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-[2]" />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="flex items-center gap-2 text-primary tracking-[0.6em] uppercase text-[10px] font-black bg-primary/5 px-8 py-3 rounded-full border border-primary/20 backdrop-blur-xl">
            <Sparkles className="w-3 h-3" />
            Full Stack Architect
          </span>
        </motion.div>

        <div className="relative mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] md:text-[10rem] font-headline font-black leading-[0.8] tracking-tighter text-gradient px-4"
          >
            KARTIK <br /> <span className="text-outline italic">JINDAL</span>
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ duration: 2, delay: 0.6, ease: "circOut" }}
            className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-12 mx-auto"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="max-w-2xl text-lg md:text-2xl text-muted-foreground/70 mb-20 font-body font-light leading-relaxed px-6"
        >
          Engineering <span className="text-white font-medium">high-fidelity</span> digital landscapes where 
          <span className="text-primary italic font-headline ml-1">architectural precision</span> meets artistic motion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.3, ease: "backOut" }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Button size="lg" className="rounded-full px-16 py-10 text-lg font-black bg-primary text-primary-foreground hover:bg-accent transition-all duration-500 hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            Explore Work
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-16 py-10 text-lg font-black border-white/10 hover:bg-white/5 transition-all duration-500 backdrop-blur-md">
            The Vision
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
      >
        <span className="text-[9px] uppercase tracking-[0.8em] text-muted-foreground font-black">Scroll</span>
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-12 h-12 flex items-center justify-center glass rounded-full"
        >
          <MoveDown className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};
