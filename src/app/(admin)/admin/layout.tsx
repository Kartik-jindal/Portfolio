'use client';

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Briefcase,
  Quote,
  User,
  Zap,
  Layers,
  Mail,
  Globe,
  Scale,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  useEffect(() => {
    if (!loading && (!user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN'))) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [user, role, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-primary font-black text-base tracking-[1em] uppercase"
        >
          AUTHENTICATING...
        </motion.div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return null; // Router handles redirect
  }

  // navItems sorted by homepage placement: Hero -> About -> Projects -> Experience -> Testimonials -> Contact
  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Hero Section', href: '/admin/hero', icon: Zap },
    { label: 'About Story', href: '/admin/about', icon: User },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Voices', href: '/admin/testimonials', icon: Quote },
    { label: 'Contact Module', href: '/admin/contact', icon: Mail },
    { label: 'Journal', href: '/admin/blog', icon: FileText },
    { label: 'Layout Config', href: '/admin/interface', icon: Layers },
    { label: 'SEO Command', href: '/admin/seo', icon: Globe },
    { label: 'Legal Pages', href: '/admin/legal', icon: Scale },
    { label: 'Leads', href: '/admin/leads', icon: Users },
    { label: 'Audit Log', href: '/admin/audit', icon: Activity },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Admin Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 300 : 90 }}
        className="bg-[#0a0a0a] border-r border-white/5 flex flex-col relative z-50"
      >
        <div className="p-8 flex items-center justify-between">
          <Link href="/admin">
            <div className={`font-headline font-black italic text-4xl tracking-tighter transition-opacity ${!isSidebarOpen && 'opacity-0'}`}>
              Admin<span className="text-primary">.</span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-primary"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.label} href={item.href}>
                <div className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative
                  ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'}
                `}>
                  <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                  {isSidebarOpen && (
                    <span className="text-base font-black uppercase tracking-widest">{item.label}</span>
                  )}
                  {isActive && isSidebarOpen && (
                    <motion.div layoutId="activeNav" className="absolute right-4">
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={async () => {
              await signOut();
              router.push('/');
            }}
            className="w-full flex items-center gap-4 px-4 py-4 text-white/40 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all border border-transparent"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="text-base font-black uppercase tracking-widest">Terminate Session</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03] z-0" />

        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-black uppercase tracking-[0.4em] text-white/20">System Status:</span>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[14px] font-black uppercase tracking-widest text-primary">Live_Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-base font-bold text-white">{user?.email}</span>
              <span className="text-[13px] uppercase font-black tracking-widest text-white/30">{role}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-lg font-black text-primary">{user?.email?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster />
    </AuthProvider>
  );
}
