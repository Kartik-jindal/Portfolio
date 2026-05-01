/**
 * Session Route Handler
 *
 * POST  /api/admin/session
 *   - Receives a Firebase ID token from the client
 *   - Verifies it against Firebase's public key endpoint (no firebase-admin needed)
 *   - On success, sets an HttpOnly session cookie containing the verified UID + role
 *
 * DELETE /api/admin/session
 *   - Clears the session cookie (sign-out)
 *
 * NOTE: encodeSession / decodeSession live in src/lib/session.ts so they are
 * not treated as HTTP route handlers by Next.js.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encodeSession } from '@/lib/session';

const COOKIE_NAME = '__admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ---------------------------------------------------------------------------
// Firebase ID token verification via REST (no firebase-admin)
// ---------------------------------------------------------------------------

async function verifyFirebaseIdToken(idToken: string): Promise<{ uid: string; email: string } | null> {
    try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        const user = data.users?.[0];
        if (!user?.localId) return null;
        return { uid: user.localId, email: user.email ?? '' };
    } catch {
        return null;
    }
}

// ---------------------------------------------------------------------------
// POST — create session
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
    try {
        const { idToken, role } = await req.json();

        if (!idToken || !role) {
            return NextResponse.json({ error: 'Missing idToken or role' }, { status: 400 });
        }

        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Insufficient privileges' }, { status: 403 });
        }

        const verified = await verifyFirebaseIdToken(idToken);
        if (!verified) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const sessionValue = await encodeSession({ uid: verified.uid, role, email: verified.email });

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, sessionValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[session POST]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// ---------------------------------------------------------------------------
// DELETE — destroy session (sign-out)
// ---------------------------------------------------------------------------

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    return NextResponse.json({ ok: true });
}
