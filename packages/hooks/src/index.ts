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

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`[useCollection:${collectionName}]`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, enabled]);

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

// ─── Re-exports ────────────────────────────────────────────────────────────────
export type { SoilTestBooking, MitraBooking, SoilReport, CropListing, ProcurementOrder };
