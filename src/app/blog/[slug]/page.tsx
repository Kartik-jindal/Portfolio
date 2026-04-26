
import React from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
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

async function getPost(slug: string) {
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
}

async function getGlobalConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'global'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch (e) { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post: any = await getPost(slug);
  const globalConfig = await getGlobalConfig();

  if (!post) return { title: 'Post Not Found' };

  const title = post.seo?.title || `${post.title} | Kartik Jindal`;
  const description = post.seo?.description || post.summary?.substring(0, 160);
  const ogImage = post.seo?.ogImage || post.image || globalConfig?.seo?.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com'}/blog/${post.slug || post.id}`,
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

  return <PostClient post={post} config={config} />;
}
