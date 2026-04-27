'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { uploadToS3 } from '@/lib/aws/s3-actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2, Box, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { SeoHud } from '@/components/admin/seo-hud';

function ProjectFormContent() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'FLAGSHIP',
    role: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    desc: '',
    longDesc: '',
    methodology: '',
    impact: '',
    accentColor: '#10B981',
    liveUrl: '',
    githubUrl: '',
    image: '',
    imageHint: '',
    altText: '',
    tech: [] as string[],
    challenges: [] as string[],
    status: 'draft',
    order: 0,
    seo: { title: '', description: '', keywords: '', ogImage: '', indexable: true, canonicalUrl: '' }
  });

  const [newTech, setNewTech] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const cloneId = searchParams.get('clone');
    if (cloneId) {
      const fetchCloneSource = async () => {
        try {
          const sourceSnap = await getDoc(doc(db, 'projects', cloneId));
          if (sourceSnap.exists()) {
            const data = sourceSnap.data();
            setFormData(prev => ({
              ...prev,
              ...data,
              title: `${data.title} (Clone)`,
              slug: `${data.slug}-copy`,
              status: 'draft', // Force clones to draft
            }));
            setIsSlugManual(true);
            toast({ title: 'Clone Initialized', description: 'Data imported from source build.' });
          }
        } catch (e) {
          console.error("Clone Error:", e);
        }
      };
      fetchCloneSource();
    }
  }, [searchParams, toast]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({
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
      uploadFormData.append('path', 'projects');
      
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
    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Deployment Successful', description: 'Project added to archive' });
      router.push('/admin/projects');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const addTech = () => {
    if (newTech && !formData.tech.includes(newTech)) {
      setFormData({ ...formData, tech: [...formData.tech, newTech] });
      setNewTech('');
    }
  };

  const addChallenge = () => {
    if (newChallenge && !formData.challenges.includes(newChallenge)) {
      setFormData({ ...formData, challenges: [...formData.challenges, newChallenge] });
      setNewChallenge('');
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/admin/projects" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Archive
          </Link>
          <div className="space-y-2">
            <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Project Lab</span>
            <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Initialize Build.</h1>
          </div>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group"
        >
          {loading ? 'Initializing...' : 'Deploy to Archive'} <Save className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Box className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Core Identity</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Project Title</Label>
                <Input value={formData.title} onChange={handleTitleChange} className="bg-white/5 border-white/5 rounded-xl h-14" placeholder="e.g. Nova Orbital" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Slug (URL Path)</Label>
                <Input 
                  value={formData.slug} 
                  onChange={e => {
                    setIsSlugManual(true);
                    setFormData({ ...formData, slug: e.target.value });
                  }} 
                  className="bg-white/5 border-white/5 rounded-xl h-14" 
                  placeholder="nova-orbital" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Type</Label>
                <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLAGSHIP">Flagship Build</SelectItem>
                    <SelectItem value="EXPERIMENT">Technical Experiment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Role</Label>
                <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" placeholder="Lead Engineer" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Completion Date</Label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                   <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="bg-white/5 border-white/10 rounded-xl h-14 pl-12" placeholder="e.g. June 2024" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Order</Label>
                <Input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="bg-white/5 border-white/5 rounded-xl h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Live URL</Label>
                <Input value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">GitHub URL</Label>
                <Input value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14" placeholder="https://github.com/..." />
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <h3 className="text-lg font-headline font-black italic tracking-tight text-white/60">Architectural Narrative</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Short Description</Label>
                <Textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[100px]" placeholder="Brief teaser..." />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Case Study (Detailed)</Label>
                <Textarea value={formData.longDesc} onChange={e => setFormData({ ...formData, longDesc: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[300px]" placeholder="The full story..." />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Strategic Methodology</Label>
                <Textarea value={formData.methodology} onChange={e => setFormData({ ...formData, methodology: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" placeholder="Explain the how..." />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Project Impact</Label>
                <Textarea value={formData.impact} onChange={e => setFormData({ ...formData, impact: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" placeholder="Explain the result..." />
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Globe className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Search Optimization</h3>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">SEO Title</Label>
                  <Input 
                    value={formData.seo.title} 
                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })} 
                    className="bg-white/5 border-white/5 rounded-xl h-14" 
                    placeholder="Auto-suggested from project name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Keywords (CSV)</Label>
                  <Input 
                    value={formData.seo.keywords} 
                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })} 
                    className="bg-white/5 border-white/5 rounded-xl h-14" 
                    placeholder="UX, React, FinTech"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Meta Description</Label>
                <Textarea 
                  value={formData.seo.description} 
                  onChange={e => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })} 
                  className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" 
                  placeholder="Auto-suggested from short description..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Canonical URL</Label>
                  <Input 
                    value={formData.seo.canonicalUrl} 
                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, canonicalUrl: e.target.value } })} 
                    className="bg-white/5 border-white/5 rounded-xl h-14" 
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">OG Image URL</Label>
                  <Input 
                    value={formData.seo.ogImage} 
                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, ogImage: e.target.value } })} 
                    className="bg-white/5 border-white/5 rounded-xl h-14" 
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 h-14">
                <div className="space-y-0.5">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white">Indexable</Label>
                  <p className="text-[8px] text-white/20 uppercase font-black">Allow bots to crawl</p>
                </div>
                <Switch 
                  checked={formData.seo.indexable} 
                  onCheckedChange={v => setFormData({ ...formData, seo: { ...formData.seo, indexable: v } })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <SeoHud 
            title={formData.seo.title || formData.title}
            description={formData.seo.description || formData.desc}
            keywords={formData.seo.keywords}
            ogImage={formData.seo.ogImage || formData.image}
          />
          
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-8">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-white/40">Media & Assets (S3)</h3>
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{uploading ? 'Syncing...' : 'Upload to S3'}</span>
                 </div>
               </div>
               <div className="space-y-2">
                 <Label className="text-[9px] uppercase font-black text-white/20 ml-2">Image Alt Text (SEO)</Label>
                 <Input value={formData.altText} onChange={e => setFormData({ ...formData, altText: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-10 text-[10px]" placeholder="Descriptive alt text..." />
               </div>
               <div className="space-y-2">
                 <Label className="text-[9px] uppercase font-black text-white/20">Direct Image URL</Label>
                 <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-10 text-[10px]" />
               </div>
               <div className="space-y-2">
                 <Label className="text-[9px] uppercase font-black text-white/20">AI Image Hint</Label>
                 <Input value={formData.imageHint} onChange={e => setFormData({ ...formData, imageHint: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-10 text-[10px]" placeholder="e.g. high-tech workspace" />
               </div>
               <div className="space-y-2">
                 <Label className="text-[9px] uppercase font-black text-white/20">Accent Color</Label>
                 <Input value={formData.accentColor} onChange={e => setFormData({ ...formData, accentColor: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-10 text-[10px]" />
               </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-8">
             <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Technology Stack</Label>
                <div className="flex gap-2">
                  <Input value={newTech} onChange={e => setNewTech(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} className="bg-white/5 border-white/5 rounded-xl h-10 flex-1" placeholder="Add tool..." />
                  <Button onClick={addTech} variant="outline" className="h-10 w-10 rounded-xl border-white/10">+</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech?.map((t: string) => (
                    <span key={t} className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary flex items-center gap-2">
                      {t} <button onClick={() => setFormData({ ...formData, tech: formData.tech.filter((x: string) => x !== t) })}><Plus className="w-3 h-3 rotate-45" /></button>
                    </span>
                  ))}
                </div>
             </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-8">
             <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Engineering Challenges</Label>
                <div className="flex gap-2">
                  <Input value={newChallenge} onChange={e => setNewChallenge(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addChallenge())} className="bg-white/5 border-white/5 rounded-xl h-10 flex-1" placeholder="Add hurdle..." />
                  <Button onClick={addChallenge} variant="outline" className="h-10 w-10 rounded-xl border-white/10">+</Button>
                </div>
                <div className="space-y-2">
                  {formData.challenges?.map((c: string) => (
                    <div key={c} className="p-3 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/60 flex items-center justify-between group">
                      <span className="truncate pr-4">{c}</span>
                      <button onClick={() => setFormData({ ...formData, challenges: formData.challenges.filter((x: string) => x !== c) })} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Deployment Status</span>
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

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div>Loading Lab...</div>}>
      <ProjectFormContent />
    </Suspense>
  );
}
