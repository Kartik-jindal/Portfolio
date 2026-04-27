
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { uploadToS3 } from '@/lib/aws/s3-actions';
import { motion } from 'framer-motion';
import { Save, Share2, Eye, FileUp, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'site_config', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        const initial = {
          seo: { defaultTitle: '', defaultDescription: '', keywords: '', ogImage: '' },
          socials: { github: '', linkedin: '', twitter: '', instagram: '', email: '' },
          resume: { fileUrl: '' },
          visibility: { showTestimonials: true, showExperience: true, showExperiments: true },
          identity: { authorName: 'Kartik Jindal', jobTitle: 'Full Stack Architect' }
        };
        setSettings(initial);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-2 h-2 bg-primary animate-ping rounded-full" /></div>;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[12px]">Global Control</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">System Settings.</h1>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group text-sm"
        >
          {saving ? 'Syncing...' : 'Sync Settings'} <Save className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </header>

      <Tabs defaultValue="identity" className="space-y-10">
        <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-14 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="identity" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Identity</TabsTrigger>
          <TabsTrigger value="socials" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Social Bridge</TabsTrigger>
          <TabsTrigger value="resume" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Assets (S3)</TabsTrigger>
          <TabsTrigger value="visibility" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full">Interface</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-6">
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
             <div className="flex items-center gap-4 text-primary">
              <User className="w-7 h-7" />
              <h3 className="text-xl font-headline font-black italic tracking-tight">Entity Identification</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Author Name (GEO)</Label>
                <Input 
                  value={settings?.identity?.authorName || ''} 
                  onChange={(e) => setSettings({ ...settings, identity: { ...settings.identity, authorName: e.target.value } })}
                  className="bg-white/5 border-white/5 rounded-xl h-14 text-base"
                  placeholder="e.g. Kartik Jindal"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Professional Title (GEO)</Label>
                <Input 
                  value={settings?.identity?.jobTitle || ''} 
                  onChange={(e) => setSettings({ ...settings, identity: { ...settings.identity, jobTitle: e.target.value } })}
                  className="bg-white/5 border-white/5 rounded-xl h-14 text-base"
                  placeholder="e.g. Full Stack Architect"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="socials" className="space-y-6">
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
             <div className="flex items-center gap-4 text-primary">
              <Share2 className="w-7 h-7" />
              <h3 className="text-xl font-headline font-black italic tracking-tight">Social Connectors</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.keys(settings?.socials || {}).map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="text-[12px] uppercase font-black tracking-widest text-white/40 capitalize">{key}</Label>
                  <Input 
                    value={settings.socials[key]} 
                    onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, [key]: e.target.value } })}
                    className="bg-white/5 border-white/5 rounded-xl h-14 text-base"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resume" className="space-y-6">
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
             <div className="flex items-center gap-4 text-primary">
              <FileUp className="w-7 h-7" />
              <h3 className="text-xl font-headline font-black italic tracking-tight">Asset Management (S3)</h3>
            </div>
            <div className="space-y-4">
              <Label className="text-[12px] uppercase font-black tracking-widest text-white/40">Resume PDF</Label>
              <div className="flex gap-4">
                <Input 
                  value={settings?.resume?.fileUrl} 
                  onChange={(e) => setSettings({ ...settings, resume: { ...settings.resume, fileUrl: e.target.value } })}
                  className="bg-white/5 border-white/5 rounded-xl h-14 flex-1 text-base"
                />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileUpload(e, 'resumes', 'resume.fileUrl')}
                  />
                  <Button variant="outline" className="h-14 rounded-xl border-white/10 px-6 font-black uppercase tracking-widest text-[12px]">
                    {uploading === 'resume.fileUrl' ? 'Syncing...' : 'Upload PDF to S3'}
                  </Button>
                </div>
              </div>
              <p className="text-[12px] text-white/20 uppercase font-black tracking-widest">Files are securely stored in your AWS S3 bucket and linked back to Firestore.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visibility" className="space-y-6">
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
             <div className="flex items-center gap-4 text-primary">
              <Eye className="w-7 h-7" />
              <h3 className="text-xl font-headline font-black italic tracking-tight">Interface Toggles</h3>
            </div>
            <div className="grid gap-6">
              {Object.keys(settings?.visibility || {}).map((key) => (
                <div key={key} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
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
