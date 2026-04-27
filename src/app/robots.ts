import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/*',
        '/*?*', // Block query params from crawling to prevent duplicate content
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
