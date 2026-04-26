
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Layers, List, AlignLeft, Plus, Trash2, Globe, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion, Reorder } from 'framer-motion';

export default function InterfaceAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [navItems, setNavItems] = useState<any[]>([]);
  const [footerLinks, setFooterLinks] = useState<any[]>([]);
  const [footerBio, setFooterBio] = useState('');
  const [footerEst, setFooterEst] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const navSnap = await getDoc(doc(db, 'site_config', 'navbar'));
        if (navSnap.exists()) {
          setNavItems(navSnap.data().navItems || []);
        } else {
          setNavItems([
            { id: '1', label: 'Works', href: '/work' },
            { id: '2', label: 'Vision', href: '/#about' },
            { id: '3', label: 'Timeline', href: '/#experience' },
            { id: '4', label: 'Journal', href: '/blog' },
            { id: '5', label: 'Connect', href: '/#contact' }
          ]);
        }

        const footerSnap = await getDoc(doc(db, 'site_config', 'footer'));
        if (footerSnap.exists()) {
          const data = footerSnap.data();
          setFooterBio(data.bio || '');
          setFooterEst(data.est || '');
          setFooterLinks(data.footerLinks || []);
        } else {
          setFooterLinks([
            { id: 'f1', label: 'Home', href: '/' },
            { id: 'f2', label: 'Selected Work', href: '/work' },
            { id: 'f3', label: 'About Story', href: '/#about' },
            { id: 'f4', label: 'Journal', href: '/blog' }
          ]);
        }
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
      await setDoc(doc(db, 'site_config', 'navbar'), { navItems });
      await setDoc(doc(db, 'site_config', 'footer'), { 
        bio: footerBio, 
        est: footerEst,
        footerLinks 
      });
      toast({ title: 'Interface Sync', description: 'Global layout parameters committed.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sync Failed', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    const id = Math.random().toString(36).substring(7);
    setNavItems([...navItems, { id, label: 'New Link', href: '#' }]);
  };

  const removeNavItem = (id: string) => {
    setNavItems(navItems.filter(item => item.id !== id));
  };

  const updateNavItem = (id: string, field: string, val: string) => {
    setNavItems(navItems.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const addFooterLink = () => {
    const id = Math.random().toString(36).substring(7);
    setFooterLinks([...footerLinks, { id, label: 'New Link', href: '#' }]);
  };

  const removeFooterLink = (id: string) => {
    setFooterLinks(footerLinks.filter(item => item.id !== id));
  };

  const updateFooterLink = (id: string, field: string, val: string) => {
    setFooterLinks(footerLinks.map(item => item.id === id ? { ...item, [field]: val } : item));
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
            
            <Reorder.Group axis="y" values={navItems} onReorder={setNavItems} className="space-y-4">
              {navItems.map((item) => (
                <Reorder.Item 
                  key={item.id} 
                  value={item}
                  className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing"
                >
                  <div className="col-span-1 flex items-center justify-center text-white/20">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="col-span-5 space-y-1">
                    <Label className="text-[8px] uppercase font-black text-white/30 ml-2">Label</Label>
                    <Input value={item.label} onChange={e => updateNavItem(item.id, 'label', e.target.value)} className="bg-transparent border-white/5 h-10 text-xs font-bold" />
                  </div>
                  <div className="col-span-4 space-y-1">
                    <Label className="text-[8px] uppercase font-black text-white/30 ml-2">Path / URL</Label>
                    <Input value={item.href} onChange={e => updateNavItem(item.id, 'href', e.target.value)} className="bg-transparent border-white/5 h-10 text-xs font-mono" />
                  </div>
                  <div className="col-span-2 flex justify-end pt-4">
                    <Button onClick={() => removeNavItem(item.id)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-destructive/10 text-white/20 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {/* Footer Editor */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10">
            <div className="flex items-center gap-4 text-primary">
              <AlignLeft className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Footer Identity</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Brand Bio</Label>
                <Textarea value={footerBio} onChange={e => setFooterBio(e.target.value)} className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Establishment Mark</Label>
                <Input value={footerEst} onChange={e => setFooterEst(e.target.value)} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-white/40">Footer Links</h4>
                <Button onClick={addFooterLink} variant="outline" size="sm" className="h-8 rounded-lg border-white/10 text-[9px] uppercase font-black tracking-widest">
                  <Plus className="w-3 h-3 mr-1" /> Add Link
                </Button>
              </div>

              <Reorder.Group axis="y" values={footerLinks} onReorder={setFooterLinks} className="space-y-3">
                {footerLinks.map((link) => (
                  <Reorder.Item 
                    key={link.id} 
                    value={link}
                    className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing"
                  >
                    <div className="col-span-1 flex items-center justify-center text-white/10">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="col-span-5">
                      <Input value={link.label} onChange={e => updateFooterLink(link.id, 'label', e.target.value)} className="bg-transparent border-none h-8 text-[10px] font-bold" placeholder="Label" />
                    </div>
                    <div className="col-span-4">
                      <Input value={link.href} onChange={e => updateFooterLink(link.id, 'href', e.target.value)} className="bg-transparent border-none h-8 text-[10px] font-mono" placeholder="URL" />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button onClick={() => removeFooterLink(link.id)} variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-destructive/10 text-white/20 hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
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
              Drag the grip handles to adjust positioning. Changes update the structural navigation of the entire application immediately upon sync.
            </p>
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-black uppercase text-white/20 tracking-widest block mb-4">Nav Preview</span>
                  <div className="flex flex-wrap gap-2">
                    {navItems?.map((item: any) => (
                      <span key={item.id} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
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
               The Navbar automatically handles scroll-detection. Footer social links are managed separately via the <Link href="/admin/settings" className="text-primary hover:underline">Global Settings</Link> portal.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
