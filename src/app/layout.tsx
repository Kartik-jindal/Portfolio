
import type { Metadata } from 'next';
import './globals.css';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { Hero3D, IntroScreen, CustomCursor } from '@/components/portfolio/client-wrappers';
import { GlobalContactDialog } from '@/components/portfolio/contact-dialog';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';

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
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com'}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark scroll-smooth ${playfair.variable} ${ptSans.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .loading-intro #page-content { visibility: hidden !important; }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isHome = window.location.pathname === '/';
                  var isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
                  if (isHome && !isBot) {
                    document.documentElement.classList.add('loading-intro');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-body antialiased bg-background text-foreground min-h-screen relative">
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
        <GlobalContactDialog />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
