import { cache } from 'react';
import React from 'react';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { serialize } from '@/lib/serialize';
import type { Metadata } from 'next';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ProjectDetailContent } from '@/components/portfolio/project-detail-content';
import { Breadcrumbs } from '@/components/portfolio/breadcrumbs';
import { getAssetUrl } from '@/lib/utils';

export const revalidate = 3600; // ISR: revalidate project pages every hour

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';
export const dynamic = 'force-dynamic';

async function getProject(slug: string) {
  try {
    const decodedSlug = decodeURIComponent(slug);
    console.log(`[Fetch] Project: ${decodedSlug}`);
    const q = query(collection(db, 'projects'), where('slug', '==', decodedSlug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return serialize({ id: snap.docs[0].id, ...snap.docs[0].data() });
    
    // Fallback to ID
    const docSnap = await getDoc(doc(db, 'projects', decodedSlug));
    if (docSnap.exists()) return serialize({ id: docSnap.id, ...docSnap.data() });
    
    return null;
  } catch (e) {
    console.error('Error fetching project:', e);
    return null;
  }
}

async function getGlobalConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'global'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [project, globalConfig]: [any, any] = await Promise.all([getProject(slug), getGlobalConfig()]);

  if (!project) return { title: 'Project Not Found' };

  const title = project.seo?.title || `${project.title} | Kartik Jindal`;
  const description = project.seo?.description || project.desc?.substring(0, 160);
  const ogImage = project.seo?.ogImage || project.image || globalConfig?.seo?.ogImage || null;
  const canonical = `${BASE_URL}/work/${project.slug || project.id}`;

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
      ...(ogImage && { images: [{ url: getAssetUrl(ogImage), width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [getAssetUrl(ogImage)] }),
    },
    robots: {
      index: project.seo?.indexable ?? (project.status === 'published'),
      follow: project.seo?.indexable ?? (project.status === 'published'),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, config]: [any, any] = await Promise.all([getProject(slug), getGlobalConfig()]);

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-headline font-bold text-white">Project not found</h1>
        </div>
      </main>
    );
  }

  const canonical = `${BASE_URL}/work/${project.slug || project.id}`;
  const authorName = config?.identity?.authorName || 'Kartik Jindal';

  // ── CreativeWork / SoftwareApplication JSON-LD ───────────────────────────
  const projectSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.longDesc || project.desc,
    url: canonical,
    ...(project.liveUrl && { sameAs: project.liveUrl }),
    ...(project.image && { image: getAssetUrl(project.image) }),
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    author: { '@type': 'Person', name: authorName, url: BASE_URL },
    ...(project.tech?.length > 0 && {
      keywords: project.tech.join(', '),
      runtimePlatform: project.tech.join(', '),
    }),
    ...(project.date && { dateCreated: project.date }),
    ...(project.liveUrl && { installUrl: project.liveUrl }),
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
    // AEO/GEO fields
    ...(project.aeo?.quickAnswer && { abstract: project.aeo.quickAnswer }),
    ...(project.geo?.outcomes?.length > 0 && {
      description: [project.longDesc || project.desc, ...project.geo.outcomes].join(' '),
    }),
  };

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
      { '@type': 'ListItem', position: 3, name: project.title, item: canonical },
    ],
  };

  // FAQPage schema — only if FAQs exist in AEO fields
  const faqSchema = project.aeo?.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: project.aeo.faqs.map((f: any) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  return (
    <>
      <main className="bg-transparent min-h-screen">
        <Navbar resumeUrl={config?.resume?.fileUrl} />
        <div className="max-w-7xl mx-auto px-6 pt-32 -mb-24 relative z-20">
          <Breadcrumbs items={[{ label: 'Work', href: '/work' }, { label: project.title }]} />
        </div>
        <ProjectDetailContent project={project} />
        <Footer config={config} />
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
    </>
  );
}
