
import { Navbar } from '@/components/portfolio/navbar';
import { Hero } from '@/components/portfolio/hero';
import { About } from '@/components/portfolio/about';
import { Projects } from '@/components/portfolio/projects';
import { Experience } from '@/components/portfolio/experience';
import { Testimonials } from '@/components/portfolio/testimonials';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { ScrollIndicator } from '@/components/portfolio/scroll-indicator';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import type { Metadata } from 'next';

async function getGlobalConfig() {
  try {
    const docRef = doc(db, 'site_config', 'global');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error("Firebase Error (Global Config):", err);
    return null;
  }
}

async function getProjects(count: number) {
  try {
    const q = query(
      collection(db, 'projects'),
      where('status', '==', 'published'),
      orderBy('order', 'asc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Firebase Error (Projects):", err);
    return [];
  }
}

async function getExperience() {
  try {
    const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Firebase Error (Experience):", err);
    return [];
  }
}

async function getTestimonials() {
  try {
    const q = collection(db, 'testimonials');
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Firebase Error (Testimonials):", err);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getGlobalConfig();
    if (!config?.seo) return { title: 'Kartik Jindal | Portfolio' };
    return {
      title: config.seo.defaultTitle || 'Kartik Jindal | Portfolio',
      description: config.seo.defaultDescription,
      keywords: config.seo.keywords,
    };
  } catch (e) {
    return { title: 'Kartik Jindal | Portfolio' };
  }
}

export default async function Home() {
  const config = await getGlobalConfig();
  const initialProjects = await getProjects(3);
  const experiences = await getExperience();
  const testimonials = await getTestimonials();

  const visibility = config?.visibility || {
    showTestimonials: true,
    showExperience: true,
    showExperiments: true
  };

  return (
    <main className="relative">
      <Navbar resumeUrl={config?.resume?.fileUrl} />
      <ScrollIndicator />
      <Hero />
      <About />
      <Projects initialData={initialProjects} limit={3} />
      {visibility.showExperience && <Experience initialData={experiences} />}
      {visibility.showTestimonials && <Testimonials initialData={testimonials} />}
      <Contact />
      <Footer config={config} />
    </main>
  );
}
