
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Selected Work", href: "#work" },
    { label: "The Vision", href: "#about" },
    { label: "The Path", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-headline font-black tracking-tighter cursor-pointer"
        >
          K<span className="text-primary italic">J.</span>
        </motion.div>

        {/* Desktop Nav - Floating Dock Style */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`hidden md:flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-700 glass ${isScrolled ? 'opacity-100' : 'opacity-0 translate-y-[-20px]'}`}
        >
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground hover:text-white transition-colors hover:bg-white/5 rounded-full"
            >
              {item.label}
            </a>
          ))}
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button className="px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-primary hover:text-white transition-colors">
            Resume
          </button>
        </motion.nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-12 h-12 flex items-center justify-center glass rounded-full" 
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-3xl z-[110] flex flex-col items-center justify-center gap-12 pointer-events-auto"
          >
            <button className="absolute top-10 right-10 w-16 h-16 flex items-center justify-center glass rounded-full" onClick={() => setIsMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setIsMenuOpen(false)}
                className="text-5xl font-headline font-bold text-white hover:text-primary transition-colors italic tracking-tighter"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
