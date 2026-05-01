/**
 * Next.js Middleware — Server-side admin route protection
 *
 * Runs on the Edge before any page is rendered.
 * All /admin/* routes except /admin/login require a valid session cookie.
 * If the cookie is absent or tampered, the request is redirected to /admin/login
 * before a single byte of admin content is served.
 */

import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = '__admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET!;

// ---------------------------------------------------------------------------
// Inline HMAC verify — must be self-contained here because middleware runs
// on the Edge runtime and cannot import from route handlers.
// ---------------------------------------------------------------------------

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

async function isValidSession(cookieValue: string): Promise<boolean> {
    try {
        const [payload, sig] = cookieValue.split('.');
        if (!payload || !sig) return false;

        const key = await importKey(SESSION_SECRET);
        const enc = new TextEncoder();
        const sigBuf = Buffer.from(sig, 'base64url');
        return crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(payload));
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Middleware function
// ---------------------------------------------------------------------------

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Let the login page and the session API through unconditionally
    if (
        pathname === '/admin/login' ||
        pathname.startsWith('/api/admin/session')
    ) {
        return NextResponse.next();
    }

    const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/admin/login';
        return NextResponse.redirect(loginUrl);
    }

    const valid = await isValidSession(sessionCookie);
    if (!valid) {
        // Cookie exists but is tampered/expired — clear it and redirect
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/admin/login';
        const res = NextResponse.redirect(loginUrl);
        res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
        return res;
    }

    return NextResponse.next();
}

export const config = {
    // Match all /admin/* routes and the session API
    matcher: ['/admin/:path*', '/api/admin/session/:path*'],
};
