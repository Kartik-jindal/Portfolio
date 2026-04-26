
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Zap, Sparkles, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function HeroAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    badge: 'Full Stack Architect',
    titleMain: 'KARTIK',
    titleHighlight: 'JINDAL',
    description: 'Engineering high-fidelity digital landscapes where architectural precision meets artistic motion.',
    ctaPrimary: 'Explore Work',
    ctaSecondary: 'The Vision'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const docRef = doc(db, 'site_config', 'hero');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'hero'), formData);
      toast({ title: 'Hero Sync', description: 'Landing page parameters updated.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sync Failed', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-2 h-2 bg-primary animate-ping rounded-full" /></div>;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Brand Entrance</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Hero Commander.</h1>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={saving}
          className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group"
        >
          {saving ? 'Syncing...' : 'Sync Hero'} <Save className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Main Copy */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Type className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Core Copy</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Badge Label</Label>
                <Input value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" placeholder="Full Stack Architect" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Title Main (Solid)</Label>
                  <Input value={formData.titleMain} onChange={e => setFormData({ ...formData, titleMain: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Title Highlight (Outline)</Label>
                  <Input value={formData.titleHighlight} onChange={e => setFormData({ ...formData, titleHighlight: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Narrative Subheadline</Label>
                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Zap className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Call to Action</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Primary Button</Label>
                <Input value={formData.ctaPrimary} onChange={e => setFormData({ ...formData, ctaPrimary: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Secondary Button</Label>
                <Input value={formData.ctaSecondary} onChange={e => setFormData({ ...formData, ctaSecondary: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Live Preview Notes</h3>
            </div>
            <p className="text-xs text-white/40 leading-relaxed font-bold italic">
              Changes to the Hero section will affect the initial impact of your portfolio. Ensure the "Main Title" and "Highlight Title" create a balanced visual hierarchy.
            </p>
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <span className="text-[8px] font-black uppercase text-primary tracking-widest block mb-2">Primary CTA</span>
                  <div className="h-10 rounded-lg bg-primary flex items-center justify-center text-black text-[10px] font-black uppercase">{formData.ctaPrimary}</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-widest block mb-2">Secondary CTA</span>
                  <div className="h-10 rounded-lg border border-white/20 flex items-center justify-center text-white text-[10px] font-black uppercase">{formData.ctaSecondary}</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
