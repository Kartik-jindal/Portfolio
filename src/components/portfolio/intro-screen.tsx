
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroScreen = () => {
  const [stage, setStage] = useState(0); // 0: Welcome, 1: Phrases, 2: Hidden
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Stage 0: Welcome (0-2s)
    const timer1 = setTimeout(() => {
      setStage(1);
    }, 2000);

    // Stage 2: Fade out whole screen (5s total)
    const timer2 = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(161,240,217,0.05),transparent_70%)]" />

      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-primary tracking-[0.8em] uppercase text-[10px] md:text-xs font-black mb-2">Initiating</span>
              <h1 className="text-7xl md:text-9xl font-headline font-black italic tracking-tighter text-gradient">
                Welcome.
              </h1>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="phrases"
              className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
            >
              {["DESIGN", "BUILD", "DEPLOY"].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ 
                    delay: i * 0.4, 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="relative group"
                >
                  <span className="text-4xl md:text-6xl lg:text-7xl font-headline font-black tracking-widest text-white/90 group-hover:text-primary transition-colors duration-500">
                    {text}
                    {i < 2 && (
                      <span className="hidden md:inline-block ml-16 w-1 h-1 rounded-full bg-primary/30" />
                    )}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Line */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-primary/20"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </motion.div>
  );
};
