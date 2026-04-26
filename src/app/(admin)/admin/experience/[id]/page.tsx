
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function EditExperiencePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'experience', id as string));
        if (docSnap.exists()) {
          setFormData({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push('/admin/experience');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id: _, ...updateData } = formData;
      await updateDoc(doc(db, 'experience', id as string), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      toast({ title: 'Evolution Sync', description: 'Milestone updated successfully.' });
      router.push('/admin/experience');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) return <div className="h-96 flex items-center justify-center"><div className="w-2 h-2 bg-primary animate-ping rounded-full" /></div>;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/admin/experience" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Evolution
          </Link>
          <div className="space-y-2">
            <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Career Evolution</span>
            <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Modify Milestone.</h1>
          </div>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={saving}
          className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group"
        >
          {saving ? 'Syncing...' : 'Sync Changes'} <Save className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <div className="max-w-4xl">
        <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
          <div className="flex items-center gap-4 text-primary">
            <Briefcase className="w-6 h-6" />
            <h3 className="text-lg font-headline font-black italic tracking-tight">Milestone Identity</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Company Name</Label>
              <Input 
                value={formData.company} 
                onChange={e => setFormData({ ...formData, company: e.target.value })} 
                className="bg-white/5 border-white/5 rounded-xl h-14" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Professional Role</Label>
              <Input 
                value={formData.role} 
                onChange={e => setFormData({ ...formData, role: e.target.value })} 
                className="bg-white/5 border-white/5 rounded-xl h-14" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Period of Impact</Label>
              <Input 
                value={formData.period} 
                onChange={e => setFormData({ ...formData, period: e.target.value })} 
                className="bg-white/5 border-white/5 rounded-xl h-14" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Chronological Order</Label>
              <Input 
                type="number"
                value={formData.order} 
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} 
                className="bg-white/5 border-white/5 rounded-xl h-14" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Evolution Narrative</Label>
            <Textarea 
              value={formData.desc} 
              onChange={e => setFormData({ ...formData, desc: e.target.value })} 
              className="bg-white/5 border-white/5 rounded-xl min-h-[200px]" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
