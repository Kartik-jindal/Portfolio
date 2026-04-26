
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Save, Globe, Layout, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SeoHud } from '@/components/admin/seo-hud';

export default function SeoAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<any>({
    work: { title: '', description: '', keywords: '', ogImage: '', indexable: true },
    blog: { title: '', description: '', keywords: '', ogImage: '', indexable: true }
  });
  const [globalSeo, setGlobalSeo] = useState<any>({
    defaultTitle: '',
    defaultDescription: '',
    keywords: '',
    ogImage: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const seoPagesRef = doc(db, 'site_config', 'seo_pages');
        const seoPagesSnap = await getDoc(seoPagesRef);
        if (seoPagesSnap.exists()) {
          setPageData(seoPagesSnap.data());
        }

        const globalRef = doc(db, 'site_config', 'global');
        const globalSnap = await getDoc(globalRef);
        if (globalSnap.exists()) {
          setGlobalSeo(globalSnap.data().seo || {});
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save page overrides
      await setDoc(doc(db, 'site_config', 'seo_pages'), pageData);
      
      // Save global defaults (merged)
      await updateDoc(doc(db, 'site_config', 'global'), {
        seo: globalSeo
      });
      
      toast({ title: 'SEO Synced', description: 'All metadata parameters updated successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sync Failed', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updatePage = (page: string, field: string, val: any) => {
    setPageData({
      ...pageData,
      [page]: { ...pageData[page], [field]: val }
    });
  };

  const updateGlobal = (field: string, val: any) => {
    setGlobalSeo({
      ...globalSeo,
      [field]: val
    });
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-2 h-2 bg-primary animate-ping rounded-full" /></div>;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Search Intelligence</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">SEO Command.</h1>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group"
        >
          {saving ? 'Syncing...' : 'Deploy SEO'} <Save className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <Tabs defaultValue="home" className="space-y-10">
        <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-14 w-fit">
          <TabsTrigger value="home" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[10px] font-black uppercase tracking-widest px-8 h-full flex gap-2">
            <Layout className="w-3 h-3" /> Home
          </TabsTrigger>
          <TabsTrigger value="work" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[10px] font-black uppercase tracking-widest px-8 h-full flex gap-2">
            <Briefcase className="w-3 h-3" /> Work
          </TabsTrigger>
          <TabsTrigger value="blog" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[10px] font-black uppercase tracking-widest px-8 h-full flex gap-2">
            <FileText className="w-3 h-3" /> Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
                <div className="flex items-center gap-4 text-primary">
                  <Globe className="w-6 h-6" />
                  <h3 className="text-lg font-headline font-black italic tracking-tight">Homepage Defaults</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Default Title Tag</Label>
                      <span className={`text-[9px] font-mono ${globalSeo.defaultTitle?.length > 60 ? 'text-red-500' : 'text-white/20'}`}>
                        {globalSeo.defaultTitle?.length || 0} / 60
                      </span>
                    </div>
                    <Input 
                      value={globalSeo.defaultTitle} 
                      onChange={e => updateGlobal('defaultTitle', e.target.value)} 
                      className="bg-white/5 border-white/5 rounded-xl h-14" 
                      placeholder="Kartik Jindal | Cinematic Portfolio"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Default Meta Description</Label>
                      <span className={`text-[9px] font-mono ${globalSeo.defaultDescription?.length > 160 ? 'text-red-500' : 'text-white/20'}`}>
                        {globalSeo.defaultDescription?.length || 0} / 160
                      </span>
                    </div>
                    <Textarea 
                      value={globalSeo.defaultDescription} 
                      onChange={e => updateGlobal('defaultDescription', e.target.value)} 
                      className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" 
                      placeholder="A high-fidelity showcase of digital architecture..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Keywords (CSV)</Label>
                      <Input 
                        value={globalSeo.keywords} 
                        onChange={e => updateGlobal('keywords', e.target.value)} 
                        className="bg-white/5 border-white/5 rounded-xl h-14" 
                        placeholder="Design, Engineering, React"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">OG Image URL</Label>
                      <Input 
                        value={globalSeo.ogImage} 
                        onChange={e => updateGlobal('ogImage', e.target.value)} 
                        className="bg-white/5 border-white/5 rounded-xl h-14" 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <SeoHud 
                title={globalSeo.defaultTitle || ''}
                description={globalSeo.defaultDescription || ''}
                keywords={globalSeo.keywords || ''}
                ogImage={globalSeo.ogImage || ''}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="work">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
                <div className="flex items-center gap-4 text-primary">
                  <Globe className="w-6 h-6" />
                  <h3 className="text-lg font-headline font-black italic tracking-tight">Work Archive Metadata</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">SEO Title Tag</Label>
                      <span className={`text-[9px] font-mono ${pageData.work.title.length > 60 ? 'text-red-500' : 'text-white/20'}`}>
                        {pageData.work.title.length} / 60
                      </span>
                    </div>
                    <Input 
                      value={pageData.work.title} 
                      onChange={e => updatePage('work', 'title', e.target.value)} 
                      className="bg-white/5 border-white/5 rounded-xl h-14" 
                      placeholder="Portfolio Archive | Kartik Jindal"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Meta Description</Label>
                      <span className={`text-[9px] font-mono ${pageData.work.description.length > 160 ? 'text-red-500' : 'text-white/20'}`}>
                        {pageData.work.description.length} / 160
                      </span>
                    </div>
                    <Textarea 
                      value={pageData.work.description} 
                      onChange={e => updatePage('work', 'description', e.target.value)} 
                      className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" 
                      placeholder="Explore selected builds and experiments..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Keywords (CSV)</Label>
                      <Input 
                        value={pageData.work.keywords} 
                        onChange={e => updatePage('work', 'keywords', e.target.value)} 
                        className="bg-white/5 border-white/5 rounded-xl h-14" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">OG Image URL</Label>
                      <Input 
                        value={pageData.work.ogImage} 
                        onChange={e => updatePage('work', 'ogImage', e.target.value)} 
                        className="bg-white/5 border-white/5 rounded-xl h-14" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <SeoHud 
                title={pageData.work.title}
                description={pageData.work.description}
                keywords={pageData.work.keywords}
                ogImage={pageData.work.ogImage}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blog">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
                <div className="flex items-center gap-4 text-primary">
                  <Globe className="w-6 h-6" />
                  <h3 className="text-lg font-headline font-black italic tracking-tight">Journal Archive Metadata</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">SEO Title Tag</Label>
                      <span className={`text-[9px] font-mono ${pageData.blog.title.length > 60 ? 'text-red-500' : 'text-white/20'}`}>
                        {pageData.blog.title.length} / 60
                      </span>
                    </div>
                    <Input 
                      value={pageData.blog.title} 
                      onChange={e => updatePage('blog', 'title', e.target.value)} 
                      className="bg-white/5 border-white/5 rounded-xl h-14" 
                      placeholder="Journal of Digital Architecture | Kartik Jindal"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40">Meta Description</Label>
                      <span className={`text-[9px] font-mono ${pageData.blog.description.length > 160 ? 'text-red-500' : 'text-white/20'}`}>
                        {pageData.blog.description.length} / 160
                      </span>
                    </div>
                    <Textarea 
                      value={pageData.blog.description} 
                      onChange={e => updatePage('blog', 'description', e.target.value)} 
                      className="bg-white/5 border-white/5 rounded-xl min-h-[120px]" 
                      placeholder="Deep dives into engineering and creative code..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <SeoHud 
                title={pageData.blog.title}
                description={pageData.blog.description}
                keywords={pageData.blog.keywords}
                ogImage={pageData.blog.ogImage}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
