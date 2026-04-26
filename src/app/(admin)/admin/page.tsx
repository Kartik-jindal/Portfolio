
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  FolderKanban, 
  FileText, 
  ArrowUpRight,
  Activity,
  Zap,
  Globe,
  ChevronRight,
  Settings,
  User
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Active Projects', value: '12', icon: FolderKanban, trend: '+2 this month', color: 'primary' },
  { label: 'Journal Posts', value: '48', icon: FileText, trend: '+5 this month', color: 'accent' },
  { label: 'Total Leads', value: '128', icon: Users, trend: '+12 today', color: 'primary' },
  { label: 'System Uptime', value: '99.9%', icon: Zap, trend: 'Optimal', color: 'primary' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Command Center</span>
        <h1 className="text-5xl font-headline font-black italic tracking-tighter">System Overview.</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl border-white/5 space-y-6 group hover:border-primary/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                <stat.icon className="w-6 h-6 text-white group-hover:text-black transition-colors" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{stat.trend}</span>
            </div>
            <div>
              <div className="text-4xl font-headline font-black text-white mb-1">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-black italic tracking-tight flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              Pulse Stream
            </h2>
            <Link href="/admin/leads" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors">
              View All Leads
            </Link>
          </div>
          
          <div className="glass rounded-3xl border-white/5 overflow-hidden">
            <div className="p-2">
              {[1, 2, 3, 4, 5].map((item, i) => (
                <div 
                  key={item} 
                  className={`flex items-center justify-between p-6 hover:bg-white/5 transition-colors rounded-2xl ${i !== 4 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-bold text-white">System process heartbeat check</p>
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Live • Operational</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-headline font-black italic tracking-tight flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            Launch Pad
          </h2>
          
          <div className="space-y-4">
            {[
              { label: 'Update About Story', href: '/admin/about', icon: User },
              { label: 'Deploy New Project', href: '/admin/projects/new', icon: FolderKanban },
              { label: 'Draft Journal Entry', href: '/admin/blog/new', icon: FileText },
              { label: 'System Configuration', href: '/admin/settings', icon: Settings },
            ].map((link) => (
              <Link key={link.label} href={link.href}>
                <div className="glass p-6 rounded-2xl border-white/5 flex items-center justify-between hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <link.icon className="w-5 h-5 text-white/40 group-hover:text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-6 mt-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Security Notice</h3>
            <p className="text-xs text-primary/60 leading-relaxed font-bold italic">
              All administrative sessions are logged and cryptographically signed. Unauthorized access attempts will trigger local lockout protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
