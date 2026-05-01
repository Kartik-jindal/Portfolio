'use server';

/**
 * Audit Log — server action for recording admin operations.
 *
 * Writes to the `audit_log` Firestore collection.
 * Called from admin save/delete/status-change handlers.
 * Never throws — audit failures are logged to console but never block the main operation.
 */

import { db } from '@/lib/firebase/firestore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type AuditAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'PUBLISH'
    | 'DRAFT'
    | 'STATUS_CHANGE'
    | 'BULK_DELETE'
    | 'BULK_PUBLISH'
    | 'BULK_DRAFT'
    | 'LOGIN'
    | 'LOGOUT';

export type AuditEntity =
    | 'blog'
    | 'project'
    | 'experience'
    | 'testimonial'
    | 'lead'
    | 'settings'
    | 'seo'
    | 'hero'
    | 'about'
    | 'contact'
    | 'interface'
    | 'legal'
    | 'auth';

export interface AuditEntry {
    action: AuditAction;
    entity: AuditEntity;
    entityId?: string;
    entityTitle?: string;
    actorEmail?: string;
    actorRole?: string;
    detail?: string;
    timestamp: ReturnType<typeof serverTimestamp>;
}

/**
 * Write an audit log entry to Firestore.
 * Safe to call fire-and-forget — never throws.
 */
export async function writeAuditLog(
    action: AuditAction,
    entity: AuditEntity,
    options: {
        entityId?: string;
        entityTitle?: string;
        actorEmail?: string;
        actorRole?: string;
        detail?: string;
    } = {},
): Promise<void> {
    try {
        await addDoc(collection(db, 'audit_log'), {
            action,
            entity,
            entityId: options.entityId || null,
            entityTitle: options.entityTitle || null,
            actorEmail: options.actorEmail || null,
            actorRole: options.actorRole || null,
            detail: options.detail || null,
            timestamp: serverTimestamp(),
        });
    } catch (err) {
        // Audit log failures must never block the main operation
        console.error('[audit_log] Failed to write entry:', err);
    }
}
