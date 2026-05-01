
import { cache } from 'react';
import { Navbar } from '@/components/portfolio/navbar';
import { Hero } from '@/components/portfolio/hero';
import { About } from '@/components/portfolio/about';
import { Projects } from '@/components/portfolio/projects';
import { Experience } from '@/components/portfolio/experience';
import { Testimonials } from '@/components/portfolio/testimonials';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { ScrollIndicator } from '@/components/portfolio/scroll-indicator';
import { db } from '@/lib/firebase/firestore';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { serialize } from '@/lib/serialize';
import { getAssetUrl } from '@/lib/utils';
import type { Metadata } from 'next';

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';

const getGlobalConfig = cache(async function getGlobalConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'global'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
});

const getSeoPageConfig = cache(async function getSeoPageConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'seo_pages'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
});

const getHeroData = cache(async function getHeroData() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'hero'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
});

const getNavbarData = cache(async function getNavbarData() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'navbar'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
});

const getFooterData = cache(async function getFooterData() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'footer'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
});

const getAboutData = cache(async function getAboutData() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'about'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
});

const getContactData = cache(async function getContactData() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'contact'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
});

const getProjects = cache(async function getProjects(count: number) {
  try {
    const snap = await getDocs(query(collection(db, 'projects'), where('status', '==', 'published')));
    return snap.docs
      .map(d => serialize({ id: d.id, ...d.data() }))
      .filter((p: any) => p.type === 'FLAGSHIP')
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .slice(0, count);
  } catch { return []; }
});

const getExperience = cache(async function getExperience() {
  try {
    const snap = await getDocs(collection(db, 'experience'));
    return snap.docs
      .map(d => serialize({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  } catch { return []; }
});

const getTestimonials = cache(async function getTestimonials() {
  try {
    const snap = await getDocs(collection(db, 'testimonials'));
    return snap.docs.map(d => serialize({ id: d.id, ...d.data() }));
  } catch { return []; }
});

export async function generateMetadata(): Promise<Metadata> {
  const [globalConfig, seoPageConfig] = await Promise.all([getGlobalConfig(), getSeoPageConfig()]);
  const homeSeo = seoPageConfig?.home || {};

  const title = homeSeo.title || globalConfig?.seo?.defaultTitle || 'Kartik Jindal | Full Stack Architect';
  const description = homeSeo.description || globalConfig?.seo?.defaultDescription || 'Engineering digital landscapes where architectural precision meets artistic motion.';
  const keywords = homeSeo.keywords || globalConfig?.seo?.keywords || 'Portfolio, Full Stack, Developer, Creative Engineering';
  // No picsum fallback — only use a real image if one is set
  const ogImage = homeSeo.ogImage || globalConfig?.seo?.ogImage || null;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: BASE_URL },
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: 'Kartik Jindal',
      ...(ogImage && { images: [{ url: getAssetUrl(ogImage), width: 1200, height: 630, alt: title }] }),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [getAssetUrl(ogImage)] }),
    },
    robots: { index: homeSeo.indexable ?? true, follow: homeSeo.indexable ?? true },
  };
}

export default async function Home() {
  const [
    config, heroData, navData, footerLayout,
    aboutData, contactData, initialProjects,
    experiences, testimonials,
  ] = await Promise.all([
    getGlobalConfig(),
    getHeroData(),
    getNavbarData(),
    getFooterData(),
    getAboutData(),
    getContactData(),
    getProjects(3),
    getExperience(),
    getTestimonials(),
  ]);

  const authorName = config?.identity?.authorName || 'Kartik Jindal';
  const jobTitle = config?.identity?.jobTitle || 'Full Stack Architect';
  const bio = config?.identity?.bio || 'Engineering digital landscapes where architectural precision meets artistic motion.';
  const expertise: string[] = config?.identity?.expertise || [];
  const services: string[] = config?.identity?.services || [];
  const sameAs = [
    config?.socials?.github,
    config?.socials?.linkedin,
    config?.socials?.twitter,
    ...(config?.identity?.sameAs || []),
  ].filter(Boolean);
  const profileImage = config?.identity?.photoURL || config?.seo?.ogImage || null;
  const email = config?.socials?.email || null;

  const visibility = config?.visibility || {
    showTestimonials: true,
    showExperience: true,
    showExperiments: true,
  };

  // Person JSON-LD — server-rendered, fully enriched for GEO
  const personSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName,
    jobTitle,
    url: BASE_URL,
    description: bio,
    sameAs,
    ...(profileImage && { image: getAssetUrl(profileImage) }),
    ...(email && { email }),
    ...(expertise.length > 0 && { knowsAbout: expertise }),
    ...(services.length > 0 && { hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s } })) } }),
  };

  // WebSite JSON-LD
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kartik Jindal',
    url: BASE_URL,
    description: bio,
    author: { '@type': 'Person', name: authorName, url: BASE_URL },
  };

  return (
    <main className="relative">
      <Navbar navConfig={navData} resumeUrl={config?.resume?.fileUrl} />
      <ScrollIndicator />
      <Hero initialData={heroData} />
      <About initialData={aboutData} />
      <Projects initialData={initialProjects} limit={3} useModal />
      {visibility.showExperience && <Experience initialData={experiences} />}
      {visibility.showTestimonials && <Testimonials initialData={testimonials} />}
      <Contact initialData={contactData} />
      <Footer config={config} footerLayout={footerLayout} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </main>
  );
}
