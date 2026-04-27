
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const Hero = ({ initialData }: { initialData?: any }) => {
  const [data, setData] = useState(initialData);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    if (!initialData) {
      const fetchHero = async () => {
        const docSnap = await getDoc(doc(db, 'site_config', 'hero'));
        if (docSnap.exists()) setData(docSnap.data());
      };
      fetchHero();
    }
  }, [initialData]);

  const content = data || {
    badge: "Full Stack Architect",
    titleMain: "KARTIK",
    titleHighlight: "JINDAL",
    description: "Engineering high-fidelity digital landscapes where architectural precision meets artistic motion.",
    ctaPrimary: "Start a Project",
    ctaSecondary: "Explore Work"
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={targetRef} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-12 md:py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-[2]" />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl w-full mx-auto my-6 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 md:mb-6"
        >
          <span className="flex items-center gap-2 text-primary tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-[12px] font-black bg-primary/5 px-6 md:px-8 py-2 md:py-3 rounded-full border border-primary/20 backdrop-blur-xl">
            <Sparkles className="w-3 h-3 text-primary" />
            {content.badge}
          </span>
        </motion.div>

        <div className="relative mb-12 md:mb-16 w-full overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] sm:text-[14vw] md:text-[9rem] my-4 font-headline font-black leading-[1.1] md:leading-[1.2] tracking-tight text-gradient px-4 break-words"
          >
            {content.titleMain} <span className="text-outline italic">{content.titleHighlight}</span>
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "40%" }}
            transition={{ duration: 2, delay: 0.6, ease: "circOut" }}
            className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-8 md:mt-12 mx-auto"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="max-w-2xl text-lg md:text-2xl text-white/60 mb-12 md:mb-16 font-body font-light leading-relaxed px-4 md:px-6 break-words"
        >
          {content.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.3, ease: "backOut" }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-6 sm:px-0"
        >
          <Button 
            onClick={scrollToContact}
            size="lg" 
            className="h-16 rounded-full px-12 text-lg font-black bg-white text-black hover:bg-primary transition-all duration-500 hover:scale-105 shadow-2xl group relative overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-2">
              {content.ctaPrimary} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-16 rounded-full px-12 text-lg font-black border-white/10 hover:bg-white/5 transition-all duration-500 backdrop-blur-md w-full sm:w-auto"
          >
            {content.ctaSecondary}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
