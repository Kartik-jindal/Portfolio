'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, User, Sparkles, BookOpen, Layers, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AboutAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    philosophy: 'The Philosophy',
    headlineMain: 'Fusing',
    headlineOutline: 'Logic',
    headlinePrimary: 'Artistry.',
    narrative1: '',
    narrative2: '',
    pillars: [
      { icon: 'Code2', title: 'Engineering', desc: '' },
      { icon: 'Zap', title: 'Performance', desc: '' },
      { icon: 'Globe', title: 'Strategy', desc: '' }
    ],
    skills: [],
    stat1Value: '',
    stat1Label: '',
    stat2Value: '',
    stat2Label: '',
    quote: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docRef = doc(db, 'site_config', 'about');
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
    fetchAbout();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'about'), formData);
      toast({ title: 'Brand Sync', description: 'About section updated successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sync Failed', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill('');
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-2 h-2 bg-primary animate-ping rounded-full" /></div>;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[12px]">Personal Brand</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">About Story.</h1>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={saving}
          className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group text-sm"
        >
          {saving ? 'Syncing...' : 'Sync About'} <Save className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Headline & Philosophy */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <User className="w-7 h-7" />
              <h3 className="text-xl font-headline font-black italic tracking-tight">Identity & Vision</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Philosophy Label</Label>
                <Input value={formData.philosophy} onChange={e => setFormData({ ...formData, philosophy: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14 text-base" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Headline Main</Label>
                <Input value={formData.headlineMain} onChange={e => setFormData({ ...formData, headlineMain: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14 text-base" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Headline Highlight (Outline)</Label>
                <Input value={formData.headlineOutline} onChange={e => setFormData({ ...formData, headlineOutline: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14 text-base" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Headline Primary (Green)</Label>
                <Input value={formData.headlinePrimary} onChange={e => setFormData({ ...formData, headlinePrimary: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14 text-base" />
              </div>
            </div>
          </div>

          {/* Narrative Paragraphs */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <BookOpen className="w-7 h-7" />
              <h3 className="text-xl font-headline font-black italic tracking-tight">Narrative</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Primary Statement (Large Text)</Label>
                <Textarea value={formData.narrative1} onChange={e => setFormData({ ...formData, narrative1: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[120px] text-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Supporting Context (Small Text)</Label>
                <Textarea value={formData.narrative2} onChange={e => setFormData({ ...formData, narrative2: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[150px] text-base" />
              </div>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Layers className="w-7 h-7" />
              <h3 className="text-xl font-headline font-black italic tracking-tight">Core Pillars</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {formData.pillars?.map((pillar: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <Select value={pillar.icon} onValueChange={v => {
                    const newPillars = [...formData.pillars];
                    newPillars[i].icon = v;
                    setFormData({ ...formData, pillars: newPillars });
                  }}>
                    <SelectTrigger className="bg-white/10 border-white/10 h-10 rounded-xl text-[12px] font-black uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Code2">Engineering</SelectItem>
                      <SelectItem value="Zap">Performance</SelectItem>
                      <SelectItem value="Globe">Strategy</SelectItem>
                      <SelectItem value="Cpu">Systems</SelectItem>
                      <SelectItem value="Sparkles">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    value={pillar.title} 
                    onChange={e => {
                      const newPillars = [...formData.pillars];
                      newPillars[i].title = e.target.value;
                      setFormData({ ...formData, pillars: newPillars });
                    }}
                    className="bg-transparent border-white/5 h-10 text-sm font-bold"
                    placeholder="Title"
                  />
                  <Textarea 
                    value={pillar.desc} 
                    onChange={e => {
                      const newPillars = [...formData.pillars];
                      newPillars[i].desc = e.target.value;
                      setFormData({ ...formData, pillars: newPillars });
                    }}
                    className="bg-transparent border-white/5 text-[12px] min-h-[100px]"
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          {/* Skills Arsenal */}
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-8">
            <h3 className="text-[12px] uppercase font-black tracking-widest text-white/40">Core Arsenal</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="bg-white/5 border-white/5 rounded-xl h-12 flex-1 text-sm" placeholder="Add Tool..." />
                <Button onClick={addSkill} variant="outline" className="h-12 w-12 rounded-xl border-white/10">+</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((s: string) => (
                  <span key={s} className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary flex items-center gap-2">
                    {s} <button onClick={() => setFormData({ ...formData, skills: formData.skills.filter((x: string) => x !== s) })}><Plus className="w-3.5 h-3.5 rotate-45" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-8">
            <h3 className="text-[12px] uppercase font-black tracking-widest text-white/40">Milestone Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-black text-white/20">Metric 1 Val</Label>
                <Input value={formData.stat1Value} onChange={e => setFormData({ ...formData, stat1Value: e.target.value })} className="bg-white/5 border-white/5 h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-black text-white/20">Metric 1 Lbl</Label>
                <Input value={formData.stat1Label} onChange={e => setFormData({ ...formData, stat1Label: e.target.value })} className="bg-white/5 border-white/5 h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-black text-white/20">Metric 2 Val</Label>
                <Input value={formData.stat2Value} onChange={e => setFormData({ ...formData, stat2Value: e.target.value })} className="bg-white/5 border-white/5 h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-black text-white/20">Metric 2 Lbl</Label>
                <Input value={formData.stat2Label} onChange={e => setFormData({ ...formData, stat2Label: e.target.value })} className="bg-white/5 border-white/5 h-12 text-sm" />
              </div>
            </div>
          </div>

          {/* Vision Quote */}
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-[12px] font-black uppercase tracking-widest">Vision Quote</h3>
            </div>
            <Textarea value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-32 italic text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}