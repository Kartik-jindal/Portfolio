
import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kartikjindal.com';

  // Fetch blog posts for sitemap
  let blogRoutes: any[] = [];
  try {
    const q = query(collection(db, 'blog'), where('status', '==', 'published'));
    const snap = await getDocs(q);
    blogRoutes = snap.docs.map((doc) => ({
      url: `${baseUrl}/blog/${doc.data().slug || doc.id}`,
      lastModified: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (e) {
    console.error("Sitemap error:", e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogRoutes,
  ];
}
