
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Send, X, CheckCircle2, Globe, Shield } from 'lucide-react';
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
  DialogDescription,
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
    hp: '' // Honeypot field for bot protection
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Honeypot Check
    if (formData.hp) {
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
          platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
        }
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', hp: '' });
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 4000);
    } catch (err) {
      console.error("Transmission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative pt-32 pb-48 px-6 md:pt-64 overflow-hidden bg-transparent">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/10 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary mb-12">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              TRANSMISSION_READY
            </div>
            
            <h2 className="text-[12vw] sm:text-[14vw] md:text-[8rem] lg:text-[11rem] font-headline font-black mb-16 tracking-tighter leading-[0.8] text-gradient break-words">
              START A <br /> 
              <span className="text-outline-primary italic">PROJECT</span>.
            </h2>

            <div className="flex justify-center">
              <Button 
                onClick={() => setIsOpen(true)}
                size="lg" 
                className="h-28 md:h-36 rounded-full px-12 md:px-24 text-xl md:text-4xl font-black bg-white text-black hover:bg-primary hover:text-black transition-all duration-700 group relative overflow-hidden shadow-2xl cursor-none"
                data-cursor="Initiate"
              >
                <span className="relative z-10 flex items-center gap-4">
                  Deploy Vision <ArrowRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-[#050505]/98 backdrop-blur-3xl border-white/5 p-0 rounded-[3rem] shadow-2xl outline-none z-[5000] cursor-none overflow-hidden">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="py-24 text-center space-y-8 px-12"
              >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 relative">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-headline font-black italic tracking-tighter text-white">Mission Received.</h3>
                  <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-black">Transmission logged in central command</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <div className="h-48 relative overflow-hidden flex items-center px-12 border-b border-white/5">
                  <div className="absolute inset-0 bg-primary/5 z-0" />
                  <div className="relative z-10 space-y-2">
                    <DialogTitle className="text-5xl font-headline font-black italic tracking-tighter text-white">Inquiry Payload.</DialogTitle>
                    <DialogDescription className="text-white/30 text-[10px] uppercase font-black tracking-[0.4em]">Initialize project architectural parameters</DialogDescription>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="absolute top-10 right-10 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-20 group"
                  >
                    <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                  <div className="hidden">
                    <Input type="text" value={formData.hp} onChange={(e) => setFormData({...formData, hp: e.target.value})} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Identity</Label>
                      <Input 
                        required
                        className="bg-white/[0.03] border-white/5 h-14 rounded-2xl focus:border-primary/50 text-white placeholder:text-white/10" 
                        placeholder="Commander Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Communication Link</Label>
                      <Input 
                        required
                        type="email"
                        className="bg-white/[0.03] border-white/5 h-14 rounded-2xl focus:border-primary/50 text-white placeholder:text-white/10" 
                        placeholder="email@coordinates.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Mission Objective</Label>
                    <Input 
                      required
                      className="bg-white/[0.03] border-white/5 h-14 rounded-2xl focus:border-primary/50 text-white placeholder:text-white/10" 
                      placeholder="e.g. Next-Gen Web Architecture"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Strategic Narrative</Label>
                    <Textarea 
                      required
                      className="bg-white/[0.03] border-white/5 min-h-[160px] rounded-[2rem] focus:border-primary/50 text-white placeholder:text-white/10 p-6 resize-none" 
                      placeholder="Describe the requirements of your vision..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-20 rounded-full bg-primary text-black font-black uppercase tracking-[0.4em] text-sm hover:bg-accent transition-all group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? 'Transmitting...' : (
                        <>Send Transmission <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Button>

                  <div className="flex items-center justify-center gap-6 pt-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
                    <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> Secure_Channel</span>
                    <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Global_Sync</span>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};
