import { Navbar } from '@/components/portfolio/navbar';
import { Hero } from '@/components/portfolio/hero';
import { About } from '@/components/portfolio/about';
import { Projects } from '@/components/portfolio/projects';
import { Experience } from '@/components/portfolio/experience';
import { Testimonials } from '@/components/portfolio/testimonials';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { ScrollIndicator } from '@/components/portfolio/scroll-indicator';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <ScrollIndicator />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
