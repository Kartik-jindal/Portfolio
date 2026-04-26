'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Mail, Trash2, CheckCircle2, Circle, Inbox, Clock } from 'lucide-react';
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (lead: any) => {
    const nextStatus = lead.status === 'read' ? 'new' : 'read';
    try {
      await updateDoc(doc(db, 'contact_leads', lead.id), { status: nextStatus });
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: nextStatus } : l));
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this lead permanently?')) return;
    try {
      await deleteDoc(doc(db, 'contact_leads', id));
      setLeads(prev => prev.filter(l => l.id !== id));
      toast({ title: 'Success', description: 'Lead archived' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Communication Stream</span>
          <h1 className="text-5xl font-headline font-black italic tracking-tighter text-white">Contact Leads.</h1>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl glass border-white/5">
          <Inbox className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">{leads.length} Total Messages</span>
        </div>
      </header>

      <div className="space-y-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="glass p-20 rounded-[2.5rem] border-white/5 text-center space-y-4">
            <Mail className="w-12 h-12 text-white/10 mx-auto" />
            <p className="text-white/40 uppercase font-black tracking-widest">Inbox Zero. Well done.</p>
          </div>
        ) : (
          leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`glass p-8 rounded-[2rem] border-white/5 hover:border-primary/20 transition-all relative overflow-hidden ${lead.status === 'new' ? 'ring-1 ring-primary/20' : ''}`}
            >
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/3 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-4">
                      {lead.status === 'new' ? (
                        <Badge className="bg-primary text-black font-black uppercase tracking-widest text-[8px] h-5">New</Badge>
                      ) : (
                        <Badge variant="outline" className="border-white/10 text-white/30 font-black uppercase tracking-widest text-[8px] h-5">Read</Badge>
                      )}
                      <span className="text-[9px] uppercase font-black tracking-widest text-white/20 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {lead.createdAt?.toDate ? new Date(lead.createdAt.toDate()).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">{lead.name}</h3>
                    <p className="text-primary text-xs font-bold font-mono tracking-tighter">{lead.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-10 px-4"
                      onClick={() => toggleStatus(lead)}
                    >
                      {lead.status === 'read' ? <Circle className="w-3 h-3 mr-2" /> : <CheckCircle2 className="w-3 h-3 mr-2" />}
                      Mark {lead.status === 'read' ? 'Unread' : 'Read'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-10 h-10 rounded-xl hover:bg-destructive/10 text-white/40 hover:text-destructive"
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="md:w-2/3 space-y-4">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-full">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3 block">Message Payload:</span>
                    <h4 className="text-sm font-bold text-white mb-4 underline underline-offset-8 decoration-primary/30">{lead.subject || 'Inquiry'}</h4>
                    <p className="text-sm text-white/60 leading-relaxed font-light italic">
                      "{lead.message}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}