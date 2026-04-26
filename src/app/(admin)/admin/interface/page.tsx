
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Layers, List, AlignLeft, Plus, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function InterfaceAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [navData, setNavData] = useState<any>({
    navItems: [
      { label: 'Works', href: '/work' },
      { label: 'Vision', href: '/#about' },
      { label: 'Timeline', href: '/#experience' },
      { label: 'Journal', href: '/blog' },
      { label: 'Connect', href: '/#contact' }
    ]
  });
  const [footerData, setFooterData] = useState<any>({
    bio: 'Fusing architectural precision with digital soul to build the next generation of web experiences.',
    est: 'EST. 2025'
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const navSnap = await getDoc(doc(db, 'site_config', 'navbar'));
        if (navSnap.exists()) setNavData(navSnap.data());

        const footerSnap = await getDoc(doc(db, 'site_config', 'footer'));
        if (footerSnap.exists()) setFooterData(footerSnap.data());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'navbar'), navData);
      await setDoc(doc(db, 'site_config', 'footer'), footerData);
      toast({ title: 'Interface Sync', description: 'Global layout parameters committed.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sync Failed', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    setNavData({ ...navData, navItems: [...navData.navItems, { label: 'New Link', href: '#' }] });
  };

  const removeNavItem = (idx: number) => {
    const items = [...navData.navItems];
    items.splice(idx, 1);
    setNavData({ ...navData, navItems: items });
  };

  const updateNavItem = (idx: number, field: string, val: string) => {
    const items = [...navData.navItems];
    items[idx][field] = val;
    setNavData({ ...navData, navItems: items });
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-2 h-2 bg-primary animate-ping rounded-full" /></div>;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Global Framework</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Layout Master.</h1>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group"
        >
          {saving ? 'Syncing...' : 'Sync Layout'} <Save className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-10">
          {/* Navbar Editor */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-primary">
                <List className="w-6 h-6" />
                <h3 className="text-lg font-headline font-black italic tracking-tight">Navigation Dock</h3>
              </div>
              <Button onClick={addNavItem} variant="outline" className="h-10 rounded-xl border-white/10 text-[10px] uppercase font-black tracking-widest">
                <Plus className="w-4 h-4 mr-2" /> Add Link
              </Button>
            </div>
            
            <div className="space-y-4">
              {navData.navItems?.map((item: any, i: number) => (
                <div key={i} className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
                  <div className="col-span-5 space-y-1">
                    <Label className="text-[8px] uppercase font-black text-white/30 ml-2">Label</Label>
                    <Input value={item.label} onChange={e => updateNavItem(i, 'label', e.target.value)} className="bg-transparent border-white/5 h-10 text-xs font-bold" />
                  </div>
                  <div className="col-span-5 space-y-1">
                    <Label className="text-[8px] uppercase font-black text-white/30 ml-2">Path / URL</Label>
                    <Input value={item.href} onChange={e => updateNavItem(i, 'href', e.target.value)} className="bg-transparent border-white/5 h-10 text-xs font-mono" />
                  </div>
                  <div className="col-span-2 flex justify-end pt-4">
                    <Button onClick={() => removeNavItem(i)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-destructive/10 text-white/20 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Editor */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <AlignLeft className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Footer Identity</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Brand Bio</Label>
                <Textarea value={footerData.bio} onChange={e => setFooterData({ ...footerData, bio: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Establishment Mark</Label>
                  <Input value={footerData.est} onChange={e => setFooterData({ ...footerData, est: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-10">
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Layers className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Interface Logic</h3>
            </div>
            <p className="text-xs text-white/40 leading-relaxed font-bold italic">
              Changes here update the structural navigation of the entire application. The Footer Brand Bio is optimized for a maximum of 150 characters to maintain grid stability.
            </p>
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-black uppercase text-white/20 tracking-widest block mb-4">Nav Preview</span>
                  <div className="flex flex-wrap gap-2">
                    {navData.navItems?.map((item: any, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
                        {item.label}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/5 to-transparent space-y-4">
             <div className="flex items-center gap-3 text-primary">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Resilience</span>
             </div>
             <p className="text-xs text-white/60 font-light leading-relaxed">
               The Navbar automatically handles scroll-detection and transparency. Footer social links are managed separately via the <Link href="/admin/settings" className="text-primary hover:underline">Global Settings</Link> portal.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
