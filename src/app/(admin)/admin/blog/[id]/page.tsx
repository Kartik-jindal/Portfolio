
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { uploadToS3 } from '@/lib/aws/s3-actions';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function EditBlogPostPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'blog', id as string));
        if (docSnap.exists()) {
          setFormData({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push('/admin/blog');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      title: val,
      slug: isSlugManual ? prev.slug : slugify(val)
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('path', 'blog');
      
      const result = await uploadToS3(uploadFormData);
      
      if (result.success && result.url) {
        setFormData({ ...formData, image: result.url });
        toast({ title: 'Success', description: 'Asset synced to S3' });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id: _, ...updateData } = formData;
      await updateDoc(doc(db, 'blog', id as string), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      toast({ title: 'Editorial Sync', description: 'Changes committed to database' });
      router.push('/admin/blog');
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
          <Link href="/admin/blog" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Archive
          </Link>
          <div className="space-y-2">
            <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Journal CMS</span>
            <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Modify Entry.</h1>
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

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <FileText className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Editorial Identity</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Post Title</Label>
                <Input value={formData.title} onChange={handleTitleChange} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Slug</Label>
                <Input 
                  value={formData.slug} 
                  onChange={e => {
                    setIsSlugManual(true);
                    setFormData({ ...formData, slug: e.target.value });
                  }} 
                  className="bg-white/5 border-white/5 rounded-xl h-14" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Category</Label>
                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Display Date</Label>
                <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Read Time</Label>
                <Input value={formData.readTime} onChange={e => setFormData({ ...formData, readTime: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <h3 className="text-lg font-headline font-black italic tracking-tight text-white/60">Editorial Content</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Abstract Summary</Label>
                <Textarea value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Article Body (HTML/Markdown)</Label>
                <Textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[500px] font-mono text-xs" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-8">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-white/40">Visual Context (S3)</h3>
            <div className="space-y-4">
               <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/5">
                 {formData.image ? (
                   <img src={formData.image} alt="" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-white/10">
                     <ImageIcon className="w-10 h-10" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{uploading ? 'Syncing...' : 'Update Cover (S3)'}</span>
                 </div>
               </div>
               <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-12 text-[10px]" />
               <Input value={formData.imageHint} onChange={e => setFormData({ ...formData, imageHint: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-12 text-[10px]" />
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Globe className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Metadata</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">SEO Title</Label>
                <Input value={formData.seo?.title} onChange={e => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })} className="bg-white/5 border-white/5 rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">SEO Description</Label>
                <Textarea value={formData.seo?.description} onChange={e => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })} className="bg-white/5 border-white/5 rounded-xl h-24" />
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Editorial Status</span>
              <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="w-32 bg-white/5 border-white/5 h-10 rounded-xl text-[10px] font-black uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
