
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Send, X, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    hp: '' // Honeypot field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Honeypot Check
    if (formData.hp) {
      console.warn("Spam detected.");
      setSubmitted(true);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'contact_leads'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'new',
        createdAt: serverTimestamp(),
        metadata: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown'
        }
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', hp: '' });
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative pt-24 pb-24 px-6 md:pt-64 overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 rounded-full glass border-white/5 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-accent mb-8 md:mb-12 relative">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Now accepting inquiries
            </div>
            
            <h2 className="text-[12vw] sm:text-[14vw] md:text-[8rem] lg:text-[10rem] font-headline font-black mb-12 md:mb-16 tracking-tighter leading-[1] md:leading-[0.8] animate-float break-words">
              LET'S CREATE <br /> 
              <span className="text-primary italic text-outline-primary">LEGACY</span>.
            </h2>

            <div className="flex justify-center w-full px-4 sm:px-0">
              <Button 
                onClick={() => setIsOpen(true)}
                size="lg" 
                className="rounded-full px-8 py-8 md:px-16 md:py-12 text-lg sm:text-2xl md:text-3xl font-black bg-white text-black hover:bg-primary hover:text-primary-foreground transition-all duration-700 group relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] w-full sm:w-auto cursor-none"
                data-cursor="Connect"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
                  Start a Project <ArrowRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl bg-background/95 backdrop-blur-3xl border-white/5 p-8 rounded-[2.5rem] shadow-2xl outline-none z-[5000] cursor-none">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-headline font-black italic tracking-tighter text-white">Message Transmitted.</h3>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] font-black">Syncing with Central Command...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <DialogHeader>
                  <DialogTitle className="text-4xl font-headline font-black italic tracking-tighter text-white">Inquiry Payload.</DialogTitle>
                  <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">Provide project coordinates below</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field (hidden) */}
                  <div className="hidden">
                    <Input 
                      type="text" 
                      value={formData.hp} 
                      onChange={(e) => setFormData({...formData, hp: e.target.value})} 
                      tabIndex={-1} 
                      autoComplete="off" 
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</Label>
                      <Input 
                        required
                        className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-primary/50" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Address</Label>
                      <Input 
                        required
                        type="email"
                        className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-primary/50" 
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Subject</Label>
                    <Input 
                      required
                      className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-primary/50" 
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Brief Message</Label>
                    <Textarea 
                      required
                      className="bg-white/5 border-white/5 min-h-[120px] rounded-xl focus:border-primary/50" 
                      placeholder="Describe your vision..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:bg-accent group"
                  >
                    {loading ? 'Transmitting...' : (
                      <span className="flex items-center gap-3">
                        Send Transmission <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};
