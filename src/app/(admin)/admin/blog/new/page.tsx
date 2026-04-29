'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { uploadToS3 } from '@/lib/aws/s3-actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, FileText, Globe, Plus, Trash2, Database, MessageSquare, Lightbulb, HelpCircle, RefreshCcw, AlertTriangle, Code, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { SeoHud } from '@/components/admin/seo-hud';

function BlogFormContent() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newFact, setNewFact] = useState('');
  const [newCitation, setNewCitation] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categories: ['Engineering'] as string[],
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    summary: '',
    content: '',
    image: '',
    imageHint: '',
    altText: '',
    status: 'draft',
    featured: false,
    seo: { title: '', description: '', keywords: '', ogImage: '', indexable: true, canonicalUrl: '' },
    entity: { facts: [] as string[], citations: [] as string[] },
    aeo: { quickAnswer: '', takeaways: [] as string[], faqs: [] as any[] }
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const cloneId = searchParams.get('clone');
    if (cloneId) {
      const fetchCloneSource = async () => {
        try {
          const sourceSnap = await getDoc(doc(db, 'blog', cloneId));
          if (sourceSnap.exists()) {
            const data = sourceSnap.data();
            setFormData(prev => ({
              ...prev,
              ...data,
              title: `${data.title} (Clone)`,
              slug: `${data.slug}-copy`,
              status: 'draft',
              entity: data.entity || { facts: [], citations: [] },
              aeo: data.aeo || { quickAnswer: '', takeaways: [], faqs: [] }
            }));
            setIsSlugManual(true);
            toast({ title: 'Draft Cloned', description: 'Editorial content imported.' });
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
        ...formData[section as keyof typeof formData] as any,
        [field]: [...((formData[section as keyof typeof formData] as any)[field] || []), val]
      }
    });
    if (field === 'facts') setNewFact('');
    if (field === 'citations') setNewCitation('');
    if (field === 'takeaways') setNewTakeaway('');
    if (field === 'faqs') setNewFaq({ q: '', a: '' });
  };

  const handleRemoveItem = (section: string, field: string, val: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData] as any,
        [field]: (formData[section as keyof typeof formData] as any)[field].filter((item: any) => item !== val)
      }
    });
  };

  const handleSeoSync = () => {
    setFormData((prev: any) => ({
      ...prev,
      seo: {
        ...prev.seo,
        title: prev.seo.title || `${prev.title} | Kartik Jindal`,
        description: prev.seo.description || prev.summary.substring(0, 155) + (prev.summary.length > 155 ? '...' : ''),
        keywords: prev.seo.keywords || prev.categories.join(', ')
      }
    }));
    toast({ title: 'Editorial Sync', description: 'SEO fields populated from entry content.' });
  };

  const addCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
      setNewCategory('');
    }
  };

  const removeCategory = (cat: string) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }));
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
        toast({ title: 'Success', description: 'Cover synced to S3' });
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
      await addDoc(collection(db, 'blog'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Draft Saved', description: 'Journal entry initialized' });
      router.push('/admin/blog');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const generateSchemaPreview = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": formData.title,
      "description": formData.summary,
      "image": formData.image,
      "datePublished": formData.date,
      "author": { "@type": "Person", "name": "Kartik Jindal" },
      "abstract": formData.aeo?.quickAnswer,
      "keywords": formData.categories?.join(', '),
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": formData.aeo?.faqs?.map((f: any) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    };
    return JSON.stringify(schema, null, 2);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-5">
          <Link href="/admin/blog" className="text-[13px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary flex items-center gap-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Archive
          </Link>
          <div className="space-y-3">
            <span className="text-primary font-black uppercase tracking-[0.6em] text-[13px]">Journal CMS</span>
            <h1 className="text-6xl font-headline font-black italic tracking-tighter text-white">Draft Entry.</h1>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-16 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-10 group text-base"
        >
          {loading ? 'Initializing...' : 'Save Draft'} <Save className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="flex items-center gap-5 text-primary">
              <FileText className="w-8 h-8" />
              <h3 className="text-2xl font-headline font-black italic tracking-tight">Editorial Identity</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Post Title</Label>
                  {!formData.title && <span className="text-[9px] text-red-500 font-black uppercase tracking-widest">Required</span>}
                </div>
                <Input value={formData.title} onChange={handleTitleChange} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" placeholder="e.g. The Future of WebGL" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Slug</Label>
                  {!/^[a-z0-9-]+$/.test(formData.slug) && formData.slug && <span className="text-[9px] text-red-500 font-black uppercase tracking-widest">Invalid Format</span>}
                </div>
                <Input
                  value={formData.slug}
                  onChange={e => {
                    setIsSlugManual(true);
                    setFormData({ ...formData, slug: e.target.value });
                  }}
                  className={`bg-white/5 border-white/5 rounded-xl h-16 text-lg font-mono ${!/^[a-z0-9-]+$/.test(formData.slug) && formData.slug ? 'border-red-500/50' : ''}`}
                  placeholder="future-of-webgl"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Display Date</Label>
                <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" />
              </div>
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Read Time</Label>
                <Input value={formData.readTime} onChange={e => setFormData({ ...formData, readTime: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" />
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <h3 className="text-2xl font-headline font-black italic tracking-tight text-white/60">Editorial Content</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Abstract Summary</Label>
                  <span className={`text-[10px] font-mono ${formData.summary?.length > 160 ? 'text-yellow-500' : 'text-white/20'}`}>{formData.summary?.length || 0} chars</span>
                </div>
                <Textarea value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[140px] text-lg leading-relaxed" placeholder="Brief teaser..." />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Article Body (HTML/Markdown)</Label>
                  {!formData.content && <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Body Empty</span>}
                </div>
                <Textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="bg-white/5 border-white/5 rounded-xl min-h-[500px] font-mono text-sm leading-relaxed" placeholder="<p>Beginning the narrative...</p>" />
              </div>
            </div>
          </div>

          {/* Answer Engine Optimization (AEO) Section */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="flex items-center gap-5 text-primary">
              <MessageSquare className="w-8 h-8" />
              <h3 className="text-2xl font-headline font-black italic tracking-tight">Answer Engine (AEO)</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Quick Answer (Snippet Intro)</Label>
                  <span className={`text-[10px] font-mono ${formData.aeo?.quickAnswer?.length > 250 ? 'text-red-500' : 'text-white/20'}`}>
                    {formData.aeo?.quickAnswer?.length || 0} / 250
                  </span>
                </div>
                <Textarea
                  value={formData.aeo?.quickAnswer || ''}
                  onChange={e => setFormData({ ...formData, aeo: { ...formData.aeo, quickAnswer: e.target.value } })}
                  className="bg-white/5 border-white/5 rounded-xl min-h-[100px] text-base italic"
                  placeholder="Provide a concise 1-2 sentence answer for AI snippet engines..."
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/60">
                    <Lightbulb className="w-4 h-4" />
                    <Label className="text-[13px] uppercase font-black tracking-widest">Key Takeaways</Label>
                  </div>
                  <div className="flex gap-3">
                    <Input value={newTakeaway} onChange={e => setNewTakeaway(e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl" placeholder="Add a high-signal takeaway..." />
                    <Button onClick={() => handleAddItem('aeo', 'takeaways', newTakeaway)} variant="outline" className="h-14 w-14 rounded-xl border-white/10">+</Button>
                  </div>
                  <div className="grid gap-3">
                    {formData.aeo?.takeaways?.map((item: string) => (
                      <div key={item} className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between group">
                        <span className="text-sm font-bold text-white/70">{item}</span>
                        <button onClick={() => handleRemoveItem('aeo', 'takeaways', item)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-destructive" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 text-white/60">
                    <HelpCircle className="w-4 h-4" />
                    <Label className="text-[13px] uppercase font-black tracking-widest">Strategic FAQs</Label>
                  </div>
                  <div className="grid gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <Input value={newFaq.q} onChange={e => setNewFaq({ ...newFaq, q: e.target.value })} className="bg-transparent border-white/10 h-12" placeholder="Question..." />
                    <Textarea value={newFaq.a} onChange={e => setNewFaq({ ...newFaq, a: e.target.value })} className="bg-transparent border-white/10 min-h-[80px]" placeholder="Answer..." />
                    <Button onClick={() => handleAddItem('aeo', 'faqs', newFaq)} variant="outline" className="h-12 w-full rounded-xl border-white/10 uppercase font-black tracking-widest text-[10px]">Add FAQ Pair</Button>
                  </div>
                  <div className="grid gap-4">
                    {formData.aeo?.faqs?.map((item: any, i: number) => (
                      <div key={i} className="p-6 rounded-xl bg-white/[0.03] border border-white/5 space-y-3 relative group">
                        <button onClick={() => handleRemoveItem('aeo', 'faqs', item)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-destructive" /></button>
                        <div className="text-sm font-black text-primary uppercase tracking-tight">Q: {item.q}</div>
                        <div className="text-sm text-white/50 leading-relaxed">A: {item.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generative Intelligence Section (GEO) */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="flex items-center gap-5 text-primary">
              <Database className="w-8 h-8" />
              <h3 className="text-2xl font-headline font-black italic tracking-tight">Generative Intelligence (GEO)</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Hard Facts (Key Data Points)</Label>
                <div className="flex gap-3">
                  <Input value={newFact} onChange={e => setNewFact(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="e.g. Optimized bundle size by 30%..." />
                  <Button onClick={() => handleAddItem('entity', 'facts', newFact)} variant="outline" className="h-12 w-12 rounded-xl border-white/10">+</Button>
                </div>
                <div className="grid gap-3">
                  {formData.entity?.facts?.map((item: string) => (
                    <div key={item} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group">
                      <span className="text-sm font-bold text-white/60">{item}</span>
                      <button onClick={() => handleRemoveItem('entity', 'facts', item)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Sources & Citations</Label>
                <div className="flex gap-3">
                  <Input value={newCitation} onChange={e => setNewCitation(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="Link to research or documentation..." />
                  <Button onClick={() => handleAddItem('entity', 'citations', newCitation)} variant="outline" className="h-12 w-12 rounded-xl border-white/10">+</Button>
                </div>
                <div className="grid gap-3">
                  {formData.entity?.citations?.map((item: string) => (
                    <div key={item} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group">
                      <span className="text-xs font-mono text-white/40 truncate">{item}</span>
                      <button onClick={() => handleRemoveItem('entity', 'citations', item)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-primary">
                <Globe className="w-8 h-8" />
                <h3 className="text-2xl font-headline font-black italic tracking-tight">Search Optimization</h3>
              </div>
              <Button
                variant="outline"
                onClick={handleSeoSync}
                className="h-12 rounded-xl border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
              >
                Sync with Content <RefreshCcw className="w-3.5 h-3.5 ml-2" />
              </Button>
            </div>
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">SEO Title Override</Label>
                    <span className={`text-[10px] font-mono ${formData.seo.title.length > 60 || formData.seo.title.length < 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {formData.seo.title.length} / 60
                    </span>
                  </div>
                  <Input
                    value={formData.seo.title}
                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })}
                    className="bg-white/5 border-white/5 rounded-xl h-16 text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Keywords (CSV)</Label>
                  <Input
                    value={formData.seo.keywords}
                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })}
                    className="bg-white/5 border-white/5 rounded-xl h-16 text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Meta Description</Label>
                  <span className={`text-[10px] font-mono ${formData.seo.description.length > 160 || formData.seo.description.length < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {formData.seo.description.length} / 160
                  </span>
                </div>
                <Textarea
                  value={formData.seo.description}
                  onChange={e => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })}
                  className="bg-white/5 border-white/5 rounded-xl min-h-[140px] text-lg"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-3">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Canonical URL</Label>
                  <Input
                    value={formData.seo.canonicalUrl}
                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, canonicalUrl: e.target.value } })}
                    className="bg-white/5 border-white/5 rounded-xl h-16 font-mono text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">OG Image Override</Label>
                  <Input
                    value={formData.seo.ogImage}
                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, ogImage: e.target.value } })}
                    className="bg-white/5 border-white/5 rounded-xl h-16 font-mono text-base"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 h-20 mt-10">
                <div className="space-y-1">
                  <Label className="text-[15px] uppercase font-black tracking-widest text-white">Indexable</Label>
                  <p className="text-[11px] text-white/30 uppercase font-black">Allow bots to crawl</p>
                </div>
                <Switch
                  checked={formData.seo.indexable}
                  onCheckedChange={v => setFormData({ ...formData, seo: { ...formData.seo, indexable: v } })}
                />
              </div>
            </div>
          </div>

          {/* Schema Preview HUD */}
          <div className="glass rounded-[3rem] border-white/5 overflow-hidden">
            <button
              onClick={() => setShowSchema(!showSchema)}
              className="w-full flex items-center justify-between p-10 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-5 text-primary">
                <Code className="w-8 h-8" />
                <h3 className="text-2xl font-headline font-black italic tracking-tight">Entity Graph Preview (JSON-LD)</h3>
              </div>
              {showSchema ? <ChevronUp className="w-6 h-6 text-white/20" /> : <ChevronDown className="w-6 h-6 text-white/20" />}
            </button>
            <AnimatePresence>
              {showSchema && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-10 pb-10"
                >
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[10px] text-primary/70 overflow-x-auto whitespace-pre">
                    {generateSchemaPreview()}
                  </div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    This structured data is automatically generated for Gemini, Perplexity, and OpenAI crawlers.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <SeoHud
            title={formData.seo.title || formData.title}
            description={formData.seo.description || formData.summary}
            keywords={formData.seo.keywords}
            ogImage={formData.seo.ogImage || formData.image}
            url={`blog/${formData.slug || 'new-entry'}`}
          />

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10">
            <h3 className="text-[13px] uppercase font-black tracking-widest text-white/40">Visual Context (S3)</h3>
            <div className="space-y-8">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/5 shadow-2xl">
                {formData.image ? (
                  <img src={formData.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <ImageIcon className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                  <span className="text-[13px] font-black uppercase tracking-widest text-white">{uploading ? 'Syncing...' : 'Upload to S3'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[11px] uppercase font-black text-white/30 ml-2">Image Alt Text (SEO)</Label>
                  {!formData.altText && formData.image && <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Missing</span>}
                </div>
                <Input value={formData.altText} onChange={e => setFormData({ ...formData, altText: e.target.value })} className={`bg-white/5 border-white/5 rounded-xl h-14 text-sm ${!formData.altText && formData.image ? 'border-yellow-500/30' : ''}`} placeholder="Descriptive alt text..." />
              </div>
              <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="bg-white/5 border-white/5 rounded-xl h-14 text-sm font-mono" placeholder="Direct Image URL" />
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10">
            <div className="space-y-6">
              <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Category Arsenal</Label>
              <div className="flex gap-3">
                <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())} className="bg-white/5 border-white/5 rounded-xl h-14 font-bold" placeholder="Add category..." />
                <Button onClick={addCategory} variant="outline" className="h-14 w-14 rounded-xl border-white/10 text-xl">+</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.categories?.map((cat: string) => (
                  <span key={cat} className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[12px] font-bold text-primary flex items-center gap-3">
                    {cat} <button onClick={() => removeCategory(cat)}><Plus className="w-4 h-4 rotate-45" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-black uppercase tracking-widest text-white/40">Editorial Status</span>
              <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="w-44 bg-white/5 border-white/5 h-14 rounded-xl text-[13px] font-black uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-px bg-white/5" />

            {/* Featured toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bookmark className={`w-4 h-4 transition-colors ${formData.featured ? 'text-primary' : 'text-white/20'}`} />
                <div className="space-y-0.5">
                  <span className="text-[13px] font-black uppercase tracking-widest text-white">Featured</span>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Pin to top of journal</p>
                </div>
              </div>
              <Switch
                checked={!!formData.featured}
                onCheckedChange={v => setFormData({ ...formData, featured: v })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewBlogPostPage() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-primary animate-ping rounded-full" /></div>}>
      <BlogFormContent />
    </Suspense>
  );
}