
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Quote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, 'testimonials'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonials(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Discard this voice of social proof?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Voices Silenced', description: 'Testimonial removed from database.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Social Proof</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Voices of Impact.</h1>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group">
            Add New Voice <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
          </Button>
        </Link>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full h-64 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full glass p-20 rounded-[2.5rem] border-white/5 text-center space-y-4">
            <Quote className="w-12 h-12 text-white/10 mx-auto" />
            <p className="text-white/40 uppercase font-black tracking-widest">No feedback captured yet.</p>
          </div>
        ) : (
          testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-8 rounded-3xl border-white/5 flex flex-col justify-between group hover:border-primary/30 transition-all"
            >
              <div className="space-y-6">
                <Quote className="w-8 h-8 text-primary/20" />
                <p className="text-sm text-white/60 leading-relaxed font-light italic line-clamp-4">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary border border-primary/30">
                    {t.avatar || t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">{t.name}</h4>
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/30">{t.position}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link href={`/admin/testimonials/${t.id}`}>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white/5 text-white/40 hover:text-white">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-10 h-10 rounded-xl hover:bg-destructive/10 text-white/40 hover:text-destructive"
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
