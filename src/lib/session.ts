/**
 * Session encoding/decoding utilities.
 * Shared between the session route handler and middleware.
 * Kept separate from the route file so Next.js doesn't treat them as HTTP handlers.
 */

const SESSION_SECRET = process.env.SESSION_SECRET!;

async function importKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        usage,
    );
}

async function signPayload(payload: string, secret: string): Promise<string> {
    const key = await importKey(secret, ['sign']);
    const enc = new TextEncoder();
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
    return Buffer.from(sig).toString('base64url');
}

async function verifySignature(payload: string, sig: string, secret: string): Promise<boolean> {
    const key = await importKey(secret, ['verify']);
    const enc = new TextEncoder();
    const sigBuf = Buffer.from(sig, 'base64url');
    return crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(payload));
}

/** Encode session data into a signed cookie value. */
export async function encodeSession(data: { uid: string; role: string; email: string }): Promise<string> {
    const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
    const sig = await signPayload(payload, SESSION_SECRET);
    return `${payload}.${sig}`;
}

/** Decode and verify a session cookie value. Returns null if invalid or tampered. */
export async function decodeSession(cookie: string): Promise<{ uid: string; role: string; email: string } | null> {
    try {
        const [payload, sig] = cookie.split('.');
        if (!payload || !sig) return null;
        const valid = await verifySignature(payload, sig, SESSION_SECRET);
        if (!valid) return null;
        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    } catch {
        return null;
    }
}
