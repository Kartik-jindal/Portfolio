
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface NavbarProps {
  resumeUrl?: string;
  navConfig?: any;
}

export const Navbar = ({ resumeUrl, navConfig }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [config, setConfig] = useState(navConfig);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navConfig) {
      const fetchNav = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'site_config', 'navbar'));
          if (docSnap.exists()) setConfig(docSnap.data());
        } catch (e) {
          console.error("Navbar Config Error:", e);
        }
      };
      fetchNav();
    }
  }, [navConfig]);

  const navItems = config?.navItems || [
    { label: "Works", href: "/work" },
    { label: "Vision", href: "/#about" },
    { label: "Timeline", href: "/#experience" },
    { label: "Journal", href: "/blog" },
    { label: "Connect", href: "/#contact" },
  ];

  const scrollToContact = () => {
    setIsMenuOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <div className="max-w-[1700px] mx-auto px-8 py-8 md:py-8 flex justify-between items-center pointer-events-auto">
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-headline font-black tracking-tighter cursor-pointer group"
          >
            K<span className="text-primary italic group-hover:translate-x-1 inline-block transition-transform">J.</span>
          </motion.div>
        </Link>

        {/* Desktop Nav - Floating Dock */}
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
                className="px-6 py-2 text-[12px] uppercase tracking-[0.4em] font-black text-white/50 hover:text-primary transition-colors hover:bg-primary/5 rounded-full"
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>

          <div className="flex items-center gap-3">
             <button
                onClick={scrollToContact}
                className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-black text-[12px] uppercase font-black tracking-widest hover:bg-accent transition-all group"
              >
                Start Project <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              </button>
            
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <button
                  className="flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white text-[12px] uppercase font-black tracking-widest hover:bg-white/10 transition-colors group backdrop-blur-md"
                >
                  CV <ArrowUpRight className="w-3 h-3" />
                </button>
              </a>
            )}
          </div>
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
              {navItems.map((item: any, i: number) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-6xl font-headline font-bold text-white hover:text-primary transition-colors italic tracking-tighter block text-center"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ))}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={scrollToContact}
                className="mt-8 px-12 py-6 rounded-full bg-primary text-black font-black uppercase tracking-widest text-xl"
              >
                Start Project
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
