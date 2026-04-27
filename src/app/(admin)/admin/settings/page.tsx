'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { uploadToS3 } from '@/lib/aws/s3-actions';
import { motion } from 'framer-motion';
import { Save, Share2, Eye, FileUp, User, Briefcase, Plus, Trash2, ShieldCheck, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [newVal, setNewVal] = useState({ expertise: '', service: '', credential: '', sameAs: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'site_config', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          ...data,
          identity: {
            authorName: data.identity?.authorName || '',
            jobTitle: data.identity?.jobTitle || '',
            bio: data.identity?.bio || '',
            expertise: data.identity?.expertise || [],
            services: data.identity?.services || [],
            credentials: data.identity?.credentials || [],
            sameAs: data.identity?.sameAs || []
          }
        });
      } else {
        const initial = {
          seo: { defaultTitle: '', defaultDescription: '', keywords: '', ogImage: '' },
          socials: { github: '', linkedin: '', twitter: '', instagram: '', email: '' },
          resume: { fileUrl: '' },
          visibility: { showTestimonials: true, showExperience: true, showExperiments: true },
          identity: { authorName: 'Kartik Jindal', jobTitle: 'Full Stack Architect', bio: '', expertise: [], services: [], credentials: [], sameAs: [] }
        };
        setSettings(initial);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (field: string, listField: string) => {
    const val = (newVal as any)[field];
    if (val && !settings.identity[listField].includes(val)) {
      setSettings({
        ...settings,
        identity: {
          ...settings.identity,
          [listField]: [...settings.identity[listField], val]
        }
      });
      setNewVal({ ...newVal, [field]: '' });
    }
  };

  const handleRemoveItem = (listField: string, val: string) => {
    setSettings({
      ...settings,
      identity: {
        ...settings.identity,
        [listField]: settings.identity[listField].filter((item: string) => item !== val)
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('path', path);
      
      const result = await uploadToS3(uploadFormData);
      
      if (result.success && result.url) {
        const updatedSettings = { ...settings };
        const keys = field.split('.');
        let current = updatedSettings;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = result.url;
        
        setSettings(updatedSettings);
        toast({ title: 'Upload Successful', description: 'Asset synced to S3 and linked.' });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'global'), settings);
      toast({ title: 'System Updated', description: 'Global configuration synced successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-primary animate-ping rounded-full" /></div>;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[12px]">Global Control</span>
          <h1 className="text-6xl font-headline font-black italic tracking-tighter text-white">System Settings.</h1>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-16 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-10 group text-base"
        >
          {saving ? 'Syncing...' : 'Sync Settings'} <Save className="w-7 h-7 ml-3 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <Tabs defaultValue="identity" className="space-y-12">
        <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-14 overflow-x-auto custom-scrollbar flex w-fit">
          <TabsTrigger value="identity" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Identity (GEO)</TabsTrigger>
          <TabsTrigger value="expertise" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Authority</TabsTrigger>
          <TabsTrigger value="socials" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Social Bridge</TabsTrigger>
          <TabsTrigger value="resume" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Assets (S3)</TabsTrigger>
          <TabsTrigger value="visibility" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Interface</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
             <div className="flex items-center gap-5 text-primary">
              <User className="w-8 h-8" />
              <h3 className="text-2xl font-headline font-black italic tracking-tight">Entity Identification</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Full Legal Name</Label>
                <Input 
                  value={settings?.identity?.authorName || ''} 
                  onChange={(e) => setSettings({ ...settings, identity: { ...settings.identity, authorName: e.target.value } })}
                  className="bg-white/5 border-white/5 rounded-xl h-16 text-lg"
                  placeholder="e.g. Kartik Jindal"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Professional Job Title</Label>
                <Input 
                  value={settings?.identity?.jobTitle || ''} 
                  onChange={(e) => setSettings({ ...settings, identity: { ...settings.identity, jobTitle: e.target.value } })}
                  className="bg-white/5 border-white/5 rounded-xl h-16 text-lg"
                  placeholder="e.g. Full Stack Architect"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Entity Bio (Concise Summary for AI)</Label>
              <Textarea 
                value={settings?.identity?.bio || ''} 
                onChange={(e) => setSettings({ ...settings, identity: { ...settings.identity, bio: e.target.value } })}
                className="bg-white/5 border-white/5 rounded-xl min-h-[120px] text-lg"
                placeholder="Brief professional summary that AI engines will use to describe you..."
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expertise" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
              <div className="flex items-center gap-4 text-primary">
                <ShieldCheck className="w-7 h-7" />
                <h3 className="text-xl font-headline font-black italic tracking-tight">Authority Markers</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-[11px] uppercase font-black tracking-widest text-white/40">Knowledge Pillars (Expertise)</Label>
                  <div className="flex gap-3">
                    <Input value={newVal.expertise} onChange={e => setNewVal({ ...newVal, expertise: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="Add expertise..." />
                    <Button onClick={() => handleAddItem('expertise', 'expertise')} variant="outline" className="h-12 w-12 rounded-xl border-white/10">+</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings?.identity?.expertise?.map((item: string) => (
                      <span key={item} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary flex items-center gap-2">
                        {item} <button onClick={() => handleRemoveItem('expertise', item)}><Plus className="w-3 h-3 rotate-45" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[11px] uppercase font-black tracking-widest text-white/40">Professional Credentials</Label>
                  <div className="flex gap-3">
                    <Input value={newVal.credential} onChange={e => setNewVal({ ...newVal, credential: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="Add certification..." />
                    <Button onClick={() => handleAddItem('credential', 'credentials')} variant="outline" className="h-12 w-12 rounded-xl border-white/10">+</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings?.identity?.credentials?.map((item: string) => (
                      <span key={item} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-white/60 flex items-center gap-2">
                        {item} <button onClick={() => handleRemoveItem('credentials', item)}><Plus className="w-3 h-3 rotate-45" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
              <div className="flex items-center gap-4 text-primary">
                <Globe className="w-7 h-7" />
                <h3 className="text-xl font-headline font-black italic tracking-tight">Entity Graph (sameAs)</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-[11px] uppercase font-black tracking-widest text-white/40">Service Catalog</Label>
                  <div className="flex gap-3">
                    <Input value={newVal.service} onChange={e => setNewVal({ ...newVal, service: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="Add service..." />
                    <Button onClick={() => handleAddItem('service', 'services')} variant="outline" className="h-12 w-12 rounded-xl border-white/10">+</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings?.identity?.services?.map((item: string) => (
                      <span key={item} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary flex items-center gap-2">
                        {item} <button onClick={() => handleRemoveItem('services', item)}><Plus className="w-3 h-3 rotate-45" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[11px] uppercase font-black tracking-widest text-white/40">Entity Verification (sameAs URLs)</Label>
                  <div className="flex gap-3">
                    <Input value={newVal.sameAs} onChange={e => setNewVal({ ...newVal, sameAs: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" placeholder="Add verified profile URL..." />
                    <Button onClick={() => handleAddItem('sameAs', 'sameAs')} variant="outline" className="h-12 w-12 rounded-xl border-white/10">+</Button>
                  </div>
                  <div className="space-y-2">
                    {settings?.identity?.sameAs?.map((item: string) => (
                      <div key={item} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40 group">
                        <span className="truncate pr-4">{item}</span>
                        <button onClick={() => handleRemoveItem('sameAs', item)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="socials" className="space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
             <div className="flex items-center gap-5 text-primary">
              <Share2 className="w-8 h-8" />
              <h3 className="text-2xl font-headline font-black italic tracking-tight">Social Bridge</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {Object.keys(settings?.socials || {}).map((key) => (
                <div key={key} className="space-y-3">
                  <Label className="text-[13px] uppercase font-black tracking-widest text-white/40 capitalize">{key}</Label>
                  <Input 
                    value={settings.socials[key]} 
                    onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, [key]: e.target.value } })}
                    className="bg-white/5 border-white/5 rounded-xl h-16 text-lg font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resume" className="space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
             <div className="flex items-center gap-5 text-primary">
              <FileUp className="w-8 h-8" />
              <h3 className="text-2xl font-headline font-black italic tracking-tight">Asset Management (S3)</h3>
            </div>
            <div className="space-y-6">
              <Label className="text-[13px] uppercase font-black tracking-widest text-white/40">Resume PDF Path</Label>
              <div className="flex gap-6">
                <Input 
                  value={settings?.resume?.fileUrl} 
                  onChange={(e) => setSettings({ ...settings, resume: { ...settings.resume, fileUrl: e.target.value } })}
                  className="bg-white/5 border-white/5 rounded-xl h-16 flex-1 text-lg font-mono"
                />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileUpload(e, 'resumes', 'resume.fileUrl')}
                  />
                  <Button variant="outline" className="h-16 rounded-xl border-white/10 px-10 font-black uppercase tracking-widest text-[13px]">
                    {uploading === 'resume.fileUrl' ? 'Syncing...' : 'Upload PDF to S3'}
                  </Button>
                </div>
              </div>
              <p className="text-[12px] text-white/20 uppercase font-black tracking-widest italic">Files are securely stored in your AWS S3 bucket and linked back to Firestore.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visibility" className="space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
             <div className="flex items-center gap-5 text-primary">
              <Eye className="w-8 h-8" />
              <h3 className="text-2xl font-headline font-black italic tracking-tight">Interface Toggles</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {Object.keys(settings?.visibility || {}).map((key) => (
                <div key={key} className="flex items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
                  <span className="text-sm uppercase font-black tracking-widest text-white/60">{key.replace('show', 'Show ')}</span>
                  <Switch 
                    checked={settings.visibility[key]} 
                    onCheckedChange={(checked) => setSettings({ ...settings, visibility: { ...settings.visibility, [key]: checked } })}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
