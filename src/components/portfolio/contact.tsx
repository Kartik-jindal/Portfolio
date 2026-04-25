
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin, Mail, ArrowRight, Instagram, ExternalLink } from 'lucide-react';

export const Contact = () => {
  return (
    <footer id="contact" className="relative pt-32 pb-12 px-6 md:pt-64 overflow-hidden bg-black">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grain opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-32 md:mb-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/5 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-accent mb-12 relative">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Now accepting inquiries
            </div>
            
            <h2 className="text-[12vw] md:text-[8rem] lg:text-[10rem] font-headline font-black mb-16 tracking-tighter leading-[0.8] animate-float">
              LET'S CREATE <br /> 
              <span className="text-primary italic text-outline-primary">LEGACY</span>.
            </h2>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="rounded-full px-12 py-10 md:px-16 md:py-12 text-xl md:text-3xl font-black bg-white text-black hover:bg-primary hover:text-primary-foreground transition-all duration-700 group relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10 flex items-center gap-4">
                  Start a Project <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 border-t border-white/5 pt-24 pb-12">
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-headline font-bold italic tracking-tighter">Kartik Jindal.</h3>
              <p className="text-muted-foreground/60 max-w-sm text-xl font-light leading-relaxed font-body">
                Fusing architectural precision with digital soul to build the next generation of web experiences.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" }
              ].map((social, i) => (
                <motion.a 
                  key={i} 
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-2xl glass border-white/5 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/20 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs uppercase tracking-[0.6em] font-black text-white/20">Navigation</h4>
            <ul className="space-y-4 font-body">
              {['Home', 'Selected Work', 'About Story', 'Journal'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground/80 hover:text-primary transition-all flex items-center gap-2 group text-xl">
                    {item}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs uppercase tracking-[0.6em] font-black text-white/20">Say Hello</h4>
            <div className="space-y-6">
              <a href="mailto:hello@kartikjindal.com" className="block group">
                <span className="text-sm uppercase tracking-widest text-primary font-black mb-1 block">General Enquiries</span>
                <span className="text-2xl md:text-3xl lg:text-4xl text-white font-headline border-b border-white/10 group-hover:border-primary transition-colors">
                  hello@kartikjindal.com
                </span>
              </a>
              <div className="pt-4">
                <a href="#" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] font-black text-white/40 hover:text-white transition-colors py-3 px-6 rounded-full border border-white/5 glass">
                  Download Portfolio PDF
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs tracking-[0.4em] font-black text-white/10 uppercase">
          <div className="flex items-center gap-8">
            <span>&copy; 2024 Kartik Jindal</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
            <span className="hidden md:block">EST. 2018</span>
          </div>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
