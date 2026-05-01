'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Calendar, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/portfolio/breadcrumbs';

interface LegalPageClientProps {
    type: 'privacy' | 'terms';
    title: string;
    subtitle: string;
    content: string;
    lastUpdated: string;
    authorName: string;
    email: string;
}

// Minimal markdown-to-JSX renderer — handles ## headings, **bold**, and paragraphs
function renderContent(raw: string) {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;

    const renderInline = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();

        if (line.startsWith('## ')) {
            elements.push(
                <h2
                    key={key++}
                    className="text-2xl md:text-3xl font-headline font-bold text-white tracking-tight mt-12 mb-6 first:mt-0"
                >
                    {line.slice(3)}
                </h2>
            );
        } else if (line.startsWith('- ')) {
            // Collect consecutive list items
            const items: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('- ')) {
                items.push(lines[i].trim().slice(2));
                i++;
            }
            elements.push(
                <ul key={key++} className="space-y-3 my-6 pl-0">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-white/60 font-body font-light leading-relaxed text-base md:text-lg">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span>{renderInline(item)}</span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        } else if (line !== '') {
            elements.push(
                <p key={key++} className="text-white/60 font-body font-light leading-relaxed text-base md:text-lg mb-6">
                    {renderInline(line)}
                </p>
            );
        }
        i++;
    }

    return elements;
}

export default function LegalPageClient({
    type,
    title,
    subtitle,
    content,
    lastUpdated,
    authorName,
    email,
}: LegalPageClientProps) {
    const Icon = type === 'privacy' ? Shield : FileText;

    return (
        <article className="pt-28 sm:pt-36 md:pt-48 pb-24 relative overflow-hidden">
            {/* Atmospheric glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">

                {/* Breadcrumbs */}
                <Breadcrumbs items={[{ label: title }]} />

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 space-y-8"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                        <Icon className="w-3.5 h-3.5" />
                        Legal Document
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-headline font-black italic tracking-tighter text-white leading-none">
                            {title}<span className="text-primary">.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/40 font-body font-light">{subtitle}</p>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                            <Calendar className="w-3.5 h-3.5 text-primary/50" />
                            Last updated: {lastUpdated}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                            <Mail className="w-3.5 h-3.5 text-primary/50" />
                            {email}
                        </div>
                    </div>
                </motion.header>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: 'circOut' }}
                    className="h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent mb-16 origin-left"
                />

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="glass p-8 sm:p-10 md:p-14 rounded-[2.5rem] border-white/5 space-y-2"
                >
                    {renderContent(content)}
                </motion.div>

                {/* Footer nav */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-16 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">
                        {type === 'privacy' ? (
                            <Link href="/terms" className="hover:text-primary transition-colors">
                                Terms &amp; Conditions
                            </Link>
                        ) : (
                            <Link href="/privacy" className="hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>
                        )}
                    </div>
                </motion.div>

            </div>
        </article>
    );
}
