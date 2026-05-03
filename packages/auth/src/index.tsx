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

      try {
        // 1. Fetch /users/{uid} for role
        const userDocRef = doc(db, 'users', decodedUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // Registration phase — user doc not yet written
          setUser(null);
          setIsLoading(false);
          return;
        }

        const firestoreData = userDocSnap.data();
        const role = firestoreData.role as Role;

        // Enforce role boundaries immediately on client
        if (requiredRole && role !== requiredRole) {
          await signOut(auth);
          setUser(null);
          setIsLoading(false);
          return;
        }

        // 2. Fetch the role-specific profile for name + phone
        const profileCollectionMap: Record<string, string> = {
          FARMER:    'farmerProfiles',
          LAB:       'labProfiles',
          BIOPELLET: 'biopelletProfiles',
          SOILMITRA: 'soilmitraProfiles',
          ADMIN:     'adminProfiles',
        };
        const profileCollection = profileCollectionMap[role];
        let name = decodedUser.email ?? 'User';
        let phone = '';

        if (profileCollection) {
          try {
            const profileSnap = await getDoc(doc(db, profileCollection, decodedUser.uid));
            if (profileSnap.exists()) {
              const pData = profileSnap.data();
              // Different profile collections use different name fields
              name = pData.fullName ?? pData.labName ?? pData.plantName ?? name;
              phone = pData.phone ?? '';
            }
          } catch {
            // Non-blocking — profile may not exist yet during registration
          }
        }

        // 3. Build AuthUser with explicit id = uid (Firestore doc stores 'uid', not 'id')
        const authUser: AuthUser = {
          id:            decodedUser.uid,
          email:         decodedUser.email ?? '',
          phone,
          role,
          name,
          preferredLang: firestoreData.preferredLang ?? 'en',
          createdAt:     firestoreData.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
          isVerified:    firestoreData.isVerified ?? true,
        };

        setUser(authUser);
      } catch (error: any) {
        console.error('[AuthProvider] Error fetching user profile:', error);
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
