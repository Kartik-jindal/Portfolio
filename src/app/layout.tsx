
import type { Metadata } from 'next';
import './globals.css';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { Hero3D, IntroScreen, CustomCursor } from '@/components/portfolio/client-wrappers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kartik Jindal | Full Stack Developer & Creative Engineer',
  description: 'Portfolio of Kartik Jindal, a Full Stack Developer specializing in cinematic, high-performance web experiences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${playfair.variable} ${ptSans.variable}`}>
      <body suppressHydrationWarning className="font-body antialiased bg-background text-foreground min-h-screen relative">
        {/*
          Hides page content from first paint until IntroScreen mounts.
          Injected as an inline script that writes the style tag directly,
          bypassing React's reconciliation so it never causes an insertBefore
          mismatch with the dynamically-loaded IntroScreen sibling.
        */}
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var s=document.createElement('style');s.id='intro-hide';s.textContent='#page-content{visibility:hidden}';document.head.appendChild(s);})();` }} />
        <IntroScreen />

        {/* Global 3D Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Hero3D />
        </div>

        {/* Noise Overlay */}
        <div className="fixed inset-0 bg-grain z-[1] pointer-events-none opacity-[0.03]" />

        <div id="page-content" className="relative z-10">
          {children}
        </div>

        <CustomCursor />
      </body>
    </html>
  );
}
