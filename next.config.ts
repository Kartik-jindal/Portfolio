import type { NextConfig } from 'next';

// Allowed external image hostnames. Add new domains here as needed.
// Keeping this explicit prevents the Next.js image optimizer from being
// used as an open proxy for arbitrary external URLs.
const ALLOWED_IMAGE_HOSTNAMES = [
  // AWS S3 — portfolio media bucket
  'kj-portfolio-bucket.s3.eu-north-1.amazonaws.com',
  // CloudFront CDN — primary asset delivery
  'assets.kartikjindal.site',
  // Fallback placeholder images used during development
  'picsum.photos',
  // Google user content (profile photos from Google OAuth)
  'lh3.googleusercontent.com',
  // GitHub avatars
  'avatars.githubusercontent.com',
];

const nextConfig: NextConfig = {

  images: {
    remotePatterns: ALLOWED_IMAGE_HOSTNAMES.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },

  async headers() {
    return [
      // ── Security headers on every response ──────────────────────────────
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },

      // ── Long-lived cache for Next.js immutable static assets ────────────
      // These files have content hashes in their names so they are safe to
      // cache forever. The browser will fetch a new file when the hash changes.
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // ── Medium-lived cache for public static files (images, fonts, etc.) ─
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },

      // ── Short-lived cache for HTML pages (ISR handles freshness) ─────────
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=3600',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kartikjindal.site' }],
        destination: 'https://www.kartikjindal.site/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
