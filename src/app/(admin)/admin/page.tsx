'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FolderKanban, 
  FileText, 
  ArrowUpRight,
  Activity,
  Zap,
  ChevronRight,
  Settings,
  User,
  ShieldAlert,
  Clock,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock chart data for visual aesthetic
const chartData = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    projects: 0,
    blog: 0,
    leads: 0,
    newLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetchStats();
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const projectsSnap = await getDocs(collection(db, 'projects'));
      const blogSnap = await getDocs(collection(db, 'blog'));
      const leadsSnap = await getDocs(collection(db, 'contact_leads'));
      const newLeadsSnap = await getDocs(query(collection(db, 'contact_leads'), where('status', '==', 'new')));

      setCounts({
        projects: projectsSnap.size,
        blog: blogSnap.size,
        leads: leadsSnap.size,
        newLeads: newLeadsSnap.size
      });
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Active Projects', value: counts.projects, icon: FolderKanban, trend: 'Archived builds', color: 'primary' },
    { label: 'Journal Posts', value: counts.blog, icon: FileText, trend: 'Published thoughts', color: 'accent' },
    { label: 'Total Leads', value: counts.leads, icon: Users, trend: counts.newLeads > 0 ? `${counts.newLeads} new transmissions` : 'No new messages', color: 'primary' },
    { label: 'System Health', value: '99.9%', icon: Zap, trend: 'Latency: 14ms', color: 'primary' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Cinematic Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <span className="text-primary font-black uppercase tracking-[0.6em] text-[14px]">Administrative Hub</span>
             <div className="h-px w-16 bg-primary/20" />
             <span className="text-white/20 font-mono text-[13px] uppercase tracking-widest">{time.toLocaleTimeString()}</span>
          </div>
          <h1 className="text-7xl font-headline font-black italic tracking-tighter text-white">Central Command<span className="text-primary">.</span></h1>
        </div>
        
        <div className="flex gap-6">
           <div className="glass px-8 py-4 rounded-2xl border-white/5 flex items-center gap-5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <div className="flex flex-col">
                 <span className="text-[12px] font-black uppercase tracking-widest text-white/30 leading-none mb-1.5">Infrastructure</span>
                 <span className="text-[14px] font-black text-white uppercase tracking-widest leading-none italic">S3_Firestore_Live</span>
              </div>
           </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Analytics Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass rounded-[3rem] border-white/5 p-12 overflow-hidden relative group"
        >
          <div className="flex items-center justify-between mb-12">
             <div className="space-y-2">
                <h3 className="text-3xl font-headline font-bold italic text-white flex items-center gap-4">
                  <Activity className="w-8 h-8 text-primary" />
                  System Throughput
                </h3>
                <p className="text-[14px] text-white/30 uppercase font-black tracking-widest">Real-time activity visualization</p>
             </div>
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[14px] font-black uppercase tracking-widest text-primary">Live_Feed</span>
             </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(161, 94%, 45%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(161, 94%, 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', fontSize: '13px', textTransform: 'uppercase' }}
                  itemStyle={{ color: '#10B981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Launch Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 glass rounded-[3rem] border-white/5 p-12 flex flex-col justify-between"
        >
          <div className="space-y-8">
            <h3 className="text-3xl font-headline font-bold italic text-white flex items-center gap-4">
              <Zap className="w-8 h-8 text-primary" />
              Launch Pad
            </h3>
            <div className="grid gap-5">
              {[
                { label: 'Deploy Project', href: '/admin/projects/new', icon: FolderKanban },
                { label: 'Write Journal', href: '/admin/blog/new', icon: FileText },
                { label: 'Site Settings', href: '/admin/settings', icon: Settings },
              ].map((link) => (
                <Link key={link.label} href={link.href}>
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                    <div className="flex items-center gap-5">
                      <link.icon className="w-6 h-6 text-white/30 group-hover:text-primary transition-colors" />
                      <span className="text-[14px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">{link.label}</span>
                    </div>
                    <ArrowUpRight className="w-6 h-6 text-white/10 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 mt-10">
             <div className="flex items-center gap-5 text-primary/40">
                <ShieldAlert className="w-6 h-6" />
                <span className="text-[13px] font-black uppercase tracking-[0.3em]">Encrypted_Session_Active</span>
             </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + (i * 0.05) }}
            className="lg:col-span-3 glass p-10 rounded-[2.5rem] border-white/5 space-y-5 hover:border-primary/20 transition-all cursor-default"
          >
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <span className={`text-[12px] font-black uppercase tracking-widest ${stat.label === 'Total Leads' && counts.newLeads > 0 ? 'text-primary' : 'text-white/20'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <div className="text-6xl font-headline font-black text-white mb-2 leading-none">{stat.value}</div>
              <div className="text-[14px] font-black uppercase tracking-[0.4em] text-white/30">{stat.label}</div>
            </div>
          </motion.div>
        ))}

        {/* Recent Activity Log */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-12 glass rounded-[3rem] border-white/5 p-12 space-y-10"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-headline font-bold italic text-white flex items-center gap-4">
              <Activity className="w-8 h-8 text-primary" />
              Pulse Stream
            </h3>
            <Link href="/admin/leads" className="text-[14px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors">
              Access Full Logs
            </Link>
          </div>

          <div className="grid gap-4">
            {[1, 2, 3].map((item, i) => (
              <div 
                key={item} 
                className="flex items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-10">
                  <div className="flex flex-col items-center">
                     <span className="text-[12px] font-black text-white/20 uppercase tracking-widest">Mark</span>
                     <div className={`w-2.5 h-2.5 rounded-full mt-2.5 ${i === 0 ? 'bg-primary shadow-[0_0_12px_#10B981]' : 'bg-white/10'}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white uppercase tracking-widest">
                      {i === 0 ? 'Project Architecture Transmission' : 'System Database Heartbeat Synchronized'}
                    </p>
                    <div className="flex items-center gap-6 mt-3">
                       <span className="text-[13px] text-white/20 uppercase font-black tracking-widest">Status: Operational</span>
                       <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                       <span className="text-[13px] text-primary/40 font-mono">CODE_0{i}_SUCCESS</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <Clock className="w-5 h-5 text-white/10" />
                   <span className="text-[13px] font-mono text-white/20 uppercase">0{i}:12:00</span>
                   <ChevronRight className="w-6 h-6 text-white/10" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto pt-12">
         <p className="text-center text-[13px] uppercase tracking-[0.8em] text-white/10 font-black">
           Architectural_Management_Protocol_Verified // Session_ID: {Math.random().toString(36).substring(7).toUpperCase()}
         </p>
      </div>
    </div>
  );
}
