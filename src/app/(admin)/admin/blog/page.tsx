'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, deleteDoc, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, FileText, Calendar, Copy, CheckSquare, Square, X, Filter, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await updateDoc(doc(db, 'blog', id), { status: newStatus });
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      toast({ title: 'Editorial Sync', description: `Entry visibility marked as ${newStatus}` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sync Failed', description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this journal entry?')) return;
    try {
      await deleteDoc(doc(db, 'blog', id));
      setPosts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Post deleted' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkStatus = async (status: string) => {
    const batch = writeBatch(db);
    selectedIds.forEach(id => {
      batch.update(doc(db, 'blog', id), { status });
    });
    await batch.commit();
    setPosts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status } : p));
    setSelectedIds([]);
    toast({ title: 'Bulk Update', description: `Items marked as ${status}` });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} entries permanently?`)) return;
    const batch = writeBatch(db);
    selectedIds.forEach(id => {
      batch.delete(doc(db, 'blog', id));
    });
    await batch.commit();
    setPosts(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    toast({ title: 'Bulk Purge', description: 'Selected items removed' });
  };

  const filteredPosts = posts.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = p.title?.toLowerCase().includes(searchLower);
    const categoryMatch = p.categories?.some((cat: string) => cat.toLowerCase().includes(searchLower)) || p.category?.toLowerCase().includes(searchLower);
    const matchesSearch = titleMatch || categoryMatch;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Journal CMS</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Editorial Archive.</h1>
        </div>
        <Link href="/admin/blog/new">
          <Button className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group">
            Draft New Entry <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
          </Button>
        </Link>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
          <Input 
            placeholder="Search journal entries..." 
            className="bg-white/5 border-white/5 h-16 pl-16 rounded-2xl text-white text-lg font-light focus:border-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/5 border-white/5 h-16 w-48 rounded-2xl text-white/60 font-black uppercase tracking-widest text-[10px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="glass p-20 rounded-[2.5rem] border-white/5 text-center space-y-4">
            <FileText className="w-12 h-12 text-white/10 mx-auto" />
            <p className="text-white/40 uppercase font-black tracking-widest">No entries found</p>
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass p-8 rounded-3xl border-white/5 group hover:border-primary/30 transition-all relative overflow-hidden ${selectedIds.includes(post.id) ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6 flex-1">
                  <button 
                    onClick={() => toggleSelect(post.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-primary transition-colors"
                  >
                    {selectedIds.includes(post.id) ? <CheckSquare className="w-6 h-6 text-primary" /> : <Square className="w-6 h-6" />}
                  </button>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      {(post.categories || (post.category ? [post.category] : ['General'])).map((cat: string) => (
                        <span key={cat} className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                          {cat}
                        </span>
                      ))}
                      <button 
                        onClick={() => toggleStatus(post.id, post.status)}
                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-100 transition-opacity ${post.status === 'published' ? 'text-green-500/60' : 'text-yellow-500/60'}`}
                      >
                        {post.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.status}
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-6 text-white/30">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{post.date}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{post.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/blog/new?clone=${post.id}`}>
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/5 text-white/40 hover:text-primary" title="Clone Entry">
                      <Copy className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href={`/admin/blog/${post.id}`}>
                    <Button variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5 text-white/60 hover:text-white px-6 font-black uppercase tracking-widest text-[10px]">
                      Edit Entry
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-12 h-12 rounded-xl hover:bg-destructive/10 text-white/40 hover:text-destructive"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Selected</span>
                  <button onClick={() => setSelectedIds([])} className="ml-4 hover:text-primary transition-colors"><X className="w-4 h-4" /></button>
               </div>
               <div className="flex items-center gap-4">
                  <Button onClick={() => handleBulkStatus('published')} variant="outline" className="h-10 rounded-xl border-white/10 text-[10px] uppercase font-black tracking-widest">Publish</Button>
                  <Button onClick={() => handleBulkStatus('draft')} variant="outline" className="h-10 rounded-xl border-white/10 text-[10px] uppercase font-black tracking-widest">Draft</Button>
                  <Button onClick={handleBulkDelete} variant="ghost" className="h-10 rounded-xl text-destructive hover:bg-destructive/10 text-[10px] uppercase font-black tracking-widest">Delete</Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
