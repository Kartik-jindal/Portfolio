
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram, ExternalLink, Mail } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  config?: any;
  footerLayout?: any;
}

export const Footer = ({ config, footerLayout }: FooterProps) => {
  const layout = footerLayout;
  const socials = config?.socials || {};

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
    <footer className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 border-t border-white/10 bg-transparent overflow-hidden">
      <div className="max-w-[1700px] mx-auto relative z-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-10 xl:gap-20 2xl:gap-40 pt-12 pb-2">

          {/* Brand Bio — col 1–4 */}
          <div className="lg:col-span-4 space-y-8 lg:space-y-10">
            <div className="space-y-4 lg:space-y-6">
              <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-headline font-bold italic tracking-tighter text-white">
                Kartik Jindal
              </h3>
              <p className="text-muted-foreground max-w-sm lg:max-w-md text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed font-body">
                {footerBio}
              </p>
            </div>

            <div className="flex gap-3 lg:gap-4">
              {socialItems.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1, rotate: 5 }}
                  className="w-11 h-11 lg:w-14 lg:h-14 rounded-2xl glass border-white/10 flex items-center justify-center text-white/90 hover:text-primary hover:border-primary/40 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation — col 5–7 */}
          <div className="lg:col-span-3 space-y-8 lg:space-y-10">
            <h4 className="text-md uppercase tracking-[0.6em] font-black text-white/70">Navigation</h4>
            <ul className="space-y-4 lg:space-y-6 font-body">
              {footerLinks.map((item: any, i: number) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-white hover:text-primary transition-all flex items-center gap-3 group text-base md:text-lg lg:text-xl xl:text-2xl"
                  >
                    {item.label}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — col 8–12 */}
          <div className="lg:col-span-5 space-y-8 lg:space-y-10">
            <h4 className="text-md uppercase tracking-[0.6em] font-black text-white/70">Hello There!</h4>
            <div className="space-y-8 lg:space-y-10 max-w-full">
              <a
                href={`mailto:${socials.email || 'kartikjindal2003@gmail.com'}`}
                className="block group max-w-full min-w-0"
              >
                <span className="text-sm uppercase tracking-widest text-primary font-black mb-3 block">
                  General Enquiries
                </span>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-white font-headline border-b border-white/40 group-hover:border-primary transition-colors inline-block pb-1 break-all overflow-hidden leading-tight">
                  {socials.email || 'hello@kartikjindal.com'}
                </span>
              </a>

              <div className="pt-2 flex max-w-xl flex-col gap-3 lg:gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] font-black text-primary hover:text-white transition-colors py-4 lg:py-5 px-6 rounded-full border border-primary/30 glass"
                >
                  Visit the Journal
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] font-black text-white/80 hover:text-white transition-colors py-4 lg:py-5 px-6 rounded-full border border-white/20 glass"
                >
                  View Full Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 lg:mt-16 xl:mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs tracking-[0.4em] font-black text-white/60 uppercase">
          <div className="flex items-center gap-8">
            <span>&copy; {new Date().getFullYear()} Kartik Jindal</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
            <span className="hidden md:block">{estMark}</span>
          </div>
          <div className="flex items-center gap-6 text-white/30">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-300">
              Privacy Policy
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link href="/terms" className="hover:text-primary transition-colors duration-300">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
