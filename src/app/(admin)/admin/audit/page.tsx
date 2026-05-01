'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RefreshCcw, ChevronRight, ChevronLeft, Shield, Trash2, Edit2, Plus, Eye, EyeOff, LogIn, LogOut, Settings, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { AuditAction, AuditEntity } from '@/lib/audit-log';

const PAGE_SIZE = 25;

interface AuditEntry {
    id: string;
    action: AuditAction;
    entity: AuditEntity;
    entityId?: string | null;
    entityTitle?: string | null;
    actorEmail?: string | null;
    actorRole?: string | null;
    detail?: string | null;
    timestamp?: { seconds: number; nanoseconds: number } | null;
}

// ── Action badge colours ──────────────────────────────────────────────────────
const ACTION_STYLES: Record<string, string> = {
    CREATE: 'bg-primary/10 text-primary border-primary/20',
    UPDATE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    DELETE: 'bg-destructive/10 text-red-400 border-destructive/20',
    PUBLISH: 'bg-green-500/10 text-green-400 border-green-500/20',
    DRAFT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    STATUS_CHANGE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    BULK_DELETE: 'bg-destructive/10 text-red-400 border-destructive/20',
    BULK_PUBLISH: 'bg-green-500/10 text-green-400 border-green-500/20',
    BULK_DRAFT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    LOGIN: 'bg-primary/10 text-primary border-primary/20',
    LOGOUT: 'bg-white/5 text-white/40 border-white/10',
};

// ── Action icons ──────────────────────────────────────────────────────────────
function ActionIcon({ action }: { action: AuditAction }) {
    const cls = 'w-3.5 h-3.5';
    switch (action) {
        case 'CREATE': return <Plus className={cls} />;
        case 'UPDATE': return <Edit2 className={cls} />;
        case 'DELETE':
        case 'BULK_DELETE': return <Trash2 className={cls} />;
        case 'PUBLISH':
        case 'BULK_PUBLISH': return <Eye className={cls} />;
        case 'DRAFT':
        case 'BULK_DRAFT': return <EyeOff className={cls} />;
        case 'STATUS_CHANGE': return <Layers className={cls} />;
        case 'LOGIN': return <LogIn className={cls} />;
        case 'LOGOUT': return <LogOut className={cls} />;
        default: return <Settings className={cls} />;
    }
}

function formatTimestamp(ts: { seconds: number } | null | undefined): string {
    if (!ts) return '—';
    return new Date(ts.seconds * 1000).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}

export default function AuditLogPage() {
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cursors, setCursors] = useState<QueryDocumentSnapshot[]>([]); // page cursor stack
    const [hasMore, setHasMore] = useState(false);
    const { toast } = useToast();

    const fetchPage = async (afterCursor?: QueryDocumentSnapshot) => {
        try {
            const q = afterCursor
                ? query(collection(db, 'audit_log'), orderBy('timestamp', 'desc'), startAfter(afterCursor), limit(PAGE_SIZE + 1))
                : query(collection(db, 'audit_log'), orderBy('timestamp', 'desc'), limit(PAGE_SIZE + 1));

            const snap = await getDocs(q);
            const docs = snap.docs.slice(0, PAGE_SIZE);
            setHasMore(snap.docs.length > PAGE_SIZE);
            return docs;
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Failed to load audit log', description: 'Check Firestore permissions.' });
            return [];
        }
    };

    const load = async () => {
        setLoading(true);
        const docs = await fetchPage();
        setEntries(docs.map(d => ({ id: d.id, ...d.data() } as AuditEntry)));
        setCursors([]);
        setLoading(false);
    };

    const refresh = async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
        toast({ title: 'Refreshed', description: 'Audit log updated.' });
    };

    const nextPage = async () => {
        if (entries.length === 0) return;
        const lastDoc = await (async () => {
            const q = query(collection(db, 'audit_log'), orderBy('timestamp', 'desc'), limit(PAGE_SIZE * (cursors.length + 1) + 1));
            const snap = await getDocs(q);
            return snap.docs[snap.docs.length - 2] ?? snap.docs[snap.docs.length - 1];
        })();
        const docs = await fetchPage(lastDoc);
        if (docs.length > 0) {
            setCursors(prev => [...prev, lastDoc]);
            setEntries(docs.map(d => ({ id: d.id, ...d.data() } as AuditEntry)));
        }
    };

    const prevPage = async () => {
        const newCursors = cursors.slice(0, -1);
        const afterCursor = newCursors[newCursors.length - 1];
        const docs = await fetchPage(afterCursor);
        setCursors(newCursors);
        setEntries(docs.map(d => ({ id: d.id, ...d.data() } as AuditEntry)));
        setHasMore(true);
    };

    useEffect(() => { load(); }, []);

    const currentPage = cursors.length + 1;

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">System Intelligence</span>
                    <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Audit Log.</h1>
                    <p className="text-white/30 text-sm font-body">Every admin action recorded in chronological order.</p>
                </div>
                <Button
                    onClick={refresh}
                    disabled={refreshing}
                    variant="outline"
                    className="h-14 rounded-2xl border-white/10 text-white/60 font-black uppercase tracking-widest px-8 group hover:border-primary/40 hover:text-primary transition-all"
                >
                    {refreshing ? 'Refreshing...' : 'Refresh'} <RefreshCcw className={`w-4 h-4 ml-2 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                </Button>
            </header>

            {/* Stats bar */}
            <div className="flex items-center gap-6 p-6 glass rounded-2xl border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                        <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Page</div>
                        <div className="text-lg font-headline font-black text-white">{currentPage}</div>
                    </div>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                        <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Showing</div>
                        <div className="text-lg font-headline font-black text-white">{entries.length} entries</div>
                    </div>
                </div>
                <div className="ml-auto text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                    Firestore · audit_log
                </div>
            </div>

            {/* Log table */}
            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                </div>
            ) : entries.length === 0 ? (
                <div className="glass p-20 rounded-[2.5rem] border-white/5 text-center space-y-4">
                    <Activity className="w-12 h-12 text-white/10 mx-auto" />
                    <p className="text-white/30 uppercase font-black tracking-widest text-sm">No audit entries yet.</p>
                    <p className="text-white/20 text-xs font-body">Entries appear here as admin actions are performed.</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                    >
                        {entries.map((entry, i) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="glass p-6 rounded-2xl border-white/5 hover:border-white/10 transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Action badge */}
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest shrink-0 ${ACTION_STYLES[entry.action] || 'bg-white/5 text-white/40 border-white/10'}`}>
                                        <ActionIcon action={entry.action} />
                                        {entry.action.replace('_', ' ')}
                                    </div>

                                    {/* Entity + title */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{entry.entity}</span>
                                            {entry.entityTitle && (
                                                <>
                                                    <span className="text-white/10">·</span>
                                                    <span className="text-sm font-bold text-white truncate max-w-xs">{entry.entityTitle}</span>
                                                </>
                                            )}
                                            {entry.entityId && (
                                                <span className="text-[9px] font-mono text-white/20 truncate">#{entry.entityId.slice(0, 8)}</span>
                                            )}
                                        </div>
                                        {entry.detail && (
                                            <p className="text-xs text-white/30 mt-1 font-body">{entry.detail}</p>
                                        )}
                                    </div>

                                    {/* Actor + timestamp */}
                                    <div className="flex flex-col items-end gap-1 shrink-0 text-right">
                                        {entry.actorEmail && (
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{entry.actorEmail}</span>
                                        )}
                                        {entry.actorRole && (
                                            <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">{entry.actorRole}</span>
                                        )}
                                        <span className="text-[9px] font-mono text-white/20">{formatTimestamp(entry.timestamp)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Pagination */}
            {(currentPage > 1 || hasMore) && (
                <div className="flex items-center justify-center gap-4 pt-4">
                    <Button
                        variant="outline"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="h-11 rounded-xl border-white/10 text-white/40 hover:text-primary hover:border-primary/40 transition-all disabled:opacity-20"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                        Page {currentPage}
                    </span>
                    <Button
                        variant="outline"
                        onClick={nextPage}
                        disabled={!hasMore}
                        className="h-11 rounded-xl border-white/10 text-white/40 hover:text-primary hover:border-primary/40 transition-all disabled:opacity-20"
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}
