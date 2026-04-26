
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase/config';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  User
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

// Designated owner email for automatic bootstrapping
const OWNER_EMAIL = 'kartikjindal2003@gmail.com';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const checkAdminAccess = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      return role === 'ADMIN' || role === 'SUPER_ADMIN';
    } 
    
    // If user record doesn't exist but it's the owner email, bootstrap it now
    if (user.email === OWNER_EMAIL) {
      try {
        await setDoc(userRef, {
          email: user.email,
          role: 'SUPER_ADMIN',
          displayName: user.displayName || 'Admin',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp()
        });
        return true;
      } catch (e) {
        console.error("Bootstrap failed:", e);
        return false;
      }
    }
    
    return false;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = await checkAdminAccess(userCredential.user);
      
      if (isAdmin) {
        toast({ title: 'Welcome Commander', description: 'Initializing administrative session...' });
        router.push('/admin');
      } else {
        await auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have administrative privileges.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const isAdmin = await checkAdminAccess(userCredential.user);
      
      if (isAdmin) {
        toast({ title: 'Identity Verified', description: 'Redirecting to command center...' });
        router.push('/admin');
      } else {
        await auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have administrative privileges.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-headline font-black italic tracking-tighter text-white">Central Command.</h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.4em] font-black">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">Identifier</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input 
                    type="email" 
                    placeholder="email@kartikjindal.com" 
                    className="bg-white/5 border-white/10 rounded-xl h-12 pl-12 text-white placeholder:text-white/20 focus:border-primary/50 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">Access Key</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-white/5 border-white/10 rounded-xl h-12 pl-12 text-white placeholder:text-white/20 focus:border-primary/50 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-xl bg-primary text-black font-black uppercase tracking-widest hover:bg-accent transition-all group"
              disabled={loading}
            >
              {loading ? "Verifying..." : (
                <span className="flex items-center gap-2">
                  Initialize Session <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-[#050505] px-4 text-white/20">or connect via</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full h-14 rounded-xl border-white/10 bg-white/5 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            disabled={loading}
          >
            Google Identity
          </Button>
        </div>
        
        <p className="text-center mt-12 text-[9px] uppercase tracking-[0.5em] text-white/20 font-black">
          Architectural_Management_System v1.0
        </p>
      </motion.div>
    </main>
  );
}
