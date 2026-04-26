
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Send, X, CheckCircle2, Globe, Shield, Terminal } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
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

export const Contact = ({ initialData }: { initialData?: any }) => {
  const [data, setData] = useState(initialData);
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

  useEffect(() => {
    if (!initialData) {
      const fetchContact = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'site_config', 'contact'));
          if (docSnap.exists()) setData(docSnap.data());
        } catch (e) {
          console.error("Contact Config Error:", e);
        }
      };
      fetchContact();
    }
  }, [initialData]);

  // Fallback defaults strictly following the original high-fidelity design
  const content = data || {
    badge: 'TRANSMISSION_READY',
    headlineMain: 'START A',
    headlineHighlight: 'PROJECT',
    triggerButtonText: 'Deploy Vision',
    dialogTitle: 'Inquiry Payload.',
    dialogSubtitle: 'Initialize project architectural parameters',
    labels: {
      name: 'Identity',
      email: 'Communication Link',
      subject: 'Mission Objective',
      message: 'Strategic Narrative'
    },
    placeholders: {
      name: 'Commander Name',
      email: 'email@coordinates.com',
      subject: 'e.g. Next-Gen Web Architecture',
      message: 'Describe the requirements of your vision...'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple honeypot check
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
    <section id="contact" className="relative pt-48 pb-64 px-6 overflow-hidden bg-transparent">
      {/* Intense Dynamic Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.2),transparent_60%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Glass Badge */}
            <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full glass border-white/10 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-primary mb-16 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              {content.badge}
            </div>
            
            {/* Massive Cinematic Headline */}
            <h2 className="text-[14vw] sm:text-[14vw] md:text-[10rem] lg:text-[13rem] font-headline font-black mb-20 tracking-tighter leading-[0.75] text-gradient break-words">
              {content.headlineMain} <br /> 
              <span className="text-outline-primary italic">{content.headlineHighlight}</span>
            </h2>

            {/* Giant Action Button */}
            <div className="flex justify-center">
              <Button 
                onClick={() => setIsOpen(true)}
                size="lg" 
                className="h-32 md:h-44 rounded-full px-16 md:px-32 text-2xl md:text-5xl font-black bg-white text-black hover:bg-primary hover:text-black transition-all duration-700 group relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] cursor-none active:scale-95"
                data-cursor="Initiate"
              >
                <span className="relative z-10 flex items-center gap-6">
                  {content.triggerButtonText} <ArrowRight className="w-10 h-10 md:w-14 md:h-14 group-hover:translate-x-3 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-[0.16,1,0.3,1]" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-[#030303]/95 backdrop-blur-[50px] border-white/5 p-0 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] outline-none z-[5000] cursor-none overflow-hidden ring-1 ring-white/10">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} 
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="py-32 text-center space-y-10 px-12"
              >
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 relative">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-5xl font-headline font-black italic tracking-tighter text-white leading-none">Mission Received.</h3>
                  <p className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-black">Transmission logged in central command</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <div className="h-64 relative overflow-hidden flex items-center px-16 border-b border-white/5 bg-white/[0.02]">
                  <div className="absolute inset-0 bg-primary/5 z-0" />
                  {/* Procedural Pattern Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3 text-primary/60 mb-2">
                       <Terminal className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em]">Secure_Link_Established</span>
                    </div>
                    <DialogTitle className="text-6xl font-headline font-black italic tracking-tighter text-white leading-none">{content.dialogTitle}</DialogTitle>
                    <DialogDescription className="text-white/30 text-[10px] uppercase font-black tracking-[0.5em]">{content.dialogSubtitle}</DialogDescription>
                  </div>
                  
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="absolute top-12 right-12 w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all z-20 group border-white/10"
                  >
                    <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-16 space-y-10">
                  {/* Bot Protection */}
                  <div className="hidden">
                    <Input type="text" value={formData.hp} onChange={(e) => setFormData({...formData, hp: e.target.value})} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.name}</Label>
                      <Input 
                        required
                        className="bg-white/[0.04] border-white/5 h-16 rounded-2xl focus:border-primary/50 text-white placeholder:text-white/10 text-lg px-6 transition-all" 
                        placeholder={content.placeholders.name}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.email}</Label>
                      <Input 
                        required
                        type="email"
                        className="bg-white/[0.04] border-white/5 h-16 rounded-2xl focus:border-primary/50 text-white placeholder:text-white/10 text-lg px-6 transition-all" 
                        placeholder={content.placeholders.email}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.subject}</Label>
                    <Input 
                      required
                      className="bg-white/[0.04] border-white/5 h-16 rounded-2xl focus:border-primary/50 text-white placeholder:text-white/10 text-lg px-6 transition-all" 
                      placeholder={content.placeholders.subject}
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.message}</Label>
                    <Textarea 
                      required
                      className="bg-white/[0.04] border-white/5 min-h-[200px] rounded-[2.5rem] focus:border-primary/50 text-white placeholder:text-white/10 p-8 resize-none text-lg leading-relaxed transition-all" 
                      placeholder={content.placeholders.message}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-24 rounded-full bg-primary text-black font-black uppercase tracking-[0.5em] text-sm hover:bg-accent transition-all duration-500 group relative overflow-hidden shadow-2xl"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? 'Transmitting...' : (
                        <>Send Transmission <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" /></>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </Button>

                  <div className="flex items-center justify-center gap-10 pt-6 text-[10px] font-black uppercase tracking-[0.6em] text-white/20">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-primary/40" />
                      <span>Secure_Vault</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-primary/40" />
                      <span>Global_Sync</span>
                    </div>
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
