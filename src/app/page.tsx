
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

async function getHeroData() {
  try {
    const docRef = doc(db, 'site_config', 'hero');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error("Firebase Error (Hero):", err);
    return null;
  }
}

async function getNavbarData() {
  try {
    const docRef = doc(db, 'site_config', 'navbar');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error("Firebase Error (Navbar):", err);
    return null;
  }
}

async function getFooterData() {
  try {
    const docRef = doc(db, 'site_config', 'footer');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error("Firebase Error (Footer):", err);
    return null;
  }
}

async function getAboutData() {
  try {
    const docRef = doc(db, 'site_config', 'about');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error("Firebase Error (About):", err);
    return null;
  }
}

async function getContactData() {
  try {
    const docRef = doc(db, 'site_config', 'contact');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error("Firebase Error (Contact):", err);
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
    const title = config?.seo?.defaultTitle || 'Kartik Jindal | Portfolio';
    const description = config?.seo?.defaultDescription || 'Full Stack Architect & Creative Engineer';
    const keywords = config?.seo?.keywords || 'Portfolio, Full Stack, Developer, Creative Engineering';
    const ogImage = config?.seo?.ogImage || 'https://picsum.photos/seed/portfolio/1200/630';

    return {
      title,
      description,
      keywords,
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
    };
  } catch (e) {
    return { title: 'Kartik Jindal | Portfolio' };
  }
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
      
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Kartik Jindal",
            "jobTitle": "Full Stack Architect",
            "url": "https://kartikjindal.com",
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
