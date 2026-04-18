/**
 * @farmhith/types — firestore.ts
 *
 * Firestore-native TypeScript interfaces for every collection.
 * Use `Timestamp` from "firebase/firestore" throughout — never plain `string`.
 * On writes, use serverTimestamp(); on reads, cast data() to these interfaces.
 */

import { Timestamp } from 'firebase/firestore';

// ─── SHARED ENUMS ─────────────────────────────────────────────────────────────

export type Role = 'FARMER' | 'LAB' | 'BIOPELLET' | 'SOIL_MITRA' | 'ADMIN';
export type Lang = 'en' | 'hi';

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type SessionStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export type ListingStatus = 'ACTIVE' | 'MATCHED' | 'SOLD' | 'EXPIRED';

export type OrderStatus =
  | 'INTERESTED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'CAPTURED'
  | 'SETTLED'
  | 'REFUNDED';

export type ServiceType =
  | 'SOIL_TEST'
  | 'MITRA_SESSION'
  | 'CROP_PROCUREMENT';

// ─── /users/{uid} ────────────────────────────────────────────────────────────

/**
 * Top-level user document stored at /users/{uid}.
 * Created on first registration. Drives role-based routing across all portals.
 */
export interface FSUser {
  uid: string;
  email: string;
  role: Role;
  preferredLang: Lang;
  createdAt: Timestamp;
}

// ─── /farmerProfiles/{uid} ────────────────────────────────────────────────────

export interface FSFarmerProfile {
  uid: string;
  fullName: string;
  phone: string;
  state: string;
  district: string;
  totalLandAcres: number;
  primaryCrop: string;
  aadhaarNumber?: string;
}

// ─── /labProfiles/{uid} ───────────────────────────────────────────────────────

export interface FSLabProfile {
  uid: string;
  labName: string;
  address: string;
  state: string;
  district: string;
  perTestPrice: number;
  isVerified: boolean;
  dailyCapacity: number;
}

// ─── /soilmitraProfiles/{uid} ─────────────────────────────────────────────────

export interface FSSoilMitraProfile {
  uid: string;
  fullName: string;
  /** array-contains queries: e.g. "Wheat", "Cotton", "Rice" */
  specialisation: string[];
  /** array-contains queries: e.g. "hi", "en", "mr" */
  languagesSpoken: string[];
  sessionFee: number;
  rating: number;          // average 1‑5
  totalSessions: number;
  isVerified: boolean;
  /** ISO datetime strings for booked-slot management */
  availableSlots: string[];
}

// ─── /biopelletProfiles/{uid} ─────────────────────────────────────────────────

export interface FSBiopelletProfile {
  uid: string;
  plantName: string;
  state: string;
  /** array-contains: "Wheat Straw", "Paddy Straw", "Sugarcane Bagasse" … */
  acceptedResidueTypes: string[];
  procurementRatePerTon: number;
  isVerified: boolean;
}

// ─── /soilTestBookings/{bookingId} ────────────────────────────────────────────

export interface FSSoilTestBooking {
  farmerId: string;
  labId: string;
  /** Denormalized — avoids extra read on list views */
  farmerName: string;
  /** Denormalized — avoids extra read on list views */
  labName: string;
  collectionDate: Timestamp;
  cropType: string;
  landParcelDetails: string;
  status: BookingStatus;
  amountPaid: number;
  reportConsentToMitra: boolean;
  createdAt: Timestamp;
}

// ─── /soilTestBookings/{bookingId}/reports/{reportId} ─────────────────────────

export interface FSSoilReport {
  reportUrl: string;
  testParameters: {
    pH: number;
    nitrogen: number;   // mg/kg
    phosphorus: number; // mg/kg
    potassium: number;  // mg/kg
  };
  technicianNotes: string;
  uploadedAt: Timestamp;
}

// ─── /mitraBookings/{bookingId} ───────────────────────────────────────────────

export interface FSMitraBooking {
  farmerId: string;
  mitraId: string;
  /** Denormalized */
  farmerName: string;
  /** Denormalized */
  mitraName: string;
  sessionDatetime: Timestamp;
  status: SessionStatus;
  /** null until payment is captured */
  videoRoomUrl: string | null;
  amountPaid: number;
  farmerConsentedReport: boolean;
  /** Only set when farmerConsentedReport === true */
  linkedReportUrl: string | null;
  mitraNotes: string | null;
  /** 1–5, submitted after the session ends */
  farmerRating: number | null;
  createdAt: Timestamp;
}

// ─── /cropListings/{listingId} ────────────────────────────────────────────────

export interface FSCropListing {
  farmerId: string;
  /** Denormalized */
  farmerName: string;
  /** Denormalized — enables location-based Firestore compound queries */
  farmerDistrict: string;
  residueType: string;
  quantityTons: number;
  availableFrom: Timestamp;
  /** Computed by Farmhith pricing formula at creation time */
  farmhithPricePerTon: number;
  status: ListingStatus;
  createdAt: Timestamp;
}

// ─── /procurementOrders/{orderId} ─────────────────────────────────────────────

export interface FSProcurementOrder {
  listingId: string;
  plantId: string;
  /** Copied from listing for single-collection querying */
  farmerId: string;
  /** Denormalized */
  plantName: string;
  finalQuantityTons: number;
  /** finalQuantityTons × farmhithPricePerTon */
  totalAmount: number;
  status: OrderStatus;
  paymentId: string | null;
  createdAt: Timestamp;
}

// ─── /payments/{paymentId} ────────────────────────────────────────────────────

export interface FSPayment {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  payerUid: string;
  payeeUid: string;
  grossAmount: number;
  platformCommission: number;
  /** grossAmount - platformCommission */
  netPayout: number;
  serviceType: ServiceType;
  /** ID of the booking / order this payment is associated with */
  serviceRefId: string;
  status: PaymentStatus;
  createdAt: Timestamp;
}
