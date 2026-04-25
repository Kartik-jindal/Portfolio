
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Works", href: "#work" },
    { label: "Vision", href: "#about" },
    { label: "Timeline", href: "#experience" },
    { label: "Connect", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 flex justify-between items-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-headline font-black tracking-tighter cursor-pointer group"
        >
          K<span className="text-primary italic group-hover:translate-x-1 inline-block transition-transform">J.</span>
        </motion.div>

        {/* Desktop Nav - Floating Dock */}
        <div className="hidden md:flex items-center gap-4">
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-700 glass ${isScrolled ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-6 py-2 text-[10px] uppercase tracking-[0.5em] font-black text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-full"
              >
                {item.label}
              </a>
            ))}
          </motion.nav>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black text-[10px] uppercase font-black tracking-widest hover:bg-primary transition-colors group"
          >
            Resume <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-12 h-12 flex items-center justify-center glass rounded-full" 
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background/98 backdrop-blur-3xl z-[110] flex flex-col items-center justify-center gap-16 pointer-events-auto"
          >
            <button 
              className="absolute top-10 right-10 w-16 h-16 flex items-center justify-center glass rounded-full" 
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-6xl font-headline font-bold text-white hover:text-primary transition-colors italic tracking-tighter"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
