"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, X, CheckCircle2, Globe, Shield, Terminal } from 'lucide-react';
import { db } from '@/lib/firebase/firestore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
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

/**
 * GlobalContactDialog — mounted in the root layout so the "Start Project"
 * button in the Navbar can open the contact form from ANY page by dispatching
 * the 'open-contact' custom event on window.
 */
export const GlobalContactDialog = () => {
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
        const handler = () => setIsOpen(true);
        window.addEventListener('open-contact', handler);
        return () => window.removeEventListener('open-contact', handler);
    }, []);

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
                },
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

    const content = {
        dialogTitle: 'Inquiry Payload.',
        dialogSubtitle: 'Initialize project architectural parameters',
        labels: {
            name: 'Identity',
            email: 'Communication Link',
            subject: 'Mission Objective',
            message: 'Strategic Narrative',
        },
        placeholders: {
            name: 'Commander Name',
            email: 'email@coordinates.com',
            subject: 'e.g. Next-Gen Web Architecture',
            message: 'Describe the requirements of your vision...',
        },
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl bg-[#030303]/95 backdrop-blur-[50px] border-white/5 p-0 rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] outline-none z-[5000] cursor-none overflow-hidden ring-1 ring-white/10 max-h-[90dvh] flex flex-col">
                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="py-16 sm:py-24 md:py-32 text-center space-y-8 px-6 sm:px-12"
                        >
                            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 relative">
                                <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary" />
                                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-white leading-none">
                                    Mission Received.
                                </h3>
                                <p className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-black">
                                    Transmission logged in central command
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-0">
                            {/* Header */}
                            <div className="relative overflow-hidden flex items-center px-6 sm:px-12 py-5 sm:py-8 border-b border-white/5 bg-white/[0.02] shrink-0">
                                <div className="absolute inset-0 bg-primary/5 z-0" />
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                                <div className="relative z-10 space-y-1.5 pr-14 sm:pr-16">
                                    <div className="flex items-center gap-3 text-primary/60 mb-2">
                                        <Terminal className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Secure_Link_Established</span>
                                    </div>
                                    <DialogTitle className="text-2xl sm:text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-white leading-none">
                                        {content.dialogTitle}
                                    </DialogTitle>
                                    <DialogDescription className="text-white/30 text-[9px] uppercase font-black tracking-[0.4em]">
                                        {content.dialogSubtitle}
                                    </DialogDescription>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all z-20 group border-white/10"
                                >
                                    <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            {/* Scrollable form body */}
                            <div className="overflow-y-auto flex-1">
                                <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-7">
                                    <div className="hidden">
                                        <Input {...register('hp')} type="text" tabIndex={-1} autoComplete="off" />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.name}</Label>
                                            <Input
                                                {...register('name')}
                                                className={`bg-white/[0.04] border-white/5 h-12 sm:h-14 rounded-xl focus:border-primary/50 text-white placeholder:text-white/10 text-sm sm:text-base px-4 sm:px-6 transition-all ${errors.name ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                                                placeholder={content.placeholders.name}
                                            />
                                            {errors.name && <p className="text-[9px] text-destructive font-black uppercase tracking-widest ml-2">{errors.name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.email}</Label>
                                            <Input
                                                {...register('email')}
                                                type="email"
                                                className={`bg-white/[0.04] border-white/5 h-12 sm:h-14 rounded-xl focus:border-primary/50 text-white placeholder:text-white/10 text-sm sm:text-base px-4 sm:px-6 transition-all ${errors.email ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                                                placeholder={content.placeholders.email}
                                            />
                                            {errors.email && <p className="text-[9px] text-destructive font-black uppercase tracking-widest ml-2">{errors.email.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.subject}</Label>
                                        <Input
                                            {...register('subject')}
                                            className={`bg-white/[0.04] border-white/5 h-12 sm:h-14 rounded-xl focus:border-primary/50 text-white placeholder:text-white/10 text-sm sm:text-base px-4 sm:px-6 transition-all ${errors.subject ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                                            placeholder={content.placeholders.subject}
                                        />
                                        {errors.subject && <p className="text-[9px] text-destructive font-black uppercase tracking-widest ml-2">{errors.subject.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">{content.labels.message}</Label>
                                        <Textarea
                                            {...register('message')}
                                            className={`bg-white/[0.04] border-white/5 min-h-[120px] sm:min-h-[160px] rounded-2xl focus:border-primary/50 text-white placeholder:text-white/10 p-4 sm:p-6 resize-none text-sm sm:text-base leading-relaxed transition-all ${errors.message ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                                            placeholder={content.placeholders.message}
                                        />
                                        {errors.message && <p className="text-[9px] text-destructive font-black uppercase tracking-widest ml-2">{errors.message.message}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 sm:h-16 md:h-20 rounded-full bg-primary text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-accent transition-all duration-500 group relative overflow-hidden shadow-2xl"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {loading ? 'Transmitting...' : (
                                                <> Send Transmission <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                    </Button>

                                    <div className="flex items-center justify-center gap-6 sm:gap-8 pb-2 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};
