'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, ExternalLink, Box } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Project deleted successfully' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Portfolio Management</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Project Archive.</h1>
        </div>
        <Link href="/admin/projects/new">
          <Button className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group">
            Add New Build <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
          </Button>
        </Link>
      </header>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <Input 
          placeholder="Filter by title or type..." 
          className="bg-white/5 border-white/5 h-16 pl-16 rounded-2xl text-white text-lg font-light focus:border-primary/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass p-20 rounded-[2.5rem] border-white/5 text-center space-y-4">
            <Box className="w-12 h-12 text-white/10 mx-auto" />
            <p className="text-white/40 uppercase font-black tracking-widest">No projects found</p>
          </div>
        ) : (
          filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-white/5">
                  {project.image && <Image src={project.image} alt="" fill className="object-cover" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{project.type}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{project.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/projects/${project.id}`}>
                  <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/5 text-white/40 hover:text-white">
                    <Edit2 className="w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-12 h-12 rounded-xl hover:bg-destructive/10 text-white/40 hover:text-destructive"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
                <a href={project.liveUrl} target="_blank" rel="noopener">
                  <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/5 text-white/40 hover:text-primary">
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}