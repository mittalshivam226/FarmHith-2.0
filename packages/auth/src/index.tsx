'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser, Role } from '@farmhith/types';

// ─── MOCK USERS ──────────────────────────────────────────────────────────────

export const MOCK_USERS: Record<Role, AuthUser> = {
  FARMER: {
    id: 'farmer-001',
    email: 'ramesh@farmhith.in',
    phone: '+91 98765 43210',
    role: 'FARMER',
    name: 'Ramesh Kumar',
    isVerified: true,
    profile: {
      id: 'fp-001',
      userId: 'farmer-001',
      fullName: 'Ramesh Kumar',
      state: 'Punjab',
      district: 'Ludhiana',
      totalLandAcres: 12.5,
      primaryCrop: 'Wheat',
      aadhaarNumber: '****-****-4521',
    },
  },
  LAB: {
    id: 'lab-001',
    email: 'info@agrosciencelab.in',
    phone: '+91 99887 65432',
    role: 'LAB',
    name: 'AgroScience Soil Lab',
    isVerified: true,
    profile: {
      id: 'lp-001',
      userId: 'lab-001',
      labName: 'AgroScience Soil Lab',
      address: 'Plot 45, Industrial Area, Ludhiana',
      state: 'Punjab',
      perTestPrice: 1200,
      isVerified: true,
      dailyCapacity: 15,
    },
  },
  BIOPELLET: {
    id: 'plant-001',
    email: 'ops@greenenergyplant.in',
    phone: '+91 88776 54321',
    role: 'BIOPELLET',
    name: 'Green Energy Bio-Pellet Plant',
    isVerified: true,
    profile: {
      id: 'bp-001',
      userId: 'plant-001',
      plantName: 'Green Energy Bio-Pellet Plant',
      state: 'Haryana',
      acceptedResidueTypes: ['Paddy Straw', 'Wheat Straw', 'Sugarcane Bagasse'],
      procurementRatePerTon: 2800,
    },
  },
  SOILMITRA: {
    id: 'mitra-001',
    email: 'dr.singh@farmhith.in',
    phone: '+91 77665 43219',
    role: 'SOILMITRA',
    name: 'Dr. Gurpreet Singh',
    isVerified: true,
    profile: {
      id: 'smp-001',
      userId: 'mitra-001',
      fullName: 'Dr. Gurpreet Singh',
      specialisation: ['Soil Fertility', 'Crop Nutrition', 'Organic Farming'],
      languagesSpoken: ['Hindi', 'Punjabi', 'English'],
      sessionFee: 600,
      rating: 4.8,
      totalSessions: 142,
      bio: 'PhD in Agronomy from PAU Ludhiana with 12 years of field experience across Punjab and Haryana.',
      isVerified: true,
    },
  },
  ADMIN: {
    id: 'admin-001',
    email: 'admin@farmhith.in',
    phone: '+91 99999 00001',
    role: 'ADMIN',
    name: 'Farmhith Admin',
    isVerified: true,
  },
};

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'farmhith_mock_session';

function saveSession(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

function loadSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (role: Role, credentials?: { email?: string; password?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── PROVIDER ────────────────────────────────────────────────────────────────

export function AuthProvider({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: Role;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (session) {
      // If this portal requires a specific role, enforce it
      if (requiredRole && session.role !== requiredRole) {
        clearSession();
        setUser(null);
      } else {
        setUser(session);
      }
    }
    setIsLoading(false);
  }, [requiredRole]);

  const login = useCallback(
    async (_role: Role, _credentials?: { email?: string; password?: string }) => {
      // In mock mode, we use the role to pick a mock user
      // When real API is ready, replace this with an actual fetch
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      const mockUser = MOCK_USERS[_role];
      saveSession(mockUser);
      setUser(mockUser);
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      saveSession(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
