
import { Navbar } from '@/components/portfolio/navbar';
import { Hero } from '@/components/portfolio/hero';
import { About } from '@/components/portfolio/about';
import { Projects } from '@/components/portfolio/projects';
import { Experience } from '@/components/portfolio/experience';
import { Testimonials } from '@/components/portfolio/testimonials';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { ScrollIndicator } from '@/components/portfolio/scroll-indicator';
import { IntroScreen } from '@/components/portfolio/intro-screen';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
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

async function getGlobalConfig() {
  try {
    const docRef = doc(db, 'site_config', 'global');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (err) { return null; }
}

async function getSeoPageConfig() {
  try {
    const docRef = doc(db, 'site_config', 'seo_pages');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (err) { return null; }
}

async function getHeroData() {
  try {
    const docRef = doc(db, 'site_config', 'hero');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (err) { return null; }
}

async function getNavbarData() {
  try {
    const docRef = doc(db, 'site_config', 'navbar');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (err) { return null; }
}

async function getFooterData() {
  try {
    const docRef = doc(db, 'site_config', 'footer');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (err) { return null; }
}

async function getAboutData() {
  try {
    const docRef = doc(db, 'site_config', 'about');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (err) { return null; }
}

async function getContactData() {
  try {
    const docRef = doc(db, 'site_config', 'contact');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (err) { return null; }
}

async function getProjects(count: number) {
  try {
    const q = query(
      collection(db, 'projects'),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    const data = snap.docs
      .map(doc => serialize({ id: doc.id, ...doc.data() }))
      .filter((p: any) => p.type === 'FLAGSHIP');
    return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).slice(0, count);
  } catch (err) { return []; }
}

async function getExperience() {
  try {
    const q = collection(db, 'experience');
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => serialize({ id: doc.id, ...doc.data() }));
    return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  } catch (err) { return []; }
}

async function getTestimonials() {
  try {
    const q = collection(db, 'testimonials');
    const snap = await getDocs(q);
    return snap.docs.map(doc => serialize({ id: doc.id, ...doc.data() }));
  } catch (err) { return []; }
}

export async function generateMetadata(): Promise<Metadata> {
  const globalConfig = await getGlobalConfig();
  const seoPageConfig = await getSeoPageConfig();
  const homeSeo = seoPageConfig?.home || {};

  const title = homeSeo.title || globalConfig?.seo?.defaultTitle || 'Kartik Jindal | Full Stack Architect';
  const description = homeSeo.description || globalConfig?.seo?.defaultDescription || 'Engineering digital landscapes where architectural precision meets artistic motion.';
  const keywords = homeSeo.keywords || globalConfig?.seo?.keywords || 'Portfolio, Full Stack, Developer, Creative Engineering';
  const ogImage = homeSeo.ogImage || globalConfig?.seo?.ogImage || 'https://picsum.photos/seed/portfolio/1200/630';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com',
    },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: homeSeo.indexable ?? true,
      follow: homeSeo.indexable ?? true,
    }
  };
}

export default async function Home() {
  const config = await getGlobalConfig();
  const heroData = await getHeroData();
  const navData = await getNavbarData();
  const footerLayout = await getFooterData();
  const aboutData = await getAboutData();
  const contactData = await getContactData();
  const initialProjects = await getProjects(3);
  const experiences = await getExperience();
  const testimonials = await getTestimonials();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';
  const branding = config?.identity?.authorName || (heroData?.titleMain && heroData?.titleHighlight 
    ? `${heroData.titleMain} ${heroData.titleHighlight}` 
    : "Kartik Jindal");
  
  const jobTitle = config?.identity?.jobTitle || heroData?.badge || "Full Stack Architect";

  const visibility = config?.visibility || {
    showTestimonials: true,
    showExperience: true,
    showExperiments: true
  };

  return (
    <main className="relative">
      <IntroScreen />
      <Navbar navConfig={navData} resumeUrl={config?.resume?.fileUrl} />
      <ScrollIndicator />
      <Hero initialData={heroData} />
      <About initialData={aboutData} />
      <Projects initialData={initialProjects} limit={3} />
      {visibility.showExperience && <Experience initialData={experiences} />}
      {visibility.showTestimonials && <Testimonials initialData={testimonials} />}
      <Contact initialData={contactData} />
      <Footer config={config} footerLayout={footerLayout} />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": branding,
            "jobTitle": jobTitle,
            "url": baseUrl,
            "description": config?.seo?.defaultDescription || "Engineering digital landscapes where architectural precision meets artistic motion.",
            "sameAs": [
              config?.socials?.github,
              config?.socials?.linkedin,
              config?.socials?.twitter
            ].filter(Boolean)
          })
        }}
      />
    </main>
  );
}
