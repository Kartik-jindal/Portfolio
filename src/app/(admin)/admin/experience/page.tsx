
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExperiences(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this career milestone?')) return;
    try {
      await deleteDoc(doc(db, 'experience', id));
      setExperiences(prev => prev.filter(e => e.id !== id));
      toast({ title: 'System Purge', description: 'Experience entry deleted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Career Evolution</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Experience Timeline.</h1>
        </div>
        <Link href="/admin/experience/new">
          <Button className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group">
            Record Milestone <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="glass p-20 rounded-[2.5rem] border-white/5 text-center space-y-4">
            <Briefcase className="w-12 h-12 text-white/10 mx-auto" />
            <p className="text-white/40 uppercase font-black tracking-widest">No milestones recorded.</p>
          </div>
        ) : (
          experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-8 rounded-3xl border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-8">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/5">
                  <span className="font-headline font-black italic">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{exp.company}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{exp.role}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{exp.period}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/experience/${exp.id}`}>
                  <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/5 text-white/40 hover:text-white">
                    <Edit2 className="w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-12 h-12 rounded-xl hover:bg-destructive/10 text-white/40 hover:text-destructive"
                  onClick={() => handleDelete(exp.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
