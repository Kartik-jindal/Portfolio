
"use client";

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[90] hidden lg:flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <span className="text-[9px] uppercase tracking-[0.5em] text-white/20 font-black vertical-text [writing-mode:vertical-lr] rotate-180">
          Progress
        </span>
        <div className="h-40 w-[1px] bg-white/5 relative overflow-hidden">
          <motion.div 
            style={{ scaleY }}
            className="absolute top-0 left-0 w-full h-full bg-primary origin-top"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            className="w-1 h-1 rounded-full bg-white/10"
            whileHover={{ scale: 2, backgroundColor: 'var(--primary)' }}
          />
        ))}
      </div>
    </div>
  );
};
