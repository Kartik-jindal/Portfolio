'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SeoHudProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export const SeoHud = ({ title = '', description = '', keywords = '', ogImage = '' }: SeoHudProps) => {
  const calculateScore = () => {
    let score = 0;
    
    const safeTitle = title || '';
    const safeDescription = description || '';
    const safeKeywords = keywords || '';
    const safeOgImage = ogImage || '';

    // Title Score (30pts)
    const titleLen = safeTitle.length;
    if (titleLen >= 50 && titleLen <= 60) score += 30;
    else if (titleLen >= 30 && titleLen <= 70) score += 15;

    // Description Score (30pts)
    const descLen = safeDescription.length;
    if (descLen >= 120 && descLen <= 160) score += 30;
    else if (descLen >= 70 && descLen <= 180) score += 15;

    // Keywords Score (20pts)
    const kwCount = safeKeywords.split(',').filter(k => k.trim().length > 0).length;
    if (kwCount >= 3) score += 20;
    else if (kwCount >= 1) score += 10;

    // OG Image Score (20pts)
    if (safeOgImage && safeOgImage.startsWith('http')) score += 20;

    return score;
  };

  const score = calculateScore();

  const getTitleStatus = () => {
    const len = (title || '').length;
    if (len === 0) return { label: 'MISSING', color: 'text-white/20' };
    if (len >= 50 && len <= 60) return { label: 'OPTIMAL', color: 'text-green-500' };
    if (len >= 30 && len <= 70) return { label: 'ACCEPTABLE', color: 'text-yellow-500' };
    return { label: 'IMPROVE', color: 'text-red-500' };
  };

  const getDescStatus = () => {
    const len = (description || '').length;
    if (len === 0) return { label: 'MISSING', color: 'text-white/20' };
    if (len >= 120 && len <= 160) return { label: 'OPTIMAL', color: 'text-green-500' };
    if (len >= 70 && len <= 180) return { label: 'ACCEPTABLE', color: 'text-yellow-500' };
    return { label: 'IMPROVE', color: 'text-red-500' };
  };

  return (
    <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5">
        <ShieldCheck className="w-28 h-28 text-primary" />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-white/40">SEO Health Index</h3>
          <span className={`text-3xl font-headline font-black italic ${score > 70 ? 'text-primary' : 'text-yellow-500'}`}>{score}<span className="text-white/20 text-sm not-italic font-sans">/100</span></span>
        </div>
        <Progress value={score} className="h-1.5 bg-white/5" />
      </div>

      <div className="grid gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
            <span className="text-white/40">Title Tags</span>
            <span className={getTitleStatus().color}>{getTitleStatus().label}</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${getTitleStatus().color.replace('text', 'bg')}`}
              style={{ width: `${Math.min(100, ((title || '').length / 70) * 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
            <span className="text-white/40">Meta Description</span>
            <span className={getDescStatus().color}>{getDescStatus().label}</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${getDescStatus().color.replace('text', 'bg')}`}
              style={{ width: `${Math.min(100, ((description || '').length / 180) * 100)}%` }}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-5">
          <div className="flex items-center gap-4">
             {(keywords || '').split(',').filter(k => k.trim()).length >= 3 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
             <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Keyword Density</span>
          </div>
          <div className="flex items-center gap-4">
             {ogImage ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Info className="w-4 h-4 text-white/20" />}
             <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Social Graph Image</span>
          </div>
        </div>
      </div>
    </div>
  );
};
