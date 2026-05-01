import { cache } from 'react';
import React from 'react';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { serialize } from '@/lib/serialize';
import type { Metadata } from 'next';
import PostClient from './post-client';
import DOMPurify from 'isomorphic-dompurify';
import { draftMode } from 'next/headers';

export const revalidate = 3600; // ISR: revalidate blog posts every hour

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com';

// ── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  content?: string;
  image?: string;
  altText?: string;
  imageHint?: string;
  date?: string;
  readTime?: string;
  status?: string;
  featured?: boolean;
  categories?: string[];
  category?: string;
  createdAt?: number;
  updatedAt?: number;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    indexable?: boolean;
    canonicalUrl?: string;
    keywords?: string;
  };
  aeo?: {
    quickAnswer?: string;
    takeaways?: string[];
    faqs?: { q: string; a: string }[];
    keywords?: string;
  };
  entity?: {
    citations?: string[];
    facts?: string[];
    outcomes?: string[];
  };
  internalLinks?: { label: string; href: string }[];
  [key: string]: unknown; // allow extra Firestore fields
}

const getPost = cache(async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const q = query(collection(db, 'blog'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return serialize({ id: snap.docs[0].id, ...snap.docs[0].data() }) as BlogPost;
    const docSnap = await getDoc(doc(db, 'blog', slug));
    if (docSnap.exists()) return serialize({ id: docSnap.id, ...docSnap.data() }) as BlogPost;
    return null;
  } catch { return null; }
});

// Draft-mode variant — fetches any status (published or draft)
async function getPostDraft(slug: string): Promise<BlogPost | null> {
  try {
    const q = query(collection(db, 'blog'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return serialize({ id: snap.docs[0].id, ...snap.docs[0].data() }) as BlogPost;
    const docSnap = await getDoc(doc(db, 'blog', slug));
    if (docSnap.exists()) return serialize({ id: docSnap.id, ...docSnap.data() }) as BlogPost;
    return null;
  } catch { return null; }
}

const getGlobalConfig = cache(async function getGlobalConfig() {
  try {
    const docSnap = await getDoc(doc(db, 'site_config', 'global'));
    return docSnap.exists() ? serialize(docSnap.data()) : null;
  } catch { return null; }
});

async function getRelatedPosts(currentId: string, categories: string[]) {
  try {
    const snap = await getDocs(query(collection(db, 'blog'), where('status', '==', 'published'), limit(10)));
    const all = snap.docs.map(d => serialize({ id: d.id, ...d.data() })).filter((p: any) => p.id !== currentId);
    return all
      .map((p: any) => {
        const pCats: string[] = p.categories || (p.category ? [p.category] : []);
        return { ...p, _score: pCats.filter(c => categories.includes(c)).length };
      })
      .sort((a: any, b: any) => b._score - a._score || b.createdAt - a.createdAt)
      .slice(0, 3);
  } catch { return []; }
}

async function getRelatedProjects(categories: string[]) {
  try {
    const snap = await getDocs(query(collection(db, 'projects'), where('status', '==', 'published'), limit(20)));
    const all = snap.docs.map(d => serialize({ id: d.id, ...d.data() }));
    return all
      .map((p: any) => {
        const pTech: string[] = (p.tech || []).map((t: string) => t.toLowerCase());
        const pRole = (p.role || '').toLowerCase();
        const overlap = categories.filter(c =>
          pTech.some(t => t.includes(c.toLowerCase()) || c.toLowerCase().includes(t)) ||
          pRole.includes(c.toLowerCase())
        ).length;
        return { ...p, _score: overlap };
      })
      .filter((p: any) => p._score > 0)
      .sort((a: any, b: any) => b._score - a._score || (a.order || 0) - (b.order || 0))
      .slice(0, 3);
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [post, globalConfig]: [BlogPost | null, any] = await Promise.all([getPost(slug), getGlobalConfig()]);

  if (!post) return { title: 'Post Not Found' };

  const title = post.seo?.title || `${post.title} | Kartik Jindal`;
  const description = post.seo?.description || post.summary?.substring(0, 160);
  const ogImage = post.seo?.ogImage || post.image || globalConfig?.seo?.ogImage || null;
  const canonical = post.seo?.canonicalUrl || `${BASE_URL}/blog/${post.slug || post.id}`;
  const authorName = globalConfig?.identity?.authorName || 'Kartik Jindal';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Kartik Jindal',
      type: 'article',
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      authors: [authorName],
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: post.seo?.indexable ?? (post.status === 'published'),
      follow: post.seo?.indexable ?? (post.status === 'published'),
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();

  // In draft mode, fetch the post regardless of published status so admins
  // can preview drafts via the /api/preview route.
  const [post, config] = await Promise.all([
    isDraft ? getPostDraft(slug) : getPost(slug),
    getGlobalConfig(),
  ]);

  const categories: string[] = post
    ? (post.categories || (post.category ? [post.category] : ['Engineering']))
    : [];

  const [relatedPosts, relatedProjects] = post
    ? await Promise.all([getRelatedPosts(post.id, categories), getRelatedProjects(categories)])
    : [[], []];

  // Sanitize blog HTML server-side before passing to the client component.
  // This prevents XSS from admin-authored content rendered via dangerouslySetInnerHTML.
  const sanitizedContent = post?.content
    ? DOMPurify.sanitize(post.content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'a', 'img', 'figure', 'figcaption',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'hr', 'div', 'span',
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id',
        'target', 'rel', 'width', 'height',
        'data-ai-hint',
      ],
      ALLOW_DATA_ATTR: false,
      FORCE_BODY: false,
    })
    : '';

  // ── Server-rendered JSON-LD ──────────────────────────────────────────────
  const authorName = config?.identity?.authorName || 'Kartik Jindal';
  const citations: string[] = post?.entity?.citations || [];
  const canonical = post?.seo?.canonicalUrl || `${BASE_URL}/blog/${post?.slug || post?.id}`;

  const blogPostingSchema: Record<string, any> | null = post ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    ...(post.image && { image: post.image }),
    datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : (post.createdAt ? new Date(post.createdAt).toISOString() : undefined),
    author: { '@type': 'Person', name: authorName, url: BASE_URL },
    publisher: { '@type': 'Person', name: authorName, url: BASE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    url: canonical,
    inLanguage: 'en',
    ...(post.aeo?.quickAnswer && { abstract: post.aeo.quickAnswer }),
    ...(post.aeo?.keywords && { keywords: post.aeo.keywords }),
    ...(citations.length > 0 && {
      citation: citations.map((c: string) => ({ '@type': 'CreativeWork', url: c })),
    }),
  } : null;

  // FAQPage schema — only if FAQs exist
  const faqSchema = (post?.aeo?.faqs?.length ?? 0) > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post!.aeo!.faqs!.map((f: { q: string; a: string }) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${BASE_URL}/blog` },
      ...(post ? [{ '@type': 'ListItem', position: 3, name: post.title, item: canonical }] : []),
    ],
  };

  return (
    <>
      <PostClient
        post={post}
        config={config}
        relatedPosts={relatedPosts}
        relatedProjects={relatedProjects}
        sanitizedContent={sanitizedContent}
      />

      {/* All JSON-LD is server-rendered here, not inside the client component */}
      {blogPostingSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
