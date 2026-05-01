'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Injects the Google Analytics 4 gtag.js script.
 * Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is not set
 * (e.g. local dev without the env var).
 */
export function GoogleAnalytics() {
    if (!GA_ID) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
            </Script>
        </>
    );
}
