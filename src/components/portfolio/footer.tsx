
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram, ExternalLink, Mail } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface FooterProps {
  config?: any;
  footerLayout?: any;
}

export const Footer = ({ config, footerLayout }: FooterProps) => {
  const [layout, setLayout] = useState(footerLayout);
  const socials = config?.socials || {};
  
  useEffect(() => {
    if (!footerLayout) {
      const fetchFooter = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'site_config', 'footer'));
          if (docSnap.exists()) setLayout(docSnap.data());
        } catch (e) {
          console.error("Footer Fetch Error:", e);
        }
      };
      fetchFooter();
    }
  }, [footerLayout]);

  const socialItems = [
    { icon: Github, href: socials.github },
    { icon: Twitter, href: socials.twitter },
    { icon: Linkedin, href: socials.linkedin },
    { icon: Instagram, href: socials.instagram }
  ].filter(item => item.href);

  const footerBio = layout?.bio || 'Fusing architectural precision with digital soul to build the next generation of web experiences.';
  const estMark = layout?.est || 'EST. 2025';
  const footerLinks = layout?.footerLinks || [
    { label: 'Home', href: '/' },
    { label: 'Selected Work', href: '/work' },
    { label: 'About Story', href: '/#about' },
    { label: 'Journal', href: '/blog' }
  ];

  return (
    <footer className="relative py-24 px-8 border-t border-white/10 bg-transparent overflow-hidden">
      <div className="max-w-[1700px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-24 lg:gap-40 pt-12 pb-2">
          {/* Brand Bio */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <h3 className="text-4xl md:text-6xl font-headline font-bold italic tracking-tighter text-white">Kartik Jindal.</h3>
              <p className="text-muted-foreground max-w-md text-xl md:text-2xl font-light leading-relaxed font-body">
                {footerBio}
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

          {/* Navigation */}
          <div className="lg:col-span-3 space-y-10">
            <h4 className="text-md uppercase tracking-[0.6em] font-black text-white/70">Navigation</h4>
            <ul className="space-y-6 font-body">
              {footerLinks.map((item: any, i: number) => (
                <li key={i}>
                  <Link href={item.href} className="text-white hover:text-primary transition-all flex items-center gap-3 group text-xl md:text-2xl">
                    {item.label}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Leads */}
          <div className="lg:col-span-5 space-y-10">
            <h4 className="text-md uppercase tracking-[0.6em] font-black text-white/70">Say Hello</h4>
            <div className="space-y-10 max-w-full">
              <a href={`mailto:${socials.email || 'kartikjindal2003@gmail.com'}`} className="block group max-w-full">
                <span className="text-sm uppercase tracking-widest text-primary font-black mb-3 block">General Enquiries</span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-headline border-b border-white/40 group-hover:border-primary transition-colors inline-block pb-1 break-all overflow-hidden leading-tight">
                  {socials.email || 'hello@kartikjindal.com'}
                </span>
              </a>
              <div className="pt-4 flex max-w-xl flex-col gap-4">
                <Link href="/blog" className="inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] font-black text-primary hover:text-white transition-colors py-5 px-6 rounded-full border border-primary/30 glass">
                  Visit the Journal
                </Link>
                <Link href="/work" className="inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] font-black text-white/80 hover:text-white transition-colors py-5 px-6 rounded-full border border-white/20 glass">
                  View Full Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-18 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-xs tracking-[0.4em] font-black text-white/60 uppercase">
          <div className="flex items-center gap-8">
            <span>&copy; {new Date().getFullYear()} Kartik Jindal</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
            <span className="hidden md:block">{estMark}</span>
          </div>
          
        </div>
      </div>
    </footer>
  );
};
