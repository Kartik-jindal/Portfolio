import React from 'react';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { serialize } from '@/lib/serialize';
import type { Metadata } from 'next';
import { Navbar } from '@/components/portfolio/navbar';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { BlogListClient } from '@/components/portfolio/blog-list-client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';

async function getPostsByCategory(cat: string) {
    try {
        const snap = await getDocs(
            query(collection(db, 'blog'), where('status', '==', 'published'))
        );
        const all = snap.docs.map(d => serialize({ id: d.id, ...d.data() }));

        // Match against both `categories` array and legacy `category` string
        const filtered = all.filter((p: any) => {
            const cats: string[] = p.categories || (p.category ? [p.category] : []);
            return cats.some(c => c.toLowerCase() === cat.toLowerCase());
        });

        return filtered.sort((a: any, b: any) => {
            const ta = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt?.toMillis?.() || 0);
            const tb = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt?.toMillis?.() || 0);
            return tb - ta;
        });
    } catch { return []; }
}

async function getGlobalConfig() {
    try {
        const snap = await getDoc(doc(db, 'site_config', 'global'));
        return snap.exists() ? serialize(snap.data()) : null;
    } catch { return null; }
}

/** Generate all known category slugs for static params */
export async function generateStaticParams() {
    try {
        const snap = await getDocs(
            query(collection(db, 'blog'), where('status', '==', 'published'))
        );
        const cats = new Set<string>();
        snap.docs.forEach(d => {
            const data = d.data();
            const list: string[] = data.categories || (data.category ? [data.category] : []);
            list.forEach(c => cats.add(encodeURIComponent(c.toLowerCase())));
        });
        return Array.from(cats).map(cat => ({ cat }));
    } catch { return []; }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ cat: string }>;
}): Promise<Metadata> {
    const { cat } = await params;
    const decoded = decodeURIComponent(cat);
    const label = decoded.charAt(0).toUpperCase() + decoded.slice(1);
    const title = `${label} — Journal | Kartik Jindal`;
    const description = `Articles about ${label} from the Kartik Jindal journal.`;
    const canonical = `${BASE_URL}/blog/category/${cat}`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'Kartik Jindal',
            type: 'website',
        },
        twitter: { card: 'summary_large_image', title, description },
        robots: { index: true, follow: true },
    };
}

export default async function CategoryArchivePage({
    params,
}: {
    params: Promise<{ cat: string }>;
}) {
    const { cat } = await params;
    const decoded = decodeURIComponent(cat);
    const label = decoded.charAt(0).toUpperCase() + decoded.slice(1);

    const [posts, config] = await Promise.all([
        getPostsByCategory(decoded),
        getGlobalConfig(),
    ]);

    // BreadcrumbList JSON-LD
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Journal', item: `${BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: label, item: `${BASE_URL}/blog/category/${cat}` },
        ],
    };

    return (
        <>
            <main className="bg-transparent min-h-screen">
                <Navbar resumeUrl={config?.resume?.fileUrl} />

                <section className="pt-28 sm:pt-36 md:pt-48 pb-24 px-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />

                    <div className="max-w-[1600px] mx-auto relative z-10">
                        <div className="mb-16">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors mb-10"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> All Articles
                            </Link>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-primary uppercase tracking-[0.6em] text-sm font-black">Category</span>
                                <div className="h-px flex-1 bg-white/5 max-w-[120px]" />
                            </div>

                            <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-black mb-8 italic tracking-tighter leading-tight break-words">
                                {label}<span className="text-primary">.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-white/50 font-body font-light max-w-2xl leading-relaxed">
                                {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
                            </p>
                        </div>

                        {posts.length === 0 ? (
                            <div className="text-center py-32 text-white/20 uppercase tracking-[0.5em] font-black">
                                No articles in this category yet.
                            </div>
                        ) : (
                            <BlogListClient posts={posts} />
                        )}
                    </div>
                </section>

                <Contact />
                <Footer config={config} />
            </main>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
