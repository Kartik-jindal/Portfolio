
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Send, X, CheckCircle2, Globe, Shield, Terminal } from 'lucide-react';
import { db } from '@/lib/firebase/firestore';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  hp: z.string().optional(),
});

type ContactFormData = z.infer<typeof ContactSchema>;

export const Contact = ({ initialData }: { initialData?: any }) => {
  const [data, setData] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
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

  const content = data || {
    badge: 'Now accepting inquiries',
    headlineMain: "LET'S CREATE",
    headlineHighlight: 'LEGACY',
    triggerButtonText: 'Start a Project',
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

  const onSubmit = async (formData: ContactFormData) => {
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
      reset();
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
              {content.badge}
            </div>

            <h2 className="text-[12vw] sm:text-[14vw] md:text-[8rem] lg:text-[10rem] font-headline font-black mb-12 md:mb-16 tracking-tighter leading-[1.1] md:leading-[0.8] animate-float break-words">
              {content.headlineMain} <br />
              <span className="text-primary italic text-outline-primary">{content.headlineHighlight}</span>
            </h2>

            <div className="flex justify-center w-full px-4 sm:px-0">
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="rounded-full px-8 py-6 md:px-12 md:py-9 text-base sm:text-xl md:text-2xl font-black bg-white text-black hover:bg-primary hover:text-primary-foreground transition-all duration-700 group relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] w-full sm:w-auto cursor-none"
                data-cursor="Initiate"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
                  {content.triggerButtonText} <ArrowRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-[#030303]/95 backdrop-blur-[50px] border-white/5 p-0 rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] outline-none z-[5000] cursor-none overflow-hidden ring-1 ring-white/10">
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
                <div className="h-auto min-h-[120px] sm:h-48 relative overflow-hidden flex items-center px-6 sm:px-12 py-6 sm:py-0 border-b border-white/5 bg-white/[0.02]">
                  <div className="absolute inset-0 bg-primary/5 z-0" />
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-3 text-primary/60 mb-2">
                      <Terminal className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Secure_Link_Established</span>
                    </div>
                    <DialogTitle className="text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-white leading-none">{content.dialogTitle}</DialogTitle>
                    <DialogDescription className="text-white/30 text-[9px] uppercase font-black tracking-[0.4em]">{content.dialogSubtitle}</DialogDescription>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 sm:top-10 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all z-20 group border-white/10"
                  >
                    <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 md:p-12 space-y-8">
                  <div className="hidden">
                    <Input {...register('hp')} type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5 md:gap-8">
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.name}</Label>
                      <Input
                        {...register('name')}
                        className={`bg-white/[0.04] border-white/5 h-14 rounded-xl focus:border-primary/50 text-white placeholder:text-white/10 text-base px-6 transition-all ${errors.name ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                        placeholder={content.placeholders.name}
                      />
                      {errors.name && (
                        <p className="text-[9px] text-destructive font-black uppercase tracking-widest ml-2">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.email}</Label>
                      <Input
                        {...register('email')}
                        type="email"
                        className={`bg-white/[0.04] border-white/5 h-14 rounded-xl focus:border-primary/50 text-white placeholder:text-white/10 text-base px-6 transition-all ${errors.email ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                        placeholder={content.placeholders.email}
                      />
                      {errors.email && (
                        <p className="text-[9px] text-destructive font-black uppercase tracking-widest ml-2">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.subject}</Label>
                    <Input
                      {...register('subject')}
                      className={`bg-white/[0.04] border-white/5 h-14 rounded-xl focus:border-primary/50 text-white placeholder:text-white/10 text-base px-6 transition-all ${errors.subject ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                      placeholder={content.placeholders.subject}
                    />
                    {errors.subject && (
                      <p className="text-[9px] text-destructive font-black uppercase tracking-widest ml-2">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.message}</Label>
                    <Textarea
                      {...register('message')}
                      className={`bg-white/[0.04] border-white/5 min-h-[160px] rounded-2xl focus:border-primary/50 text-white placeholder:text-white/10 p-6 resize-none text-base leading-relaxed transition-all ${errors.message ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                      placeholder={content.placeholders.message}
                    />
                    {errors.message && (
                      <p className="text-[9px] text-destructive font-black uppercase tracking-widest ml-2">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-20 rounded-full bg-primary text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-accent transition-all duration-500 group relative overflow-hidden shadow-2xl"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? 'Transmitting...' : (
                        <>Send Transmission <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </Button>

                  <div className="flex items-center justify-center gap-8 pt-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-primary/40" />
                      <span>Secure_Vault</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-primary/40" />
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
