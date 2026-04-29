import { cache } from 'react';
import React from 'react';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import type { Metadata } from 'next';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ProjectDetailContent } from '@/components/portfolio/project-detail-content';
import { Breadcrumbs } from '@/components/portfolio/breadcrumbs';

function serialize(data: any) {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      return new Date(value.seconds * 1000).getTime();
    }
    return value;
  }));
}

const getProject = cache(async function getProject(slug: string) {
  try {
    const q = query(collection(db, 'projects'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return serialize({ id: snap.docs[0].id, ...snap.docs[0].data() });
    
    // ID Fallback
    const docSnap = await getDoc(doc(db, 'projects', slug));
    if (docSnap.exists()) return serialize({ id: docSnap.id, ...docSnap.data() });
    
    return null;
  } catch (e) { return null; }
});

const getGlobalConfig = cache(async function getGlobalConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'global'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (e) { return null; }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project: any = await getProject(slug);
  const globalConfig = await getGlobalConfig();

  if (!project) return { title: 'Project Not Found' };

  const title = project.seo?.title || `${project.title} | Kartik Jindal`;
  const description = project.seo?.description || project.desc?.substring(0, 160);
  const ogImage = project.seo?.ogImage || project.image || globalConfig?.seo?.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com'}/work/${project.slug || project.id}`,
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
      type: 'website',
    },
    robots: {
      index: project.seo?.indexable ?? (project.status === 'published'),
      follow: project.seo?.indexable ?? (project.status === 'published'),
    }
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  const config = await getGlobalConfig();

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-headline font-bold text-white">Project not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar resumeUrl={config?.resume?.fileUrl} />
      <div className="max-w-7xl mx-auto px-6 pt-32 -mb-24 relative z-20">
        <Breadcrumbs items={[{ label: 'Work', href: '/work' }, { label: project.title }]} />
      </div>
      <ProjectDetailContent project={project} />
      <Footer config={config} />
    </main>
  );
}
