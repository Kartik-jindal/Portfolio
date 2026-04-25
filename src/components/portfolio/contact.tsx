
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="relative pt-24 pb-24 px-6 md:pt-64 overflow-hidden bg-transparent">
      {/* Local Background Atmosphere - Subtle spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 rounded-full glass border-white/5 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-accent mb-8 md:mb-12 relative">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Now accepting inquiries
            </div>
            
            <h2 className="text-[12vw] sm:text-[14vw] md:text-[8rem] lg:text-[10rem] font-headline font-black mb-12 md:mb-16 tracking-tighter leading-[1] md:leading-[0.8] animate-float break-words">
              LET'S CREATE <br /> 
              <span className="text-primary italic text-outline-primary">LEGACY</span>.
            </h2>

            <div className="flex justify-center w-full px-4 sm:px-0">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-8 md:px-16 md:py-12 text-lg sm:text-2xl md:text-3xl font-black bg-white text-black hover:bg-primary hover:text-primary-foreground transition-all duration-700 group relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
                  Start a Project <ArrowRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
