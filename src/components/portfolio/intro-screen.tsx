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

    // Stage 2: Morphing Reveal (Starts at 5s)
    const timer2 = setTimeout(() => {
      setStage(2);
    }, 5000);

    // Completely remove after animation finishes (6s)
    const timer3 = setTimeout(() => {
      setIsVisible(false);
    }, 6000);

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
              duration: 1, 
              ease: [0.85, 0, 0.15, 1],
              delay: 0.1
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
          
          {/* Vertical Scanning Effect */}
          <motion.div 
            className="absolute inset-0 w-full h-[1px] bg-primary/20 z-10"
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 6, ease: "linear" }}
          />

          <div className="relative z-20 w-full max-w-7xl mx-auto px-10">
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
                  <h1 className="text-8xl md:text-[10rem] font-headline font-black italic tracking-tighter text-gradient leading-none">
                    Welcome.
                  </h1>
                </motion.div>
              )}

              {stage === 1 && (
                <motion.div
                  key="phrases-stage"
                  className="flex flex-col items-center w-full"
                >
                  {/* Transition Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center gap-4 mb-20"
                  >
                    <span className="text-primary font-black text-[10px] tracking-[0.8em] uppercase">The Vision</span>
                    <div className="flex items-center gap-6">
                      <span className="w-16 h-[1px] bg-white/5" />
                      <span className="text-4xl md:text-5xl font-headline italic font-light text-white/40 tracking-[0.15em]">Our Aim</span>
                      <span className="w-16 h-[1px] bg-white/5" />
                    </div>
                  </motion.div>

                  <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 w-full">
                    {/* Procedural Connection Path */}
                    <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-[1px] bg-white/5">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0"
                      />
                    </div>

                    {phrases.map((item, i) => (
                      <motion.div
                        key={item.text}
                        initial={{ 
                          opacity: 0, 
                          y: 40,
                          filter: "blur(15px)"
                        }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          filter: "blur(0px)"
                        }}
                        transition={{ 
                          delay: i * 0.4, 
                          duration: 1, 
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="relative z-10 flex flex-col items-center"
                      >
                        {/* Status Hub */}
                        <div className="mb-12 flex flex-col items-center gap-3">
                           <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: (i * 0.4) + 0.5 }}
                            className="w-3 h-3 rounded-full bg-primary shadow-[0_0_20px_rgba(16,185,129,1)] ring-8 ring-primary/5"
                           />
                           <span className="text-primary font-black text-[9px] tracking-[0.4em] font-mono mt-2">STEP_{item.step}</span>
                        </div>

                        <span className="text-5xl md:text-7xl lg:text-8xl font-headline font-black text-white tracking-[0.05em] mb-4">
                          {item.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Persistent Progress Footer */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-lg px-10">
            <div className="flex justify-between items-end mb-4 font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/30">Optimizing Kernel</span>
                <span className="text-[10px] text-primary font-bold">STABLE_V2.0</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/30">Pipeline</span>
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[10px] text-white font-bold"
                >
                  LOADING...
                </motion.span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-primary/40 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};