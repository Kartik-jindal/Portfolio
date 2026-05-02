"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const IntroScreen = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isHome = pathname === '/';
  const [stage, setStage] = useState(0); // 0: Welcome, 1: Phrases, 2: Exiting
  const [isVisible, setIsVisible] = useState(false);

  const cleanup = () => {
    document.documentElement.classList.remove('loading-intro');
  };

  useEffect(() => {
    // Remove the loading state on any non-home route immediately
    if (isAdmin || !isHome) {
      cleanup();
      return;
    }

    // Skip for bots
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    if (isBot) {
      cleanup();
      return;
    }

    // Skip for users who prefer reduced motion — show content immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      cleanup();
      return;
    }

    setIsVisible(true);

    // Stage 0 → 1: Welcome (0–1s)
    const timer1 = setTimeout(() => setStage(1), 1000);

    // Pre-reveal: fade in page content 600ms before the intro slides away
    const timerReveal = setTimeout(() => {
      cleanup(); // Reveal the content
      const pageContent = document.getElementById('page-content');
      if (pageContent) pageContent.classList.add('intro-revealing');
    }, 2900);

    // Stage 1 → 2: Begin exit animation (3.5s)
    const timer2 = setTimeout(() => setStage(2), 3500);

    // Fully unmount after exit animation completes (4.8s)
    const timer3 = setTimeout(() => {
      setIsVisible(false);
      const pageContent = document.getElementById('page-content');
      if (pageContent) pageContent.classList.remove('intro-revealing');
    }, 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timerReveal);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage === 2) {
      cleanup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (!isVisible) return null;

  const phrases = [
    { text: "DESIGN", label: "Let's" },
    { text: "BUILD", label: "Then" },
    { text: "DEPLOY", label: "Finally" },
  ];

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          key="intro-container"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 1, ease: [0.85, 0, 0.15, 1], delay: 0.1 },
          }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* Atmospheric background */}
          <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]"
          />

          {/* Vertical scanning line */}
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
                        initial={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ delay: i * 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex flex-col items-center justify-center py-4"
                      >
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

          {/* Progress footer */}
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
                transition={{ duration: 3.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Skip button — appears after 1s, lets users bypass the intro */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            onClick={() => setStage(2)}
            className="absolute top-8 right-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white/60 transition-colors px-4 py-2 rounded-full border border-white/5 hover:border-white/20"
            aria-label="Skip intro"
          >
            Skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
