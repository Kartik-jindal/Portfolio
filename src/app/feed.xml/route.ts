/**
 * RSS 2.0 feed for blog posts.
 * Route: GET /feed.xml
 *
 * Fetches all published blog posts from Firestore and returns a valid RSS feed.
 * Cached for 1 hour via Next.js route segment config.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';

export const revalidate = 3600;

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function toRfc822(ts: any): string {
    try {
        let date: Date;
        if (typeof ts === 'number') {
            date = new Date(ts);
        } else if (ts?.toDate) {
            date = ts.toDate();
        } else {
            date = new Date(ts);
        }
        return date.toUTCString();
    } catch {
        return new Date().toUTCString();
    }
}

export async function GET() {
    const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://kartikjindal.com').replace(/\/$/, '');

    // Fetch site identity for feed metadata
    let authorName = 'Kartik Jindal';
    let siteDescription = 'Engineering digital landscapes where architectural precision meets artistic motion.';
    try {
        const configSnap = await getDoc(doc(db, 'site_config', 'global'));
        if (configSnap.exists()) {
            const data = configSnap.data();
            authorName = data.identity?.authorName || authorName;
            siteDescription = data.seo?.defaultDescription || siteDescription;
        }
    } catch { /* use defaults */ }

    // Fetch published posts
    let posts: any[] = [];
    try {
        const snap = await getDocs(
            query(collection(db, 'blog'), where('status', '==', 'published'))
        );
        posts = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a: any, b: any) => {
                const ta = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
                const tb = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
                return tb - ta;
            });
    } catch { /* return empty feed on error */ }

    const items = posts.map((post: any) => {
        const slug = post.slug || post.id;
        const url = `${BASE_URL}/blog/${slug}`;
        const title = escapeXml(post.title || 'Untitled');
        const description = escapeXml(post.summary || post.seo?.description || '');
        const pubDate = toRfc822(post.createdAt);
        const categories = (post.categories || (post.category ? [post.category] : ['Engineering'])) as string[];

        return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(authorName)}</author>
      ${categories.map(c => `<category>${escapeXml(c)}</category>`).join('\n      ')}
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(authorName)} — Journal</title>
    <link>${BASE_URL}/blog</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/favicon.ico</url>
      <title>${escapeXml(authorName)}</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
