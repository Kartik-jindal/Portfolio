
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { Projects } from '@/components/portfolio/projects';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Metadata } from 'next';
import WorkClient from './work-client';

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

async function getGlobalConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'global'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (e) { return null; }
}

async function getSeoPageConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'seo_pages'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (e) { return null; }
}

async function getExperiments() {
  try {
    const q = query(
      collection(db, 'projects'),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => serialize({ id: d.id, ...d.data() }))
      .filter((p: any) => p.type === 'EXPERIMENT')
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  } catch (err) { return []; }
}

async function getFlagships() {
  try {
    const q = query(
      collection(db, 'projects'),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => serialize({ id: d.id, ...d.data() }))
      .filter((p: any) => p.type === 'FLAGSHIP')
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  } catch (err) { return []; }
}

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
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com'}/work`,
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    robots: {
      index: workSeo.indexable ?? true,
      follow: workSeo.indexable ?? true,
    }
  };
}

export default async function WorkPage() {
  const config = await getGlobalConfig();
  const experiments = await getExperiments();
  const flagships = await getFlagships();

  return (
    <WorkClient 
      config={config} 
      initialExperiments={experiments} 
      initialFlagships={flagships}
    />
  );
}
