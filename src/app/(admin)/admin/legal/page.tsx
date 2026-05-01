'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Shield, FileText, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

const DEFAULT_PRIVACY = `## 1. Information We Collect

When you visit this website, we may collect the following types of information:

**Contact Form Data:** When you submit the contact form, we collect your name, email address, subject, and message. This information is stored securely in our database and used solely to respond to your inquiry.

**Usage Data:** We may collect anonymised information about how you interact with the site, including pages visited, time spent, and referring URLs. This data is used to improve the site experience and is never sold to third parties.

**Cookies:** This site may use essential cookies to ensure basic functionality. No tracking or advertising cookies are used.

## 2. How We Use Your Information

Information collected through this website is used exclusively to:

- Respond to project inquiries and messages you send via the contact form
- Understand how visitors use the site in order to improve it
- Maintain the security and integrity of the website

We do not sell, trade, or otherwise transfer your personal information to outside parties.

## 3. Data Storage & Security

Contact form submissions are stored in a secured cloud database (Firebase Firestore) with restricted access. Only the site owner has access to submitted data. We implement industry-standard security measures to protect your information against unauthorised access, alteration, or disclosure.

## 4. Third-Party Services

This website may use the following third-party services:

- **Firebase (Google):** Database and authentication infrastructure
- **AWS S3:** Asset storage for media files
- **Vercel / Google Cloud:** Hosting and deployment infrastructure

Each of these services has its own privacy policy governing how they handle data.

## 5. Your Rights

You have the right to:

- Request access to any personal data we hold about you
- Request correction or deletion of your personal data
- Withdraw consent for data processing at any time

To exercise any of these rights, contact us at the email address below.

## 6. Changes to This Policy

We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.`;

const DEFAULT_TERMS = `## 1. Acceptance of Terms

By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use this site.

## 2. Intellectual Property

All content on this website — including but not limited to text, design, code, graphics, animations, and project case studies — is the intellectual property of the site owner unless otherwise stated. You may not reproduce, distribute, or create derivative works from any content on this site without explicit written permission.

## 3. Use of the Website

You agree to use this website only for lawful purposes. You must not:

- Use the site in any way that violates applicable local, national, or international laws or regulations
- Transmit any unsolicited or unauthorised advertising or promotional material
- Attempt to gain unauthorised access to any part of the site or its related systems

## 4. Contact Form

The contact form on this website is provided for legitimate project inquiries and professional communication. By submitting the form, you confirm that the information you provide is accurate and that you are not submitting spam or malicious content.

## 5. Project Work & Engagements

Any project engagement, freelance work, or collaboration discussed through this website is subject to a separate written agreement. Nothing on this website constitutes a binding contract for services.

## 6. Disclaimer of Warranties

This website is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied.

## 7. Limitation of Liability

To the fullest extent permitted by law, the site owner shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website.

## 8. Changes to Terms

We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date.`;

export default function LegalAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [privacyContent, setPrivacyContent] = useState('');
    const [privacyUpdated, setPrivacyUpdated] = useState('');
    const [termsContent, setTermsContent] = useState('');
    const [termsUpdated, setTermsUpdated] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, 'site_config', 'legal'));
                if (snap.exists()) {
                    const d = snap.data();
                    setPrivacyContent(d.privacyContent || DEFAULT_PRIVACY);
                    setPrivacyUpdated(d.privacyUpdated || 'January 2025');
                    setTermsContent(d.termsContent || DEFAULT_TERMS);
                    setTermsUpdated(d.termsUpdated || 'January 2025');
                } else {
                    setPrivacyContent(DEFAULT_PRIVACY);
                    setPrivacyUpdated('January 2025');
                    setTermsContent(DEFAULT_TERMS);
                    setTermsUpdated('January 2025');
                }
            } catch (e) {
                console.error('Legal fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_config', 'legal'), {
                privacyContent,
                privacyUpdated,
                termsContent,
                termsUpdated,
            });
            toast({ title: 'Legal Pages Synced', description: 'Privacy policy and terms committed successfully.' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Sync Failed', description: e.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-primary animate-ping rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <span className="text-primary font-black uppercase tracking-[0.6em] text-[12px]">Legal Framework</span>
                    <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Legal Pages.</h1>
                    <p className="text-white/30 text-sm font-body font-light">
                        Edit the content of your public Privacy Policy and Terms &amp; Conditions pages.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/privacy"
                        target="_blank"
                        className="h-14 px-6 rounded-2xl glass border-white/10 flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </Link>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group text-sm"
                    >
                        {saving ? 'Syncing...' : 'Sync Legal'}{' '}
                        <Save className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    </Button>
                </div>
            </header>

            <Tabs defaultValue="privacy" className="space-y-10">
                <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-14 w-fit">
                    <TabsTrigger
                        value="privacy"
                        className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full flex items-center gap-2"
                    >
                        <Shield className="w-4 h-4" /> Privacy Policy
                    </TabsTrigger>
                    <TabsTrigger
                        value="terms"
                        className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black text-[12px] font-black uppercase tracking-widest px-8 h-full flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" /> Terms &amp; Conditions
                    </TabsTrigger>
                </TabsList>

                {/* ── Privacy Policy ── */}
                <TabsContent value="privacy" className="space-y-8">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
                                <div className="flex items-center gap-4 text-primary">
                                    <Shield className="w-6 h-6" />
                                    <h3 className="text-xl font-headline font-black italic tracking-tight">Privacy Policy Content</h3>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" /> Last Updated Date
                                    </Label>
                                    <Input
                                        value={privacyUpdated}
                                        onChange={(e) => setPrivacyUpdated(e.target.value)}
                                        placeholder="e.g. January 2025"
                                        className="bg-white/5 border-white/5 rounded-xl h-14 text-base"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] uppercase font-black tracking-widest text-white/40">
                                        Page Content
                                        <span className="ml-3 text-white/20 normal-case font-normal tracking-normal">
                                            — Use ## for headings, **text** for bold, - for bullet points
                                        </span>
                                    </Label>
                                    <Textarea
                                        value={privacyContent}
                                        onChange={(e) => setPrivacyContent(e.target.value)}
                                        className="bg-white/5 border-white/5 rounded-2xl min-h-[600px] text-sm font-mono leading-relaxed resize-y"
                                        placeholder="Write your privacy policy content here..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <Shield className="w-5 h-5" />
                                    <h4 className="text-[12px] font-black uppercase tracking-widest">Formatting Guide</h4>
                                </div>
                                <div className="space-y-4 text-[12px] font-body text-white/40 leading-relaxed">
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono space-y-2">
                                        <p className="text-primary/60">## Section Heading</p>
                                        <p>**Bold text**</p>
                                        <p>- Bullet point item</p>
                                        <p>Regular paragraph text</p>
                                    </div>
                                    <p>Separate paragraphs with a blank line. The content is rendered live on the public page.</p>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-primary/5 to-transparent space-y-4">
                                <p className="text-[12px] font-black uppercase tracking-widest text-primary">Public URL</p>
                                <Link
                                    href="/privacy"
                                    target="_blank"
                                    className="text-sm font-mono text-white/50 hover:text-primary transition-colors break-all"
                                >
                                    /privacy
                                </Link>
                                <p className="text-[11px] text-white/30 font-body leading-relaxed">
                                    Changes are live immediately after syncing. The page is linked in the footer.
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* ── Terms & Conditions ── */}
                <TabsContent value="terms" className="space-y-8">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
                                <div className="flex items-center gap-4 text-primary">
                                    <FileText className="w-6 h-6" />
                                    <h3 className="text-xl font-headline font-black italic tracking-tight">Terms &amp; Conditions Content</h3>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" /> Last Updated Date
                                    </Label>
                                    <Input
                                        value={termsUpdated}
                                        onChange={(e) => setTermsUpdated(e.target.value)}
                                        placeholder="e.g. January 2025"
                                        className="bg-white/5 border-white/5 rounded-xl h-14 text-base"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] uppercase font-black tracking-widest text-white/40">
                                        Page Content
                                        <span className="ml-3 text-white/20 normal-case font-normal tracking-normal">
                                            — Use ## for headings, **text** for bold, - for bullet points
                                        </span>
                                    </Label>
                                    <Textarea
                                        value={termsContent}
                                        onChange={(e) => setTermsContent(e.target.value)}
                                        className="bg-white/5 border-white/5 rounded-2xl min-h-[600px] text-sm font-mono leading-relaxed resize-y"
                                        placeholder="Write your terms and conditions content here..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <FileText className="w-5 h-5" />
                                    <h4 className="text-[12px] font-black uppercase tracking-widest">Formatting Guide</h4>
                                </div>
                                <div className="space-y-4 text-[12px] font-body text-white/40 leading-relaxed">
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono space-y-2">
                                        <p className="text-primary/60">## Section Heading</p>
                                        <p>**Bold text**</p>
                                        <p>- Bullet point item</p>
                                        <p>Regular paragraph text</p>
                                    </div>
                                    <p>Separate paragraphs with a blank line. The content is rendered live on the public page.</p>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-primary/5 to-transparent space-y-4">
                                <p className="text-[12px] font-black uppercase tracking-widest text-primary">Public URL</p>
                                <Link
                                    href="/terms"
                                    target="_blank"
                                    className="text-sm font-mono text-white/50 hover:text-primary transition-colors break-all"
                                >
                                    /terms
                                </Link>
                                <p className="text-[11px] text-white/30 font-body leading-relaxed">
                                    Changes are live immediately after syncing. The page is linked in the footer.
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
