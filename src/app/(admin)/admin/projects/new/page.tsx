'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { uploadToS3 } from '@/lib/aws/s3-actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2, Box, Globe, Calendar, Database, MessageSquare } from 'lucide-react';
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
    seo: { title: '', description: '', keywords: '', ogImage: '', indexable: true, canonicalUrl: '' },
    entity: { outcomes: [], facts: [], citations: [] },
    aeo: { quickAnswer: '', takeaways: [], faqs: [] }
  });

  const [newTech, setNewTech] = useState('');
  const [newFact, setNewFact] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');
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
              status: 'draft',
              entity: data.entity || { outcomes: [], facts: [], citations: [] },
              aeo: data.aeo || { quickAnswer: '', takeaways: [], faqs: [] }
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

  const handleAddItem = (section: string, field: string, val: any) => {
    if (!val) return;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: [...(formData[section][field] || []), val]
      }
    });
    if (field === 'facts') setNewFact('');
    if (field === 'outcomes') setNewOutcome('');
    if (field === 'takeaways') setNewTakeaway('');
  };

  const handleRemoveItem = (section: string, field: string, val: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: formData[section][field].filter((item: any) => item !== val)
      }
    });
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
      setFormData(prev => ({ ...prev, tech: [...prev.tech, newTech] }));
      setNewTech('');
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
                  className="bg-white/5 border-white/5 rounded-xl h-14 font-mono" 
                  placeholder="nova-orbital" 
                />
              </div>
            </div>
          </div>

          {/* Answer Engine Optimization (AEO) Section */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
             <div className="flex items-center gap-4 text-primary">
              <MessageSquare className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Answer Engine (AEO)</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Quick Answer (Fragment)</Label>
                <Textarea 
                  value={formData.aeo.quickAnswer} 
                  onChange={e => setFormData({ ...formData, aeo: { ...formData.aeo, quickAnswer: e.target.value } })} 
                  className="bg-white/5 border-white/5 rounded-xl min-h-[80px] text-xs italic" 
                  placeholder="Summarize the core technical achievement for AI snippet engines..."
                />
              </div>
            </div>
          </div>

          {/* Generative Intelligence Section (GEO/AEO) */}
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
             <div className="flex items-center gap-4 text-primary">
              <Database className="w-6 h-6" />
              <h3 className="text-lg font-headline font-black italic tracking-tight">Generative Intelligence (GEO)</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Project Outcomes</Label>
                <div className="flex gap-2">
                  <Input value={newOutcome} onChange={e => setNewOutcome(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="Add success marker..." />
                  <Button onClick={() => handleAddItem('entity', 'outcomes', newOutcome)} variant="outline" className="h-12 w-12 rounded-xl border-white/10">+</Button>
                </div>
                <div className="grid gap-2">
                  {formData.entity?.outcomes?.map((item: string) => (
                    <div key={item} className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between group">
                      <span className="text-[11px] font-bold text-white/60">{item}</span>
                      <button onClick={() => handleRemoveItem('entity', 'outcomes', item)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3 text-destructive" /></button>
                    </div>
                  ))}
                </div>
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
            url={`work/${formData.slug || 'new-build'}`}
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
               <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-12 text-[10px] font-mono" placeholder="Direct Image URL" />
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
    <Suspense fallback={<div>Loading CMS...</div>}>
      <ProjectFormContent />
    </Suspense>
  );
}
