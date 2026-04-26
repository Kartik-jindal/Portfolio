'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, CheckCircle2, Circle, Inbox, Clock, User, Shield, Globe, Terminal, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, 'contact_leads'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(data);
    } catch (error) {
      console.error("Leads Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (lead: any) => {
    const nextStatus = lead.status === 'read' ? 'new' : 'read';
    try {
      await updateDoc(doc(db, 'contact_leads', lead.id), { status: nextStatus });
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: nextStatus } : l));
      toast({ title: 'Status Updated', description: `Payload marked as ${nextStatus}` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently archive this mission lead?')) return;
    try {
      await deleteDoc(doc(db, 'contact_leads', id));
      setLeads(prev => prev.filter(l => l.id !== id));
      toast({ title: 'Lead Purged', description: 'Entry removed from database' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Action Denied', description: error.message });
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[12px]">Transmission Inbox</span>
          <h1 className="text-6xl font-headline font-black italic tracking-tighter text-white leading-none">Payload Logs.</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="px-8 py-4 rounded-2xl glass border-white/5 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Inbox className="w-6 h-6 text-primary" />
             </div>
             <div>
                <div className="text-3xl font-headline font-bold text-white leading-none">{leads.length}</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Active Messages</span>
             </div>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
        ) : leads.length === 0 ? (
          <div className="glass p-32 rounded-[3rem] border-white/5 text-center space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
              <Shield className="w-10 h-10 text-white/20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-headline font-bold text-white/60 italic">Inbox Zero.</h3>
              <p className="text-white/20 uppercase font-black tracking-[0.4em] text-[11px]">The channel is currently silent</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {leads.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass p-10 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden ${lead.status === 'new' ? 'ring-1 ring-primary/30' : ''}`}
              >
                {lead.status === 'new' && (
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Terminal className="w-32 h-32 text-primary" />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                  <div className="lg:w-1/3 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {lead.status === 'new' ? (
                          <Badge className="bg-primary text-black font-black uppercase tracking-[0.2em] text-[10px] px-3 py-1.5 rounded-md animate-pulse">New_Payload</Badge>
                        ) : (
                          <Badge variant="outline" className="border-white/10 text-white/30 font-black uppercase tracking-[0.2em] text-[10px] px-3 py-1.5 rounded-md">Logged</Badge>
                        )}
                        <span className="text-[12px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {lead.createdAt?.toDate ? new Date(lead.createdAt.toDate()).toLocaleString() : 'Just Now'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-4xl font-bold text-white leading-tight group-hover:text-primary transition-colors">{lead.name}</h3>
                        <p className="text-primary text-sm font-black font-mono tracking-tight">{lead.email}</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block border-b border-white/5 pb-3">Client Metadata</span>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <span className="text-[9px] font-bold text-white/20 uppercase block">Platform</span>
                             <div className="text-[12px] font-black text-white/60 truncate">{lead.metadata?.platform || 'Unknown'}</div>
                          </div>
                          <div className="space-y-1">
                             <span className="text-[9px] font-bold text-white/20 uppercase block">User Agent</span>
                             <div className="text-[12px] font-black text-white/60 truncate" title={lead.metadata?.userAgent}>Agent_Client</div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-xl border-white/5 bg-white/5 hover:bg-primary hover:text-black text-[12px] font-black uppercase tracking-widest h-12 transition-all"
                        onClick={() => toggleStatus(lead)}
                      >
                        {lead.status === 'read' ? <Circle className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Mark {lead.status === 'read' ? 'Unread' : 'Read'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-12 h-12 rounded-xl hover:bg-destructive/10 text-white/40 hover:text-destructive transition-all"
                        onClick={() => handleDelete(lead.id)}
                      >
                        <Trash2 className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>

                  <div className="lg:w-2/3">
                    <div className="h-full p-10 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Globe className="w-5 h-5 text-primary/40" />
                           <h4 className="text-2xl font-headline font-bold text-white italic">{lead.subject || 'Mission Inquiry'}</h4>
                        </div>
                        <ChevronRight className="w-6 h-6 text-white/10" />
                      </div>
                      <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent" />
                      <p className="text-lg text-white/60 leading-relaxed font-light italic whitespace-pre-wrap">
                        "{lead.message}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}