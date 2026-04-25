
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroScreen = () => {
  const [stage, setStage] = useState(0); // 0: Welcome, 1: Phrases, 2: Exiting
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Stage 0: Welcome (0-2s)
    const timer1 = setTimeout(() => {
      setStage(1);
    }, 2000);

    // Stage 2: Morphing Reveal (Starts at 4.5s)
    const timer2 = setTimeout(() => {
      setStage(2);
    }, 4500);

    // Completely remove after animation finishes (5.5s)
    const timer3 = setTimeout(() => {
      setIsVisible(false);
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (!isVisible) return null;

  const phrases = [
    { text: "DESIGN", step: "01" },
    { text: "BUILD", step: "02" },
    { text: "DEPLOY", step: "03" }
  ];

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          key="intro-container"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            transition: { 
              duration: 1.2, 
              ease: [0.85, 0, 0.15, 1],
              delay: 0.2
            } 
          }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* Atmospheric Background Layers */}
          <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" 
          />
          
          {/* Scanning Effect */}
          <motion.div 
            className="absolute inset-0 w-full h-[2px] bg-primary/20 z-10"
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 5, ease: "linear" }}
          />

          <div className="relative z-20 w-full">
            <AnimatePresence mode="wait">
              {stage === 0 && (
                <motion.div
                  key="welcome-stage"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(20px)" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-6"
                >
                  <span className="text-primary tracking-[1em] uppercase text-[10px] md:text-xs font-black mb-2 flex items-center gap-4">
                    <span className="w-12 h-px bg-primary/30" />
                    Initiating System
                    <span className="w-12 h-px bg-primary/30" />
                  </span>
                  <h1 className="text-8xl md:text-[10rem] font-headline font-black italic tracking-tighter text-gradient leading-none">
                    Welcome.
                  </h1>
                </motion.div>
              )}

              {stage === 1 && (
                <motion.div
                  key="phrases-stage"
                  className="relative flex flex-col md:flex-row items-center justify-center gap-20 md:gap-32 px-10"
                >
                  {/* Procedural Path Line */}
                  <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-px bg-white/5 -translate-y-1/2 z-0">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"
                    />
                  </div>

                  {phrases.map((item, i) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{ 
                        delay: i * 0.4, 
                        duration: 1.2, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="relative z-10 flex flex-col items-center group"
                    >
                      {/* Step Indicator */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (i * 0.4) + 0.3 }}
                        className="mb-6 flex flex-col items-center gap-2"
                      >
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] font-mono">STEP_{item.step}</span>
                        <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,1)]" />
                      </motion.div>

                      <span className="text-5xl md:text-7xl lg:text-8xl font-headline font-black text-white/90 group-hover:text-primary transition-all duration-700 tracking-[0.1em]">
                        {item.text}
                      </span>

                      {/* Path Status */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.5] }}
                        transition={{ delay: (i * 0.4) + 0.6 }}
                        className="mt-6 text-[9px] uppercase tracking-[0.5em] font-black text-white/30"
                      >
                        {i === 2 ? "READY_FOR_LAUNCH" : "SYNCING_NODE"}
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Persistent Progress Visualization */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-10">
            <div className="flex justify-between items-center mb-4 text-[10px] uppercase tracking-[0.5em] font-black text-white/30">
              <span>Optimizing Pipeline</span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                STABLE
              </motion.span>
            </div>
            <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-primary/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
