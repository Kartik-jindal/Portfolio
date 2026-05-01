"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  resumeUrl?: string;
  navConfig?: any;
}

export const Navbar = ({ resumeUrl, navConfig }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navItems = navConfig?.navItems || [
    { label: "Home", href: "/" },
    { label: "Works", href: "/work" },
    { label: "Vision", href: "/#about" },
    { label: "Timeline", href: "/#experience" },
    { label: "Journal", href: "/blog" },
  ];

  const openContactForm = () => {
    setIsMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-contact'));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 flex justify-between items-center pointer-events-auto">

        {/* Logo — KJ. */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-headline font-black tracking-tighter cursor-pointer group"
          >
            K<span className="text-primary italic group-hover:translate-x-1 inline-block transition-transform">J.</span>
          </motion.div>
        </Link>

        {/* Desktop Nav — Floating Dock */}
        <div className="hidden md:flex items-center gap-4">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-700 glass ${isScrolled ? 'bg-black/40 backdrop-blur-2xl border-white/10' : 'bg-transparent'}`}
          >
            {navItems.map((item: any) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-6 py-3 text-[12px] uppercase tracking-[0.4em] font-black text-white/50 hover:text-primary transition-colors hover:bg-primary/5 rounded-full"
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>

          <div className="flex items-center gap-3">
            <button
              onClick={openContactForm}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-black text-[12px] uppercase font-black tracking-widest hover:bg-accent transition-all group"
            >
              Start Project <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
            </button>

            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-[12px] uppercase font-black tracking-widest hover:bg-white/10 transition-colors group backdrop-blur-md">
                  Resume <ArrowUpRight className="w-3 h-3" />
                </button>
              </a>
            )}
          </div>
        </div>

        {/* Mobile Hamburger — right side */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:hidden relative w-12 h-12 flex items-center justify-center glass rounded-full pointer-events-auto z-[120]"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {/* Animated hamburger lines */}
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          <div className="w-5 h-4 flex flex-col justify-between">
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block h-[2px] w-full bg-primary rounded-full origin-center"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block h-[2px] w-full bg-white/60 rounded-full"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block h-[2px] w-full bg-primary rounded-full origin-center"
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-background/98 backdrop-blur-3xl z-[110] flex flex-col pointer-events-auto"
            onClick={() => setIsMenuOpen(false)}
          >
            {/* Grain overlay for consistency */}
            <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />

            {/* Radial glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Nav links — centered */}
            <nav className="flex-1 flex flex-col items-start justify-center px-8 sm:px-12 gap-2" onClick={(e) => e.stopPropagation()}>
              {navItems.map((item: any, i: number) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.07 + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary/40 w-6 tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="text-4xl sm:text-5xl font-headline font-bold italic tracking-tighter text-white/80 group-hover:text-primary transition-colors duration-300">
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Bottom action row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="px-8 sm:px-12 pb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={openContactForm}
                className="flex items-center gap-2 px-7 py-4 rounded-full bg-primary text-black text-[12px] uppercase font-black tracking-widest hover:bg-accent transition-all group"
              >
                Start Project <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              </button>

              {resumeUrl && (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 px-7 py-4 rounded-full bg-white/5 border border-white/10 text-white text-[12px] uppercase font-black tracking-widest hover:bg-white/10 transition-colors group backdrop-blur-md">
                    Resume <ArrowUpRight className="w-3 h-3" />
                  </button>
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
