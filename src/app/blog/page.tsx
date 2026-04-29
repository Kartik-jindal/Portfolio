import { cache } from 'react';
import React from 'react';
import { Navbar } from '@/components/portfolio/navbar';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { BlogListClient } from '@/components/portfolio/blog-list-client';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

function serialize(data: any) {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      return new Date(value.seconds * 1000).getTime();
    }
    return value;
  }));
}

const getBlogData = cache(async function getBlogData() {
  try {
    const q = query(
      collection(db, 'blog'),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(d => serialize({ id: d.id, ...d.data() }));
    
    return data.sort((a: any, b: any) => {
      const timeA = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt?.toMillis?.() || 0);
      const timeB = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt?.toMillis?.() || 0);
      return timeB - timeA;
    });
  } catch (err) {
    return [];
  }
});

const getGlobalConfig = cache(async function getGlobalConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'global'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (e) { return null; }
});

const getSeoPageConfig = cache(async function getSeoPageConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'seo_pages'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (e) { return null; }
});

export async function generateMetadata(): Promise<Metadata> {
  const globalConfig = await getGlobalConfig();
  const seoPageConfig = await getSeoPageConfig();
  const blogSeo = seoPageConfig?.blog || {};

  const title = blogSeo.title || `Journal of Digital Architecture | Kartik Jindal`;
  const description = blogSeo.description || `Deep dives into high-fidelity engineering, creative motion, and technical architecture.`;
  const ogImage = blogSeo.ogImage || globalConfig?.seo?.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com'}/blog`,
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    robots: {
      index: blogSeo.indexable ?? true,
      follow: blogSeo.indexable ?? true,
    }
  };
}

export default async function BlogPage() {
  const posts = await getBlogData();
  const config = await getGlobalConfig();

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar resumeUrl={config?.resume?.fileUrl} />
      
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="mb-32">
            <span className="text-primary uppercase tracking-[0.6em] text-sm font-black block mb-6">Archive of Thoughts</span>
            <h1 className="text-5xl md:text-8xl font-headline font-black mb-8 italic tracking-tighter leading-tight break-words">
              The <span className="text-outline">Journal</span>.
            </h1>
            <p className="text-xl md:text-3xl text-white/80 font-body font-light max-w-3xl leading-relaxed break-words">
              An exploration into the intersection of code, design, and digital architecture.
            </p>
          </div>

          <BlogListClient posts={posts} />
        </div>
      </section>

      <Contact />
      <Footer config={config} />
    </main>
  );
}
