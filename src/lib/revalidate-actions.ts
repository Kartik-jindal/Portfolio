'use server';

/**
 * Server actions for on-demand ISR revalidation.
 *
 * Called from admin save handlers after Firestore writes so the public site
 * reflects changes immediately instead of waiting for the revalidate window.
 */

import { revalidatePath } from 'next/cache';

/** Revalidate all blog-related public routes */
export async function revalidateBlog(slug?: string) {
    revalidatePath('/blog');
    revalidatePath('/');          // home page shows latest content
    revalidatePath('/sitemap.xml');
    if (slug) {
        revalidatePath(`/blog/${slug}`);
    }
}

/** Revalidate all project-related public routes */
export async function revalidateProject(slug?: string) {
    revalidatePath('/work');
    revalidatePath('/');
    revalidatePath('/sitemap.xml');
    if (slug) {
        revalidatePath(`/work/${slug}`);
    }
}

// ── Preview token generation ──────────────────────────────────────────────────

const PREVIEW_SECRET = process.env.SESSION_SECRET!;
// Tokens expire after 2 hours
const PREVIEW_TTL_MS = 2 * 60 * 60 * 1000;

async function importSignKey(secret: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
}

/**
 * Generate a signed, time-limited preview token for a blog post or project.
 * Returns the full preview URL to open in a new tab.
 * Token encodes { slug, type, exp } — no Firestore lookup needed at validation.
 */
export async function generatePreviewUrl(
    slug: string,
    type: 'blog' | 'project',
): Promise<string> {
    const payload = Buffer.from(
        JSON.stringify({ slug, type, exp: Date.now() + PREVIEW_TTL_MS }),
    ).toString('base64url');

    const key = await importSignKey(PREVIEW_SECRET);
    const enc = new TextEncoder();
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
    const token = `${payload}.${Buffer.from(sig).toString('base64url')}`;

    return `/api/preview?token=${token}`;
}
