import { cache } from 'react';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { serialize } from '@/lib/serialize';
import type { Metadata } from 'next';
import WorkClient from './work-client';

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';

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

const getPublishedProjects = cache(async function getPublishedProjects() {
  try {
    const q = query(
      collection(db, 'projects'),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => serialize({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  } catch (err) { return []; }
});

const getExperiments = cache(async function getExperiments() {
  const projects = await getPublishedProjects();
  return projects.filter((p: any) => p.type === 'EXPERIMENT');
});

const getFlagships = cache(async function getFlagships() {
  const projects = await getPublishedProjects();
  return projects.filter((p: any) => p.type === 'FLAGSHIP');
});

export async function generateMetadata(): Promise<Metadata> {
  const globalConfig = await getGlobalConfig();
  const seoPageConfig = await getSeoPageConfig();
  const workSeo = seoPageConfig?.work || {};

  const title = workSeo.title || `Portfolio Archive | Kartik Jindal`;
  const description = workSeo.description || `A comprehensive showcase of high-fidelity engineering, creative motion, and architectural precision.`;
  const ogImage = workSeo.ogImage || globalConfig?.seo?.ogImage;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/work` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/work`,
      siteName: 'Kartik Jindal',
      type: 'website',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: { index: workSeo.indexable ?? true, follow: workSeo.indexable ?? true },
  };
}

export default async function WorkPage() {
  const [config, experiments, flagships] = await Promise.all([
    getGlobalConfig(),
    getExperiments(),
    getFlagships(),
  ]);

  return (
    <WorkClient
      config={config}
      initialExperiments={experiments}
      initialFlagships={flagships}
    />
  );
}
