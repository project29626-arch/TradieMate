import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  businessProfile: any | null;
  loading: boolean;
  refreshBusinessProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  businessProfile: null,
  loading: true,
  refreshBusinessProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [businessProfile, setBusinessProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBusinessProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid, 'profile', 'business');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusinessProfile(docSnap.data());
      } else {
        setBusinessProfile(null);
      }
    } catch (err) {
      console.error("Error fetching business profile in context:", err);
    }
  };

  const refreshBusinessProfile = async () => {
    if (auth.currentUser) {
      await fetchBusinessProfile(auth.currentUser.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchBusinessProfile(currentUser.uid);
      } else {
        setBusinessProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, businessProfile, loading, refreshBusinessProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
