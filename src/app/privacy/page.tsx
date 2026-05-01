import { cache } from 'react';
import { db } from '@/lib/firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { serialize } from '@/lib/serialize';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { Breadcrumbs } from '@/components/portfolio/breadcrumbs';
import type { Metadata } from 'next';
import LegalPageClient from '@/components/portfolio/legal-page-client';

export const revalidate = 3600;

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
    const config = await getGlobalConfig();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';
    return {
        title: 'Privacy Policy | Kartik Jindal',
        description: 'Privacy policy for kartikjindal.com — how data is collected, used, and protected.',
        alternates: { canonical: `${baseUrl}/privacy` },
        robots: { index: true, follow: true },
    };
}

export default async function PrivacyPage() {
    const config = await getGlobalConfig();
    const legal = await getLegalContent();
    const authorName = config?.identity?.authorName || 'Kartik Jindal';
    const email = config?.socials?.email || 'hello@kartikjindal.com';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';

    const defaultContent = `## 1. Information We Collect

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

## 6. External Links

This website may contain links to external sites. We are not responsible for the privacy practices or content of those sites and encourage you to review their privacy policies.

## 7. Changes to This Policy

We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the site after changes constitutes acceptance of the updated policy.

## 8. Contact

If you have any questions about this privacy policy or how your data is handled, please contact:

**${authorName}**
${email}
${baseUrl}`;

    const content = legal?.privacyContent || defaultContent;
    const lastUpdated = legal?.privacyUpdated || 'January 2025';

    return (
        <main className="bg-transparent min-h-screen">
            <Navbar resumeUrl={config?.resume?.fileUrl} />
            <LegalPageClient
                type="privacy"
                title="Privacy Policy"
                subtitle="How we handle your data"
                content={content}
                lastUpdated={lastUpdated}
                authorName={authorName}
                email={email}
            />
            <Footer config={config} />
        </main>
    );
}
