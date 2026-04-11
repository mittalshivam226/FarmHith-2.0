// ─── ROLES ───────────────────────────────────────────────────────────────────

export type Role = 'FARMER' | 'LAB' | 'BIOPELLET' | 'SOILMITRA' | 'ADMIN';
export type Lang = 'en' | 'hi';

// ─── ENUMS ───────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
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

export type SessionStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

// ─── USER & PROFILES ─────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  phone: string;
  role: Role;
  preferredLang: Lang;
  createdAt: string;
  farmerProfile?: FarmerProfile;
  labProfile?: LabProfile;
  biopelletProfile?: BiopelletProfile;
  soilmitraProfile?: SoilmitraProfile;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  state: string;
  district: string;
  totalLandAcres: number;
  primaryCrop: string;
  aadhaarNumber?: string;
}

export interface LabProfile {
  id: string;
  userId: string;
  labName: string;
  address: string;
  state: string;
  perTestPrice: number;
  isVerified: boolean;
  dailyCapacity: number;
}

export interface BiopelletProfile {
  id: string;
  userId: string;
  plantName: string;
  state: string;
  acceptedResidueTypes: string[];
  procurementRatePerTon: number;
}

export interface SoilmitraProfile {
  id: string;
  userId: string;
  fullName: string;
  specialisation: string[];
  languagesSpoken: string[];
  sessionFee: number;
  rating: number;
  totalSessions: number;
  bio?: string;
  photoUrl?: string;
  isVerified: boolean;
}

// ─── SOIL TESTING ─────────────────────────────────────────────────────────────

export interface SoilTestBooking {
  id: string;
  farmerId: string;
  farmerName: string;
  labId: string;
  labName: string;
  collectionDate: string;
  landParcelDetails: string;
  cropType: string;
  status: BookingStatus;
  amountPaid: number;
  paymentId?: string;
  reportConsentToMitra: boolean;
  createdAt: string;
  report?: SoilReport;
}

export interface SoilReport {
  id: string;
  bookingId: string;
  reportUrl?: string;
  testParameters: SoilParameters;
  technicianNotes?: string;
  uploadedAt: string;
}

export interface SoilParameters {
  ph: number;
  nitrogen: number;    // mg/kg
  phosphorus: number;  // mg/kg
  potassium: number;   // mg/kg
  moisture: number;    // %
  organicCarbon?: number;
  ec?: number;         // electrical conductivity dS/m
}

// ─── SOIL-MITRA SESSIONS ──────────────────────────────────────────────────────

export interface MitraBooking {
  id: string;
  farmerId: string;
  farmerName: string;
  farmDetails?: string;
  cropType?: string;
  mitraId: string;
  mitraName: string;
  soilReportId?: string;
  soilReport?: SoilReport;
  sessionDatetime: string;
  durationMinutes: number;
  status: SessionStatus;
  videoRoomUrl?: string;
  amountPaid: number;
  paymentId?: string;
  farmerConsentedReport: boolean;
  mitraNotes?: string;
  farmerRating?: number;
  createdAt: string;
}

// ─── BIO-PELLET MARKETPLACE ───────────────────────────────────────────────────

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerDistrict: string;
  farmerState: string;
  residueType: string;
  quantityTons: number;
  location: string;
  availableFrom: string;
  farmhithPricePerTon: number;
  status: ListingStatus;
  createdAt: string;
}

export interface ProcurementOrder {
  id: string;
  listingId: string;
  listingResidueType: string;
  plantId: string;
  plantName: string;
  farmerId: string;
  farmerName: string;
  finalQuantityTons: number;
  totalAmount: number;
  status: OrderStatus;
  paymentId?: string;
  createdAt: string;
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  payerUserId: string;
  payerName: string;
  payeeUserId: string;
  payeeName: string;
  grossAmount: number;
  platformCommission: number;
  netPayout: number;
  serviceType: ServiceType;
  serviceRefId: string;
  status: PaymentStatus;
  createdAt: string;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  role: Role;
  name: string;
  isVerified: boolean;
  profile?: FarmerProfile | LabProfile | BiopelletProfile | SoilmitraProfile;
}

// ─── MISC ─────────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalFarmers: number;
  totalLabs: number;
  totalMitras: number;
  totalPlants: number;
  bookingsToday: number;
  revenueToday: number;
  activeListings: number;
  completionRate: number;
}
