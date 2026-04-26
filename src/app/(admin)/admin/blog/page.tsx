'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredPosts = posts.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = p.title?.toLowerCase().includes(searchLower);
    const categoryMatch = p.categories?.some((cat: string) => cat.toLowerCase().includes(searchLower)) || p.category?.toLowerCase().includes(searchLower);
    return titleMatch || categoryMatch;
  });

  return (
    <div className="space-y-10">
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

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <Input 
          placeholder="Search journal entries..." 
          className="bg-white/5 border-white/5 h-16 pl-16 rounded-2xl text-white text-lg font-light focus:border-primary/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              className="glass p-8 rounded-3xl border-white/5 group hover:border-primary/30 transition-all relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Render new multiple categories or legacy single category */}
                    {(post.categories || (post.category ? [post.category] : ['General'])).map((cat: string) => (
                      <span key={cat} className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                        {cat}
                      </span>
                    ))}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${post.status === 'published' ? 'text-green-500' : 'text-yellow-500'}`}>
                      • {post.status}
                    </span>
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

                <div className="flex items-center gap-3">
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
    </div>
  );
}
