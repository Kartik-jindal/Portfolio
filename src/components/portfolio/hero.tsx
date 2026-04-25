
"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero3D } from './hero-3d';
import { Button } from '@/components/ui/button';
import { ArrowRight, MoveDown } from 'lucide-react';

export const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 200]);

  return (
    <section ref={targetRef} className="relative min-h-[140vh] flex items-start justify-center overflow-hidden py-40 px-6">
      {/* 3D Background */}
      <motion.div style={{ opacity, scale }} className="fixed inset-0 z-0">
        <Hero3D />
      </motion.div>

      <div className="absolute inset-0 bg-grain z-[1]" />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-center text-center mt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="text-primary tracking-[0.8em] uppercase text-[10px] font-black bg-primary/10 px-6 py-2 rounded-full border border-primary/20 backdrop-blur-sm">
            Digital Experiences Designer
          </span>
        </motion.div>

        <div className="relative mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-8xl md:text-[14rem] font-headline font-black leading-[0.75] tracking-tighter text-gradient"
          >
            KARTIK <br /> <span className="text-outline italic">JINDAL</span>
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.5, ease: "circOut" }}
            className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-8"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="max-w-2xl text-xl md:text-2xl text-muted-foreground/80 mb-16 font-body font-light leading-relaxed px-4"
        >
          Crafting high-fidelity digital products where <span className="text-white font-medium">uncompromising engineering</span> meets <span className="text-primary italic font-headline">cinematic art</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.5, ease: "backOut" }}
          className="flex flex-col sm:flex-row gap-8"
        >
          <Button size="lg" className="rounded-full px-12 py-8 text-lg font-black bg-white text-black hover:bg-primary transition-all duration-500 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Explore Collection
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-12 py-8 text-lg font-black border-white/10 hover:bg-white/5 transition-all duration-500 backdrop-blur-md">
            The Philosophy
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1.5 }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-20"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground font-black">Scroll</span>
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-10 h-10 flex items-center justify-center glass rounded-full"
        >
          <MoveDown className="w-4 h-4 text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};
