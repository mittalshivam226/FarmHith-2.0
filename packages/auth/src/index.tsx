'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser, Role } from '@farmhith/types';
import { auth, db } from '@farmhith/firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  /** Async — returns the Firebase ID token for use in Authorization headers */
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: Role;
}) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (decodedUser) => {
      setIsLoading(true);
      setFirebaseUser(decodedUser);
      
      if (!decodedUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Fetch extended user profile from Firestore
      try {
        const userDocRef = doc(db, 'users', decodedUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as AuthUser;
          
          // Enforce role boundaries immediately on client
          if (requiredRole && userData.role !== requiredRole) {
            if (typeof window !== 'undefined') alert(`ROLE MISMATCH! Required: ${requiredRole}, Found: ${userData.role}`);
            await signOut(auth);
            setUser(null);
          } else {
            setUser(userData);
          }
        } else {
          // User authenticated but no profile doc exists yet. (Registration phase)
          setUser(null); // Or set a partial user depending on architecture
        }
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        if (typeof window !== 'undefined') {
          alert("DATABASE ERROR FETCHING PROFILE: " + (error?.message || error));
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [requiredRole]);

  const logout = async () => {
    await signOut(auth);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const getToken = async (): Promise<string | null> => {
    if (!firebaseUser) return null;
    try {
      return await firebaseUser.getIdToken();
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAuthenticated: !!user,
        logout,
        updateUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
