
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Hero3D } from './hero-3d';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Background 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Hero3D />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-4"
        >
          <span className="text-accent tracking-[0.2em] uppercase text-sm font-bold">Full Stack Developer & Creative Engineer</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-headline font-black leading-none mb-8 tracking-tighter"
        >
          Kartik <span className="text-primary italic">Jindal</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 font-body"
        >
          Architecting premium digital experiences through refined design systems and scalable engineering. I turn complex challenges into elegant solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" className="rounded-full px-8 py-7 text-lg bg-accent text-accent-foreground hover:bg-accent/90 group transition-all duration-300 transform hover:scale-105">
            View Projects <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 py-7 text-lg border-white/10 hover:bg-white/5 group transition-all duration-300">
            Preview Resume <FileText className="ml-2 w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Scroll</span>
      </motion.div>
    </section>
  );
};
