import { cache } from 'react';
import { db } from '@/lib/firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import type { Metadata } from 'next';
import LegalPageClient from '@/components/portfolio/legal-page-client';

export const revalidate = 3600;

function serialize(data: any) {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data, (key, value) => {
        if (value && typeof value === 'object' && value.seconds !== undefined) {
            return new Date(value.seconds * 1000).getTime();
        }
        return value;
    }));
}

const getGlobalConfig = cache(async () => {
    try {
        const snap = await getDoc(doc(db, 'site_config', 'global'));
        return snap.exists() ? serialize(snap.data()) : null;
    } catch { return null; }
});

const getLegalContent = cache(async () => {
    try {
        const snap = await getDoc(doc(db, 'site_config', 'legal'));
        return snap.exists() ? serialize(snap.data()) : null;
    } catch { return null; }
});

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';
    return {
        title: 'Terms & Conditions | Kartik Jindal',
        description: 'Terms and conditions for using kartikjindal.com.',
        alternates: { canonical: `${baseUrl}/terms` },
        robots: { index: true, follow: true },
    };
}

export default async function TermsPage() {
    const config = await getGlobalConfig();
    const legal = await getLegalContent();
    const authorName = config?.identity?.authorName || 'Kartik Jindal';
    const email = config?.socials?.email || 'hello@kartikjindal.com';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';

    const defaultContent = `## 1. Acceptance of Terms

By accessing and using this website (${baseUrl}), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use this site.

## 2. Intellectual Property

All content on this website — including but not limited to text, design, code, graphics, animations, and project case studies — is the intellectual property of ${authorName} unless otherwise stated. You may not reproduce, distribute, or create derivative works from any content on this site without explicit written permission.

## 3. Use of the Website

You agree to use this website only for lawful purposes. You must not:

- Use the site in any way that violates applicable local, national, or international laws or regulations
- Transmit any unsolicited or unauthorised advertising or promotional material
- Attempt to gain unauthorised access to any part of the site or its related systems
- Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the site

## 4. Contact Form

The contact form on this website is provided for legitimate project inquiries and professional communication. By submitting the form, you confirm that the information you provide is accurate and that you are not submitting spam or malicious content.

We reserve the right to decline any inquiry at our sole discretion.

## 5. Project Work & Engagements

Any project engagement, freelance work, or collaboration discussed through this website is subject to a separate written agreement. Nothing on this website constitutes a binding contract for services. All project terms, deliverables, timelines, and pricing are agreed upon separately in writing before work commences.

## 6. Disclaimer of Warranties

This website is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the site will be uninterrupted, error-free, or free of viruses or other harmful components.

## 7. Limitation of Liability

To the fullest extent permitted by law, ${authorName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, this website or its content.

## 8. Third-Party Links

This website may contain links to third-party websites. These links are provided for convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.

## 9. Changes to Terms

We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Your continued use of the site after any changes constitutes your acceptance of the new terms.

## 10. Governing Law

These terms are governed by and construed in accordance with applicable law. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the relevant courts.

## 11. Contact

For any questions regarding these terms, please contact:

**${authorName}**
${email}
${baseUrl}`;

    const content = legal?.termsContent || defaultContent;
    const lastUpdated = legal?.termsUpdated || 'January 2025';

    return (
        <main className="bg-transparent min-h-screen">
            <Navbar resumeUrl={config?.resume?.fileUrl} />
            <LegalPageClient
                type="terms"
                title="Terms & Conditions"
                subtitle="Rules governing use of this website"
                content={content}
                lastUpdated={lastUpdated}
                authorName={authorName}
                email={email}
            />
            <Footer config={config} />
        </main>
    );
}
