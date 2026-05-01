/**
 * Preview Route Handler
 * GET /api/preview?token=<token>
 *
 * Validates a preview token stored in Firestore, enables Next.js Draft Mode,
 * and redirects to the blog post or project page.
 *
 * The token is a short-lived HMAC-signed value created by the admin editor.
 * It encodes { slug, type, exp } so no Firestore lookup is needed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

const PREVIEW_SECRET = process.env.SESSION_SECRET!; // reuse the same secret

async function importKey(secret: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify'],
    );
}

async function verifyToken(token: string): Promise<{ slug: string; type: 'blog' | 'project'; exp: number } | null> {
    try {
        const [payload, sig] = token.split('.');
        if (!payload || !sig) return null;

        const key = await importKey(PREVIEW_SECRET);
        const enc = new TextEncoder();
        const sigBuf = Buffer.from(sig, 'base64url');
        const valid = await crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(payload));
        if (!valid) return null;

        const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
        if (data.exp < Date.now()) return null; // expired

        return data;
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
        return new NextResponse('Missing token', { status: 400 });
    }

    const data = await verifyToken(token);
    if (!data) {
        return new NextResponse('Invalid or expired preview token', { status: 401 });
    }

    // Enable Next.js Draft Mode — this sets a cookie that bypasses ISR cache
    const draft = await draftMode();
    draft.enable();

    const redirectPath = data.type === 'blog'
        ? `/blog/${data.slug}`
        : `/work/${data.slug}`;

    return NextResponse.redirect(new URL(redirectPath, req.url));
}
