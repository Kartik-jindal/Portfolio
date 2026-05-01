'use client';

import dynamic from 'next/dynamic';

export const Hero3D = dynamic(
    () => import('@/components/portfolio/hero-3d').then(m => ({ default: m.Hero3D })),
    { ssr: false }
);

export const IntroScreen = dynamic(
    () => import('@/components/portfolio/intro-screen').then(m => ({ default: m.IntroScreen })),
    { ssr: false }
);

export const CustomCursor = dynamic(
    () => import('@/components/portfolio/custom-cursor').then(m => ({ default: m.CustomCursor })),
    { ssr: false }
);
