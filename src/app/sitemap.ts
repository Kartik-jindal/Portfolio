import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Resolves the best lastModified date for a Firestore document.
 * Prefers updatedAt over createdAt so edits are reflected in the sitemap.
 * Falls back to the current date only if neither field exists.
 */
function resolveDate(data: any): Date {
  const ts = data.updatedAt ?? data.createdAt;
  if (!ts) return new Date();
  if (ts.toDate) return ts.toDate();
  if (typeof ts === 'number') return new Date(ts);
  return new Date(ts);
}

// A stable anchor date for static pages — only update this when the page
// content actually changes, not on every deploy.
const STATIC_PAGE_DATE = new Date('2025-01-01');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com').replace(/\/$/, '');

  // Fetch blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  const categorySet = new Set<string>();

  try {
    const snap = await getDocs(query(collection(db, 'blog'), where('status', '==', 'published')));
    blogRoutes = snap.docs.map((d) => {
      const data = d.data();
      // Collect categories for archive routes
      const cats: string[] = data.categories || (data.category ? [data.category] : []);
      cats.forEach(c => categorySet.add(c.toLowerCase()));

      return {
        url: `${baseUrl}/blog/${data.slug || d.id}`,
        lastModified: resolveDate(data),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
  } catch (e) {
    console.error('Sitemap error (blog):', e);
  }

  // Category archive routes
  const categoryRoutes: MetadataRoute.Sitemap = Array.from(categorySet).map(cat => ({
    url: `${baseUrl}/blog/category/${encodeURIComponent(cat)}`,
    lastModified: STATIC_PAGE_DATE,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Fetch projects
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const snap = await getDocs(query(collection(db, 'projects'), where('status', '==', 'published')));
    projectRoutes = snap.docs.map((d) => ({
      url: `${baseUrl}/work/${d.data().slug || d.id}`,
      lastModified: resolveDate(d.data()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.error('Sitemap error (projects):', e);
  }

  return [
    {
      url: baseUrl,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projectRoutes,
    ...blogRoutes,
    ...categoryRoutes,
  ];
}
