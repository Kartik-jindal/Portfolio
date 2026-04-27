
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const IntroScreen = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [stage, setStage] = useState(0); // 0: Welcome, 1: Phrases, 2: Exiting
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isAdmin) {
      setIsVisible(false);
      return;
    }

    // Skip for bots to improve LCP/performance scores
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    if (isBot) {
      setIsVisible(false);
      return;
    }
    
    setIsVisible(true);

    // Stage 0: Welcome (0-2s)
    const timer1 = setTimeout(() => {
      setStage(1);
    }, 2000);

    // Stage 2: Reveal Home (Starts at 5s)
    const timer2 = setTimeout(() => {
      setStage(2);
    }, 5000);

    // Completely remove after animation finishes (8s)
    const timer3 = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isAdmin]);

  if (!hasMounted || !isVisible || isAdmin) return null;

  const phrases = [
    { text: "DESIGN", label: "Let's" },
    { text: "BUILD", label: "Then" },
    { text: "DEPLOY", label: "Finally" }
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

          <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
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
                  <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-headline font-black italic tracking-tighter text-gradient leading-none text-center text-white">
                    Welcome.
                  </h1>
                </motion.div>
              )}

              {stage === 1 && (
                <motion.div
                  key="phrases-stage"
                  className="flex flex-col items-center w-full"
                >
                  <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 w-full max-w-6xl">
                    {phrases.map((item, i) => (
                      <motion.div
                        key={item.text}
                        initial={{ 
                          opacity: 0, 
                          scale: 1.2,
                          filter: "blur(20px)",
                        }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        transition={{ 
                          delay: i * 0.4, 
                          duration: 1.2, 
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="relative z-10 flex flex-col items-center justify-center py-4"
                      >
                        {/* Narrative Label */}
                        <div className="mb-2 md:mb-4 h-6 flex items-center justify-center">
                           <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (i * 0.4) + 0.5, duration: 0.4 }}
                            className="text-primary font-black text-[10px] md:text-xs tracking-[0.4em] uppercase"
                           >
                            {item.label}
                           </motion.span>
                        </div>

                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-headline font-black text-white leading-none text-center tracking-tight px-2">
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
          <div className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-lg px-8">
            <div className="flex justify-center items-end mb-4 font-mono">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[9px] md:text-[10px] text-white/50 font-bold tracking-[0.4em]"
              >
                LOADING...
              </motion.span>
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
