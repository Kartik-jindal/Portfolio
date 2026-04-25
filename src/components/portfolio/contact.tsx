
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin, Mail, ArrowRight, Instagram } from 'lucide-react';

export const Contact = () => {
  return (
    <footer id="contact" className="pt-24 pb-12 px-6 md:pt-48 bg-gradient-to-t from-black/40 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="inline-block px-4 py-2 rounded-full glass border-white/10 text-sm font-bold text-accent mb-8">
              Available for New Projects
            </div>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-headline font-black mb-12 tracking-tighter">
              Let's build <br /> <span className="text-primary italic">something great</span>.
            </h2>
            <Button size="lg" className="rounded-full px-12 py-10 text-2xl font-bold bg-white text-black hover:bg-accent hover:text-accent-foreground transition-all duration-500 group">
              Start a Conversation <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-white/10 pt-24">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-headline font-bold mb-6 italic">Kartik Jindal</h3>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Based in the digital ether, delivering premium engineering and design globally.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-primary mb-6">Explore</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
              <li><a href="#work" className="hover:text-accent transition-colors">Selected Work</a></li>
              <li><a href="#about" className="hover:text-accent transition-colors">About Story</a></li>
              <li><a href="/blog" className="hover:text-accent transition-colors">Blog Archives</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-primary mb-6">Contact</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="mailto:hello@kartikjindal.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" /> hello@kartikjindal.com
              </a></li>
              <li><a href="#" className="hover:text-accent transition-colors underline decoration-accent/30 underline-offset-8">Download CV</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest font-bold text-white/20 uppercase">
          <span>&copy; 2024 Kartik Jindal</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
