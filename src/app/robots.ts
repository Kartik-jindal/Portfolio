import { MetadataRoute } from 'next';

/**
 * Standard Next.js robots.txt generator.
 * Configured to allow full indexing of public portfolio and journal content
 * while shielding the administrative command center.
 */
export default function robots(): MetadataRoute.Robots {
  // Ensure we have a clean base URL without trailing slashes for the sitemap entry
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com').replace(/\/$/, '');
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',   // Shield the admin dashboard root
        '/admin/*',  // Shield all sub-routes in the admin group
        '/*?*',      // Block query parameters to prevent duplicate content indexing
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
