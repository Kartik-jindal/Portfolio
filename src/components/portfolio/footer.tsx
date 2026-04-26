
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram, ExternalLink, Mail } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  config?: any;
}

export const Footer = ({ config }: FooterProps) => {
  const socials = config?.socials || {};
  
  const socialItems = [
    { icon: Github, href: socials.github },
    { icon: Twitter, href: socials.twitter },
    { icon: Linkedin, href: socials.linkedin },
    { icon: Instagram, href: socials.instagram }
  ].filter(item => item.href);

  return (
    <footer className="relative py-12 px-6 border-t border-white/10 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 pt-12 pb-12">
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h3 className="text-4xl md:text-6xl font-headline font-bold italic tracking-tighter text-white">Kartik Jindal.</h3>
              <p className="text-muted-foreground max-w-md text-xl md:text-2xl font-light leading-relaxed font-body">
                Fusing architectural precision with digital soul to build the next generation of web experiences.
              </p>
            </div>
            
            <div className="flex gap-4">
              {socialItems.map((social, i) => (
                <motion.a 
                  key={i} 
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center text-white/90 hover:text-primary hover:border-primary/40 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-md uppercase tracking-[0.6em] font-black text-white/70">Navigation</h4>
            <ul className="space-y-6 font-body">
              {[
                { label: 'Home', href: '/' },
                { label: 'Selected Work', href: '/work' },
                { label: 'About Story', href: '/#about' },
                { label: 'Journal', href: '/blog' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white hover:text-primary transition-all flex items-center gap-3 group text-xl md:text-2xl">
                    {item.label}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-md uppercase tracking-[0.6em] font-black text-white/70">Say Hello</h4>
            <div className="space-y-8">
              <a href={`mailto:${socials.email || 'hello@kartikjindal.com'}`} className="block group">
                <span className="text-sm uppercase tracking-widest text-primary font-black mb-2 block">General Enquiries</span>
                <span className="text-2xl md:text-3xl lg:text-4xl text-white font-headline border-b border-white/40 group-hover:border-primary transition-colors inline-block pb-1 break-all">
                  {socials.email || 'hello@kartikjindal.com'}
                </span>
              </a>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/blog" className="inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] font-black text-primary hover:text-white transition-colors py-4 px-8 rounded-full border border-primary/30 glass">
                  Visit the Journal
                </Link>
                <Link href="/work" className="inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] font-black text-white/80 hover:text-white transition-colors py-4 px-8 rounded-full border border-white/20 glass">
                  View Full Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs tracking-[0.4em] font-black text-white/60 uppercase">
          <div className="flex items-center gap-8">
            <span>&copy; {new Date().getFullYear()} Kartik Jindal</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
            <span className="hidden md:block">EST. 2025</span>
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
