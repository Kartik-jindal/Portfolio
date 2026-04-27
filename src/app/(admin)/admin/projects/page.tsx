'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, deleteDoc, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, ExternalLink, Box, Copy, CheckSquare, Square, X, Filter, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await updateDoc(doc(db, 'projects', id), { status: newStatus });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      toast({ title: 'Status Toggled', description: `Build moved to ${newStatus}` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Action Failed', description: error.message });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkStatus = async (status: string) => {
    const batch = writeBatch(db);
    selectedIds.forEach(id => {
      batch.update(doc(db, 'projects', id), { status });
    });
    await batch.commit();
    setProjects(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status } : p));
    setSelectedIds([]);
    toast({ title: 'Bulk Update', description: `Items marked as ${status}` });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} projects permanently?`)) return;
    const batch = writeBatch(db);
    selectedIds.forEach(id => {
      batch.delete(doc(db, 'projects', id));
    });
    await batch.commit();
    setProjects(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    toast({ title: 'Bulk Purge', description: 'Selected items removed' });
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-10 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[12px]">Portfolio Management</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Project Archive.</h1>
        </div>
        <Link href="/admin/projects/new">
          <Button className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group text-sm">
            Add New Build <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
          </Button>
        </Link>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20" />
          <Input 
            placeholder="Filter by title..." 
            className="bg-white/5 border-white/5 h-16 pl-16 rounded-2xl text-white text-xl font-light focus:border-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/5 border-white/5 h-16 w-40 rounded-2xl text-white/60 font-black uppercase tracking-widest text-[10px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
           </Select>
           <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white/5 border-white/5 h-16 w-48 rounded-2xl text-white/60 font-black uppercase tracking-widest text-[10px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FLAGSHIP">Flagship</SelectItem>
                <SelectItem value="EXPERIMENT">Experiment</SelectItem>
              </SelectContent>
           </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass p-20 rounded-[2.5rem] border-white/5 text-center space-y-4">
            <Box className="w-16 h-16 text-white/10 mx-auto" />
            <p className="text-white/40 uppercase font-black tracking-widest text-sm">No projects found</p>
          </div>
        ) : (
          filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass p-6 rounded-3xl border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all ${selectedIds.includes(project.id) ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <div className="flex items-center gap-6 flex-1">
                <button 
                  onClick={() => toggleSelect(project.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-primary transition-colors"
                >
                  {selectedIds.includes(project.id) ? <CheckSquare className="w-6 h-6 text-primary" /> : <Square className="w-6 h-6" />}
                </button>
                <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0">
                  {project.image && <Image src={project.image} alt="" fill className="object-cover" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{project.type}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <button 
                      onClick={() => toggleStatus(project.id, project.status)}
                      className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-100 transition-opacity ${project.status === 'published' ? 'text-green-500/60' : 'text-yellow-500/60'}`}
                    >
                      {project.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {project.status}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/projects/new?clone=${project.id}`}>
                  <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/5 text-white/40 hover:text-primary" title="Clone Project">
                    <Copy className="w-5 h-5" />
                  </Button>
                </Link>
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
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6"
          >
            <div className="bg-black/90 backdrop-blur-3xl border border-primary/30 rounded-full h-20 flex items-center justify-between px-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
               <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-black text-xs">{selectedIds.length}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Units Selected</span>
                  <button onClick={() => setSelectedIds([])} className="ml-4 hover:text-primary transition-colors"><X className="w-4 h-4" /></button>
               </div>
               <div className="flex items-center gap-4">
                  <Button onClick={() => handleBulkStatus('published')} variant="outline" className="h-10 rounded-xl border-white/10 text-[10px] uppercase font-black tracking-widest">Publish All</Button>
                  <Button onClick={() => handleBulkStatus('draft')} variant="outline" className="h-10 rounded-xl border-white/10 text-[10px] uppercase font-black tracking-widest">Draft All</Button>
                  <Button onClick={handleBulkDelete} variant="ghost" className="h-10 rounded-xl text-destructive hover:bg-destructive/10 text-[10px] uppercase font-black tracking-widest">Purge</Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
