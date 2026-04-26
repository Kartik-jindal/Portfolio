'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'GUEST' | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

// The designated owner email for automatic bootstrapping
const OWNER_EMAIL = 'kartikjindal2003@gmail.com';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'GUEST' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          // Fetch role from Firestore
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            // Self-promotion bootstrap for the designated owner
            const initialRole = user.email === OWNER_EMAIL ? 'SUPER_ADMIN' : 'GUEST';
            
            await setDoc(userRef, {
              email: user.email,
              role: initialRole,
              displayName: user.displayName || 'Admin',
              photoURL: user.photoURL || '',
              createdAt: serverTimestamp()
            });
            
            setRole(initialRole);
          }
        } catch (error) {
          console.error("Auth Context Error:", error);
          setRole('GUEST');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
