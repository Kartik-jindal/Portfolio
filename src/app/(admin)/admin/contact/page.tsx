'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Mail, MessageSquare, Terminal, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ContactAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
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
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const docRef = doc(db, 'site_config', 'contact');
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
    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'contact'), formData);
      toast({ title: 'Communication Sync', description: 'Inquiry parameters updated successfully.' });
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
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Inquiry Module</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Contact Terminal.</h1>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={saving}
          className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group"
        >
          {saving ? 'Syncing...' : 'Sync Terminal'} <Save className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Main Section Copy */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <MessageSquare className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Public Presence</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Status Badge</Label>
                <Input value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Trigger Button Text</Label>
                <Input value={formData.triggerButtonText} onChange={e => setFormData({ ...formData, triggerButtonText: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Headline Main</Label>
                <Input value={formData.headlineMain} onChange={e => setFormData({ ...formData, headlineMain: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Headline Highlight (Outline)</Label>
                <Input value={formData.headlineHighlight} onChange={e => setFormData({ ...formData, headlineHighlight: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
            </div>
          </div>

          {/* Dialog HUD Copy */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Terminal className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Dialog Interface</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Dialog Title</Label>
                <Input value={formData.dialogTitle} onChange={e => setFormData({ ...formData, dialogTitle: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Dialog Subtitle</Label>
                <Input value={formData.dialogSubtitle} onChange={e => setFormData({ ...formData, dialogSubtitle: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
            </div>
          </div>

          {/* Form Labels & Placeholders */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10">
            <div className="flex items-center gap-4 text-primary">
              <Eye className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Input Fields</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {['name', 'email', 'subject', 'message'].map((field) => (
                <div key={field} className="space-y-6">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest block border-b border-primary/20 pb-2">{field} Command</span>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[8px] uppercase font-black tracking-widest text-white/40">Label</Label>
                      <Input 
                        value={formData.labels[field]} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          labels: { ...formData.labels, [field]: e.target.value } 
                        })} 
                        className="bg-white/5 border-white/5 rounded-xl h-12" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[8px] uppercase font-black tracking-widest text-white/40">Placeholder</Label>
                      <Input 
                        value={formData.placeholders[field]} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          placeholders: { ...formData.placeholders, [field]: e.target.value } 
                        })} 
                        className="bg-white/5 border-white/5 rounded-xl h-12" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-white/40">Architectural Note</h3>
            <p className="text-xs text-white/40 leading-relaxed font-bold italic">
              The Contact section is the final step in the user journey. Use authoritative, precise language that reflects your architectural philosophy.
            </p>
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <span className="text-[8px] font-black uppercase text-primary tracking-widest block mb-4">Transmission Pulse</span>
                  <div className="flex h-2 w-2 relative mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </div>
                  <span className="text-[9px] font-black text-white/60 mt-3 block">{formData.badge}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
