'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Plus, Trash2, Box, Globe, Calendar, RefreshCcw, Database, MessageSquare, HelpCircle, Lightbulb, AlertTriangle, Code, ChevronDown, ChevronUp, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { SeoHud } from '@/components/admin/seo-hud';
import { revalidateProject, generatePreviewUrl } from '@/lib/revalidate-actions';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { generateAeoGeoFieldsForProject } from '@/lib/ai-actions';
import { writeAuditLog } from '@/lib/audit-log';
import { useAuth } from '@/context/auth-context';
import { getAssetUrl } from '@/lib/utils';
import { ImageSelector } from '@/components/admin/image-selector';

function ProjectFormContent() {
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [newTech, setNewTech] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [newFact, setNewFact] = useState('');
  const [newCitation, setNewCitation] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
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
    entity: { outcomes: [] as string[], facts: [] as string[], citations: [] as string[] },
    aeo: { quickAnswer: '', takeaways: [] as string[], faqs: [] as any[] },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, role } = useAuth();

  // Clone support
  useEffect(() => {
    const cloneId = searchParams.get('clone');
    if (!cloneId) return;
    const fetchClone = async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', cloneId));
        if (snap.exists()) {
          const data = snap.data();
          setFormData((prev: any) => ({
            ...prev,
            ...data,
            title: `${data.title} (Clone)`,
            slug: `${data.slug}-copy`,
            status: 'draft',
            entity: data.entity || { outcomes: [], facts: [], citations: [] },
            aeo: data.aeo || { quickAnswer: '', takeaways: [], faqs: [] },
          }));
          setIsSlugManual(true);
          toast({ title: 'Clone Initialized', description: 'Data imported from source build.' });
        }
      } catch (e) { console.error('Clone Error:', e); }
    };
    fetchClone();
  }, [searchParams, toast]);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev: any) => ({ ...prev, title: val, slug: isSlugManual ? prev.slug : slugify(val) }));
  };

  const handleAddItem = (section: string, field: string, val: any) => {
    if (!val) return;
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: [...(prev[section][field] || []), val] },
    }));
    if (field === 'facts') setNewFact('');
    if (field === 'citations') setNewCitation('');
    if (field === 'outcomes') setNewOutcome('');
    if (field === 'takeaways') setNewTakeaway('');
    if (field === 'faqs') setNewFaq({ q: '', a: '' });
    if (field === 'challenges') setNewChallenge('');
  };

  const handleRemoveItem = (section: string, field: string, val: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: prev[section][field].filter((item: any) => item !== val) },
    }));
  };



  const handleSeoSync = () => {
    setFormData((prev: any) => ({
      ...prev,
      seo: {
        ...prev.seo,
        title: prev.seo.title || `${prev.title} | Kartik Jindal`,
        description: prev.seo.description || prev.desc.substring(0, 155) + (prev.desc.length > 155 ? '...' : ''),
        keywords: prev.seo.keywords || prev.tech.join(', '),
      },
    }));
    toast({ title: 'Metadata Synced', description: 'SEO fields populated from build content.' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'projects'), { ...formData, createdAt: serverTimestamp() });
      await revalidateProject(formData.slug);
      writeAuditLog('CREATE', 'project', {
        entityTitle: formData.title,
        actorEmail: user?.email ?? undefined,
        actorRole: role ?? undefined,
        detail: `Type: ${formData.type} · Status: ${formData.status}`,
      });
      toast({ title: 'Deployment Successful', description: 'Project added to archive' });
      router.push('/admin/projects');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally { setSaving(false); }
  };

  const handlePreview = async () => {
    if (!formData.slug) {
      toast({ variant: 'destructive', title: 'Slug Required', description: 'Add a slug before previewing.' });
      return;
    }
    setPreviewing(true);
    try {
      const url = await generatePreviewUrl(formData.slug, 'project');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      toast({ variant: 'destructive', title: 'Preview Failed', description: 'Could not generate preview link.' });
    } finally { setPreviewing(false); }
  };

  const handleAiGenerate = async () => {
    if (!formData.title && !formData.desc && !formData.longDesc) {
      toast({ variant: 'destructive', title: 'Content Required', description: 'Add a title and description before generating.' });
      return;
    }
    setAiGenerating(true);
    try {
      const result = await generateAeoGeoFieldsForProject(
        formData.title,
        formData.desc,
        formData.longDesc,
        formData.tech,
        formData.role,
      );
      setFormData((prev: any) => ({
        ...prev,
        aeo: {
          ...prev.aeo,
          quickAnswer: result.quickAnswer || prev.aeo.quickAnswer,
          takeaways: result.takeaways.length > 0 ? result.takeaways : prev.aeo.takeaways,
          faqs: result.faqs.length > 0 ? result.faqs : prev.aeo.faqs,
        },
        entity: {
          ...prev.entity,
          facts: result.facts.length > 0 ? result.facts : prev.entity.facts,
        },
      }));
      toast({ title: 'AI Complete', description: 'AEO/GEO fields populated from your project content.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'AI Failed', description: err.message });
    } finally {
      setAiGenerating(false);
    }
  };

  const addTech = () => {
    if (newTech && !formData.tech.includes(newTech)) {
      setFormData((prev: any) => ({ ...prev, tech: [...prev.tech, newTech] }));
      setNewTech('');
    }
  };

  const generateSchemaPreview = () => {
    const schema = {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication',
      name: formData.title, description: formData.desc,
      applicationCategory: 'DeveloperTool', operatingSystem: 'Web',
      author: { '@type': 'Person', name: 'Kartik Jindal' },
      image: formData.image, abstract: formData.aeo?.quickAnswer,
      featureList: formData.entity?.outcomes,
      softwareRequirements: formData.tech?.join(', '),
      mainEntity: { '@type': 'FAQPage', mainEntity: formData.aeo?.faqs?.map((f: any) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    };
    return JSON.stringify(schema, null, 2);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-5">
          <Link href="/admin/projects" className="text-[13px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary flex items-center gap-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Archive
          </Link>
          <div className="space-y-3">
            <span className="text-primary font-black uppercase tracking-[0.6em] text-[13px]">Project Lab</span>
            <h1 className="text-6xl font-headline font-black italic tracking-tighter text-white">Initialize Build.</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={handlePreview} disabled={previewing || !formData.slug}
            className="h-16 rounded-2xl border-white/10 text-white/60 font-black uppercase tracking-widest px-8 group hover:border-primary/40 hover:text-primary transition-all">
            {previewing ? 'Opening...' : 'Preview'} <Eye className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform" />
          </Button>
          <Button onClick={handleSubmit} disabled={saving}
            className="h-16 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-10 group text-base">
            {saving ? 'Initializing...' : 'Deploy to Archive'} <Save className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">

          {/* Core Identity */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="flex items-center gap-5 text-primary"><Box className="w-8 h-8" /><h3 className="text-2xl font-headline font-black italic tracking-tight">Core Identity</h3></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Project Title</Label>
                  {!formData.title && <span className="text-[9px] text-red-500 font-black uppercase tracking-widest">Required</span>}
                </div>
                <Input value={formData.title} onChange={handleTitleChange} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" placeholder="e.g. Nova Orbital" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Slug (URL Path)</Label>
                  {!/^[a-z0-9-]+$/.test(formData.slug) && formData.slug && <span className="text-[9px] text-red-500 font-black uppercase tracking-widest">Invalid Format</span>}
                </div>
                <Input value={formData.slug} onChange={e => { setIsSlugManual(true); setFormData((p: any) => ({ ...p, slug: e.target.value })); }}
                  className={`bg-white/5 border-white/5 rounded-xl h-16 text-lg font-mono ${!/^[a-z0-9-]+$/.test(formData.slug) && formData.slug ? 'border-red-500/50' : ''}`} placeholder="nova-orbital" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Type</Label>
                <Select value={formData.type} onValueChange={v => setFormData((p: any) => ({ ...p, type: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/5 h-16 rounded-xl text-base"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="FLAGSHIP">Flagship Build</SelectItem><SelectItem value="EXPERIMENT">Technical Experiment</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Role</Label>
                <Input value={formData.role} onChange={e => setFormData((p: any) => ({ ...p, role: e.target.value }))} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" placeholder="e.g. Lead Engineer" />
              </div>
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Completion Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <Input value={formData.date} onChange={e => setFormData((p: any) => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 rounded-xl h-16 pl-14 text-lg" placeholder="e.g. June 2024" />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Live URL</Label>
                <Input value={formData.liveUrl} onChange={e => setFormData((p: any) => ({ ...p, liveUrl: e.target.value }))} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg font-mono" placeholder="https://..." />
              </div>
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">GitHub URL</Label>
                <Input value={formData.githubUrl} onChange={e => setFormData((p: any) => ({ ...p, githubUrl: e.target.value }))} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg font-mono" placeholder="https://github.com/..." />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Display Order</Label>
                <Input type="number" value={formData.order} onChange={e => setFormData((p: any) => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" />
              </div>
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Impact Quote</Label>
                <Input value={formData.impact} onChange={e => setFormData((p: any) => ({ ...p, impact: e.target.value }))} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" placeholder="One-line impact statement..." />
              </div>
            </div>
          </div>

          {/* Narrative */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <h3 className="text-2xl font-headline font-black italic tracking-tight text-white/60">Architectural Narrative</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Abstract Teaser</Label>
                  <span className={`text-[10px] font-mono ${formData.desc?.length > 160 ? 'text-yellow-500' : 'text-white/20'}`}>{formData.desc?.length || 0} chars</span>
                </div>
                <Textarea value={formData.desc} onChange={e => setFormData((p: any) => ({ ...p, desc: e.target.value }))} className="bg-white/5 border-white/5 rounded-xl min-h-[120px] text-lg leading-relaxed" placeholder="Short teaser shown on project cards..." />
              </div>
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Case Study (Deep Dive)</Label>
                <RichTextEditor value={formData.longDesc} onChange={(html) => setFormData((p: any) => ({ ...p, longDesc: html }))} placeholder="Write the full case study — architecture decisions, challenges, solutions..." minHeight="400px" />
              </div>
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Strategic Methodology</Label>
                <Textarea value={formData.methodology} onChange={e => setFormData((p: any) => ({ ...p, methodology: e.target.value }))} className="bg-white/5 border-white/5 rounded-xl min-h-[100px] text-lg italic" placeholder="Describe the approach and process..." />
              </div>
            </div>
          </div>

          {/* Engineering Challenges */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
            <h3 className="text-2xl font-headline font-black italic tracking-tight text-white/60">Engineering Challenges</h3>
            <div className="flex gap-3">
              <Input value={newChallenge} onChange={e => setNewChallenge(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItem('challenges', 'challenges', newChallenge))} className="bg-white/5 border-white/10 h-14 rounded-xl" placeholder="Describe a technical challenge..." />
              <Button onClick={() => { if (newChallenge) { setFormData((p: any) => ({ ...p, challenges: [...p.challenges, newChallenge] })); setNewChallenge(''); } }} variant="outline" className="h-14 w-14 rounded-xl border-white/10">+</Button>
            </div>
            <div className="grid gap-3">
              {formData.challenges?.map((item: string, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-4 group">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-white/60 flex-1">{item}</span>
                  <button onClick={() => setFormData((p: any) => ({ ...p, challenges: p.challenges.filter((_: any, idx: number) => idx !== i) }))} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* AEO */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-primary"><MessageSquare className="w-8 h-8" /><h3 className="text-2xl font-headline font-black italic tracking-tight">Answer Engine (AEO)</h3></div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAiGenerate}
                disabled={aiGenerating || (!formData.title && !formData.desc)}
                className="h-12 rounded-xl border-primary/30 text-primary/70 font-black uppercase tracking-widest text-[10px] px-6 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all group"
              >
                {aiGenerating ? (
                  <><span className="w-3 h-3 rounded-full bg-primary animate-ping mr-2 inline-block" />Generating...</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5 mr-2 group-hover:scale-110 transition-transform" />Auto-fill with AI</>
                )}
              </Button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Quick Answer (Snippet Definition)</Label>
                  <span className={`text-[10px] font-mono ${formData.aeo?.quickAnswer?.length > 250 ? 'text-red-500' : 'text-white/20'}`}>{formData.aeo?.quickAnswer?.length || 0} / 250</span>
                </div>
                <Textarea value={formData.aeo?.quickAnswer || ''} onChange={e => setFormData((p: any) => ({ ...p, aeo: { ...p.aeo, quickAnswer: e.target.value } }))} className="bg-white/5 border-white/5 rounded-xl min-h-[100px] text-base italic" placeholder="Summarize the core technical achievement in 1-2 sentences for AI snippets..." />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/60"><Lightbulb className="w-4 h-4" /><Label className="text-[13px] uppercase font-black tracking-widest">Key Takeaways</Label></div>
                <div className="flex gap-3">
                  <Input value={newTakeaway} onChange={e => setNewTakeaway(e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl" placeholder="Add a key project takeaway..." />
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
                <div className="flex items-center gap-3 text-white/60"><HelpCircle className="w-4 h-4" /><Label className="text-[13px] uppercase font-black tracking-widest">Build FAQs</Label></div>
                <div className="grid gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <Input value={newFaq.q} onChange={e => setNewFaq(p => ({ ...p, q: e.target.value }))} className="bg-transparent border-white/10 h-12" placeholder="Question..." />
                  <Textarea value={newFaq.a} onChange={e => setNewFaq(p => ({ ...p, a: e.target.value }))} className="bg-transparent border-white/10 min-h-[80px]" placeholder="Answer..." />
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

          {/* GEO */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="flex items-center gap-5 text-primary"><Database className="w-8 h-8" /><h3 className="text-2xl font-headline font-black italic tracking-tight">Generative Intelligence (GEO)</h3></div>
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Project Outcomes (Success Markers)</Label>
                <div className="flex gap-3">
                  <Input value={newOutcome} onChange={e => setNewOutcome(e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl" placeholder="e.g. 40% reduction in TBT..." />
                  <Button onClick={() => handleAddItem('entity', 'outcomes', newOutcome)} variant="outline" className="h-14 w-14 rounded-xl border-white/10">+</Button>
                </div>
                <div className="grid gap-3">
                  {formData.entity?.outcomes?.map((item: string) => (
                    <div key={item} className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between group">
                      <span className="text-sm font-bold text-white/80">{item}</span>
                      <button onClick={() => handleRemoveItem('entity', 'outcomes', item)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Hard Evidence (Technical Facts)</Label>
                <div className="flex gap-3">
                  <Input value={newFact} onChange={e => setNewFact(e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl" placeholder="e.g. Utilized Web Workers for background tasks..." />
                  <Button onClick={() => handleAddItem('entity', 'facts', newFact)} variant="outline" className="h-14 w-14 rounded-xl border-white/10">+</Button>
                </div>
                <div className="grid gap-3">
                  {formData.entity?.facts?.map((item: string) => (
                    <div key={item} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group">
                      <span className="text-sm font-mono text-white/60">{item}</span>
                      <button onClick={() => handleRemoveItem('entity', 'facts', item)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Source Citations</Label>
                <div className="flex gap-3">
                  <Input value={newCitation} onChange={e => setNewCitation(e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl" placeholder="URL or publication name..." />
                  <Button onClick={() => handleAddItem('entity', 'citations', newCitation)} variant="outline" className="h-14 w-14 rounded-xl border-white/10">+</Button>
                </div>
                <div className="grid gap-3">
                  {formData.entity?.citations?.map((item: string) => (
                    <div key={item} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group">
                      <span className="text-xs font-mono text-white/40 truncate">{item}</span>
                      <button onClick={() => handleRemoveItem('entity', 'citations', item)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-primary"><Globe className="w-8 h-8" /><h3 className="text-2xl font-headline font-black italic tracking-tight">Search Optimization</h3></div>
              <Button variant="outline" onClick={handleSeoSync} className="h-12 rounded-xl border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                Sync with Content <RefreshCcw className="w-3.5 h-3.5 ml-2" />
              </Button>
            </div>
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">SEO Title Tag</Label>
                    <span className={`text-[10px] font-mono ${formData.seo.title.length > 60 || formData.seo.title.length < 30 ? 'text-yellow-500' : 'text-green-500'}`}>{formData.seo.title.length} / 60</span>
                  </div>
                  <Input value={formData.seo.title} onChange={e => setFormData((p: any) => ({ ...p, seo: { ...p.seo, title: e.target.value } }))} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Keywords (CSV)</Label>
                  <Input value={formData.seo.keywords} onChange={e => setFormData((p: any) => ({ ...p, seo: { ...p.seo, keywords: e.target.value } }))} className="bg-white/5 border-white/5 rounded-xl h-16 text-lg" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Meta Description</Label>
                  <span className={`text-[10px] font-mono ${formData.seo.description.length > 160 || formData.seo.description.length < 70 ? 'text-yellow-500' : 'text-green-500'}`}>{formData.seo.description.length} / 160</span>
                </div>
                <Textarea value={formData.seo.description} onChange={e => setFormData((p: any) => ({ ...p, seo: { ...p.seo, description: e.target.value } }))} className="bg-white/5 border-white/5 rounded-xl min-h-[140px] text-lg" />
              </div>
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-3">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Canonical URL</Label>
                  <Input value={formData.seo.canonicalUrl} onChange={e => setFormData((p: any) => ({ ...p, seo: { ...p.seo, canonicalUrl: e.target.value } }))} className="bg-white/5 border-white/5 rounded-xl h-16 font-mono text-base" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">OG Image Override</Label>
                  <Input value={formData.seo.ogImage} onChange={e => setFormData((p: any) => ({ ...p, seo: { ...p.seo, ogImage: e.target.value } }))} className="bg-white/5 border-white/5 rounded-xl h-16 font-mono text-base" />
                </div>
              </div>
              <div className="flex items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 h-20 mt-10">
                <div className="space-y-1">
                  <Label className="text-[15px] uppercase font-black tracking-widest text-white">Indexable</Label>
                  <p className="text-[11px] text-white/30 uppercase font-black">Visibility for search crawlers</p>
                </div>
                <Switch checked={formData.seo.indexable} onCheckedChange={v => setFormData((p: any) => ({ ...p, seo: { ...p.seo, indexable: v } }))} />
              </div>
            </div>
          </div>

          {/* Schema Preview */}
          <div className="glass rounded-[3rem] border-white/5 overflow-hidden">
            <button onClick={() => setShowSchema(!showSchema)} className="w-full flex items-center justify-between p-10 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-5 text-primary"><Code className="w-8 h-8" /><h3 className="text-2xl font-headline font-black italic tracking-tight">Entity Graph Preview (JSON-LD)</h3></div>
              {showSchema ? <ChevronUp className="w-6 h-6 text-white/20" /> : <ChevronDown className="w-6 h-6 text-white/20" />}
            </button>
            <AnimatePresence>
              {showSchema && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-10 pb-10">
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[10px] text-primary/70 overflow-x-auto whitespace-pre">{generateSchemaPreview()}</div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">This entity data is formatted for AI Knowledge Graphs (SoftwareApplication / FAQ).</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <SeoHud title={formData.seo.title || formData.title} description={formData.seo.description || formData.desc} keywords={formData.seo.keywords} ogImage={formData.seo.ogImage || formData.image} url={`work/${formData.slug || 'new-build'}`} />

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10">
            <h3 className="text-[13px] uppercase font-black tracking-widest text-white/40">Visual Context (CDN)</h3>
            <ImageSelector
              value={formData.image}
              onChange={(url) => setFormData((p: any) => ({ ...p, image: url }))}
              uploadPath="projects"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <Label className="text-[11px] uppercase font-black text-white/30 ml-2">Image Alt Text (SEO)</Label>
                {!formData.altText && formData.image && <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Missing</span>}
              </div>
              <Input value={formData.altText} onChange={e => setFormData((p: any) => ({ ...p, altText: e.target.value }))} className={`bg-white/5 border-white/5 rounded-xl h-14 text-sm ${!formData.altText && formData.image ? 'border-yellow-500/30' : ''}`} placeholder="Descriptive alt text for image search..." />
            </div>
            <Input value={formData.image} onChange={e => setFormData((p: any) => ({ ...p, image: e.target.value }))} className="bg-white/5 border-white/5 rounded-xl h-14 text-sm font-mono" placeholder="Direct Image URL" />
            <Input value={formData.accentColor} onChange={e => setFormData((p: any) => ({ ...p, accentColor: e.target.value }))} className="bg-white/5 border-white/5 rounded-xl h-14 text-sm font-mono" placeholder="Accent Color (HEX) e.g. #10B981" />
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10">
            <div className="space-y-6">
              <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Tools Used (GEO Tech)</Label>
              <div className="flex gap-3">
                <Input value={newTech} onChange={e => setNewTech(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} className="bg-white/5 border-white/5 rounded-xl h-14" placeholder="Add tool..." />
                <Button onClick={addTech} variant="outline" className="h-14 w-14 rounded-xl border-white/10 text-xl">+</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.tech?.map((t: string) => (
                  <span key={t} className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[12px] font-bold text-primary flex items-center gap-3">
                    {t} <button onClick={() => setFormData((p: any) => ({ ...p, tech: p.tech.filter((x: string) => x !== t) }))}><Plus className="w-4 h-4 rotate-45" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-black uppercase tracking-widest text-white/40">Deployment Status</span>
              <Select value={formData.status} onValueChange={v => setFormData((p: any) => ({ ...p, status: v }))}>
                <SelectTrigger className="w-44 bg-white/5 border-white/5 h-14 rounded-xl text-[13px] font-black uppercase"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
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
    <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-primary animate-ping rounded-full" /></div>}>
      <ProjectFormContent />
    </Suspense>
  );
}
