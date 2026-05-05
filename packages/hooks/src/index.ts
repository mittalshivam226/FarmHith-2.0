'use client';

import { useState, useEffect } from 'react';
import { db } from '@farmhith/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  QueryConstraint,
} from 'firebase/firestore';
import type {
  SoilTestBooking,
  MitraBooking,
  SoilReport,
  CropListing,
  ProcurementOrder,
  LabProfile,
  SoilmitraProfile,
  User,
  Payment,
  Role,
} from '@farmhith/types';


// ─── Generic realtime hook ────────────────────────────────────────────────────

function useCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  enabled = true
): { data: T[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const constraintKey = constraints.map(c => JSON.stringify(c)).join('|');

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
        setLoading(false);
        setError(null);
      },
      (err) => {
        // If composite index is missing, Firestore returns a FAILED_PRECONDITION error.
        // Fall back to a query without orderBy so data still loads while the index builds.
        if (err.code === 'failed-precondition' || err.message?.includes('index')) {
          console.warn(`[useCollection:${collectionName}] Index missing — retrying without orderBy. Deploy firestore.indexes.json to fix.`, err.message);
          const fallbackConstraints = constraints.filter(c => {
            try { return !(JSON.stringify(c).includes('orderBy')); } catch { return true; }
          });
          const fallbackQ = query(collection(db, collectionName), ...fallbackConstraints);
          getDocs(fallbackQ).then(snap => {
            setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as T)));
            setLoading(false);
          }).catch(e2 => {
            console.error(`[useCollection:${collectionName}] Fallback also failed`, e2);
            setError(e2.message);
            setLoading(false);
          });
        } else {
          console.error(`[useCollection:${collectionName}]`, err);
          setError(err.message);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, enabled, constraintKey]);

  return { data, loading, error };
}

// ─── Soil Test Bookings ───────────────────────────────────────────────────────

/** Farmer: all my soil test bookings */
export function useMyBookings(farmerId: string | undefined) {
  return useCollection<SoilTestBooking>(
    'soilTestBookings',
    [where('farmerId', '==', farmerId ?? ''), orderBy('createdAt', 'desc')],
    !!farmerId
  );
}

/** Lab: incoming booking inbox */
export function useLabInbox(labId: string | undefined) {
  return useCollection<SoilTestBooking>(
    'soilTestBookings',
    [where('labId', '==', labId ?? ''), orderBy('createdAt', 'desc')],
    !!labId
  );
}

// ─── Mitra Sessions ───────────────────────────────────────────────────────────

/** Farmer: all my mitra bookings */
export function useMyMitraSessions(farmerId: string | undefined) {
  return useCollection<MitraBooking>(
    'mitraBookings',
    [where('farmerId', '==', farmerId ?? ''), orderBy('sessionDatetime', 'desc')],
    !!farmerId
  );
}

/** Soilmitra: full session schedule */
export function useMitraSchedule(mitraId: string | undefined) {
  return useCollection<MitraBooking>(
    'mitraBookings',
    [where('mitraId', '==', mitraId ?? ''), orderBy('sessionDatetime', 'desc')],
    !!mitraId
  );
}

// ─── Soil Reports ─────────────────────────────────────────────────────────────

/** Fetch a single soil report for a booking (one-time read) */
export function useSoilReport(bookingId: string | undefined) {
  const [data, setData] = useState<SoilReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const reportRef = doc(db, 'soilReports', bookingId);
    const unsubscribe = onSnapshot(
      reportRef,
      (snap) => {
        setData(snap.exists() ? ({ id: snap.id, ...snap.data() } as SoilReport) : null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [bookingId]);

  return { data, loading, error };
}

// ─── Crop Listings ────────────────────────────────────────────────────────────

/** Farmer: my own crop listings */
export function useMyCropListings(farmerId: string | undefined) {
  return useCollection<CropListing>(
    'cropListings',
    [where('farmerId', '==', farmerId ?? ''), orderBy('createdAt', 'desc')],
    !!farmerId
  );
}

/** Biopellet: browse all active listings */
export function useAllCropListings() {
  return useCollection<CropListing>(
    'cropListings',
    [where('status', '==', 'ACTIVE'), orderBy('createdAt', 'desc')]
  );
}

// ─── Procurement Orders ───────────────────────────────────────────────────────

/** Farmer: orders on my listings */
export function useFarmerOrders(farmerId: string | undefined) {
  return useCollection<ProcurementOrder>(
    'procurementOrders',
    [where('farmerId', '==', farmerId ?? ''), orderBy('createdAt', 'desc')],
    !!farmerId
  );
}

/** Biopellet plant: orders I've placed */
export function usePlantOrders(plantId: string | undefined) {
  return useCollection<ProcurementOrder>(
    'procurementOrders',
    [where('plantId', '==', plantId ?? ''), orderBy('createdAt', 'desc')],
    !!plantId
  );
}

// ─── Discovery Hooks ──────────────────────────────────────────────────────────

/** Browse all labs (for farmer booking flow) */
export function useAvailableLabs() {
  return useCollection<LabProfile & { id: string }>(
    'labProfiles',
    [where('isVerified', '==', true)]
  );
}

/** Browse all soil-mitras (for farmer booking flow) */
export function useAvailableMitras() {
  return useCollection<SoilmitraProfile & { id: string }>(
    'soilmitraProfiles',
    [where('isVerified', '==', true), orderBy('rating', 'desc')]
  );
}

// ─── Notification (local type — may not be in @farmhith/types) ───────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  userId: string;
}

/** Fetch notifications for a user, newest first */
export function useNotifications(userId: string | undefined) {
  return useCollection<Notification>(
    'notifications',
    [where('userId', '==', userId ?? ''), orderBy('createdAt', 'desc')],
    !!userId
  );
}

// ─── Admin Hooks ─────────────────────────────────────────────────────────────

/** Admin: all registered users */
export function useAllUsers() {
  return useCollection<User & { id: string; createdAt: string }>(
    'users',
    [orderBy('createdAt', 'desc')]
  );
}

/** Admin: all soil test bookings across all labs */
export function useAllSoilTestBookings() {
  return useCollection<SoilTestBooking>(
    'soilTestBookings',
    [orderBy('createdAt', 'desc')]
  );
}

/** Admin: all mitra sessions across all mitras */
export function useAllMitraSessions() {
  return useCollection<MitraBooking>(
    'mitraBookings',
    [orderBy('sessionDatetime', 'desc')]
  );
}

/** Admin: all crop listings (any status) */
export function useAllCropListingsAdmin() {
  return useCollection<CropListing>(
    'cropListings',
    [orderBy('createdAt', 'desc')]
  );
}

/** Admin: all procurement orders */
export function useAllProcurementOrders() {
  return useCollection<ProcurementOrder>(
    'procurementOrders',
    [orderBy('createdAt', 'desc')]
  );
}

/** Admin: all platform payments */
export function useAllPayments() {
  return useCollection<Payment>(
    'payments',
    [orderBy('createdAt', 'desc')]
  );
}

/** Admin: all lab profiles */
export function useAllLabProfiles() {
  return useCollection<LabProfile & { id: string }>(  
    'labProfiles',
    [orderBy('labName', 'asc')]
  );
}

/** Admin: all soilmitra profiles */
export function useAllSoilmitraProfiles() {
  return useCollection<SoilmitraProfile & { id: string }>(
    'soilmitraProfiles',
    [orderBy('rating', 'desc')]
  );
}

// ─── Re-exports ────────────────────────────────────────────────────────────────
export type { SoilTestBooking, MitraBooking, SoilReport, CropListing, ProcurementOrder, User, Payment, LabProfile, SoilmitraProfile };
