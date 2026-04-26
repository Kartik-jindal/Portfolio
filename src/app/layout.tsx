
import type {Metadata} from 'next';
import './globals.css';
import { CustomCursor } from '@/components/portfolio/custom-cursor';
import { Hero3D } from '@/components/portfolio/hero-3d';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';

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
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen relative">
        <AuthProvider>
          {/* Global 3D Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Hero3D />
          </div>
          
          {/* Noise Overlay */}
          <div className="fixed inset-0 bg-grain z-[1] pointer-events-none opacity-[0.03]" />
          
          <div className="relative z-10">
            {children}
          </div>

          <Toaster />
          <CustomCursor />
        </AuthProvider>
      </body>
    </html>
  );
}
