import { cache } from 'react';
import React from 'react';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc, limit, orderBy } from 'firebase/firestore';
import type { Metadata } from 'next';
import PostClient from './post-client';

function serialize(data: any) {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      return new Date(value.seconds * 1000).getTime();
    }
    return value;
  }));
}

const getPost = cache(async function getPost(slug: string) {
  try {
    // Try by slug first
    const q = query(collection(db, 'blog'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return serialize({ id: snap.docs[0].id, ...snap.docs[0].data() });

    // Fallback to ID
    const docSnap = await getDoc(doc(db, 'blog', slug));
    if (docSnap.exists()) return serialize({ id: docSnap.id, ...docSnap.data() });

    return null;
  } catch (e) { return null; }
});

const getGlobalConfig = cache(async function getGlobalConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'global'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (e) { return null; }
});

// Fetch related posts: same categories, exclude current, max 3
async function getRelatedPosts(currentId: string, categories: string[]) {
  try {
    const q = query(
      collection(db, 'blog'),
      where('status', '==', 'published'),
      limit(10)
    );
    const snap = await getDocs(q);
    const all = snap.docs
      .map(d => serialize({ id: d.id, ...d.data() }))
      .filter((p: any) => p.id !== currentId);

    // Score by category overlap
    const scored = all.map((p: any) => {
      const pCats: string[] = p.categories || (p.category ? [p.category] : []);
      const overlap = pCats.filter(c => categories.includes(c)).length;
      return { ...p, _score: overlap };
    });

    return scored
      .sort((a: any, b: any) => b._score - a._score || b.createdAt - a.createdAt)
      .slice(0, 3);
  } catch (e) { return []; }
}

// Fetch related projects: match by categories/tech overlap, max 3
async function getRelatedProjects(categories: string[]) {
  try {
    const q = query(
      collection(db, 'projects'),
      where('status', '==', 'published'),
      limit(20)
    );
    const snap = await getDocs(q);
    const all = snap.docs.map(d => serialize({ id: d.id, ...d.data() }));

    // Score by tech/category overlap with post categories
    const scored = all.map((p: any) => {
      const pTech: string[] = (p.tech || []).map((t: string) => t.toLowerCase());
      const pRole: string = (p.role || '').toLowerCase();
      const overlap = categories.filter(c =>
        pTech.some(t => t.includes(c.toLowerCase()) || c.toLowerCase().includes(t)) ||
        pRole.includes(c.toLowerCase())
      ).length;
      return { ...p, _score: overlap };
    });

    return scored
      .filter((p: any) => p._score > 0 || scored.length <= 3)
      .sort((a: any, b: any) => b._score - a._score || (a.order || 0) - (b.order || 0))
      .slice(0, 3);
  } catch (e) { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post: any = await getPost(slug);
  const globalConfig = await getGlobalConfig();

  if (!post) return { title: 'Post Not Found' };

  const title = post.seo?.title || `${post.title} | Kartik Jindal`;
  const description = post.seo?.description || post.summary?.substring(0, 160);
  const ogImage = post.seo?.ogImage || post.image || globalConfig?.seo?.ogImage;
  const canonical = post.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com'}/blog/${post.slug || post.id}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
      type: 'article',
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    },
    robots: {
      index: post.seo?.indexable ?? (post.status === 'published'),
      follow: post.seo?.indexable ?? (post.status === 'published'),
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const config = await getGlobalConfig();

  const categories: string[] = post
    ? (post.categories || (post.category ? [post.category] : ['Engineering']))
    : [];

  const [relatedPosts, relatedProjects] = post
    ? await Promise.all([
      getRelatedPosts(post.id, categories),
      getRelatedProjects(categories),
    ])
    : [[], []];

  return (
    <PostClient
      post={post}
      config={config}
      relatedPosts={relatedPosts}
      relatedProjects={relatedProjects}
    />
  );
}
