import type {
  SoilTestBooking,
  MitraBooking,
  CropListing,
  ProcurementOrder,
  SoilmitraProfile,
  LabProfile,
  Notification,
} from '@farmhith/types';

// ─── Soil Test Bookings ────────────────────────────────────────────────────────
export const mockSoilTestBookings: SoilTestBooking[] = [
  {
    id: 'stb-001',
    farmerId: 'farmer-001',
    farmerName: 'Ramesh Kumar',
    labId: 'lab-001',
    labName: 'AgroScience Soil Lab',
    status: 'IN_PROGRESS',
    cropType: 'Wheat',
    landParcelDetails: '3.5 acres, Field Block A, Ludhiana',
    collectionDate: '2026-04-14',
    amountPaid: 1200,
    reportConsentToMitra: true,
    createdAt: '2026-04-10T09:30:00Z',
  },
  {
    id: 'stb-002',
    farmerId: 'farmer-001',
    farmerName: 'Ramesh Kumar',
    labId: 'lab-002',
    labName: 'Punjab Soil Testing Centre',
    status: 'COMPLETED',
    cropType: 'Rice',
    landParcelDetails: '5 acres, Field Block B, Amritsar',
    collectionDate: '2026-03-28',
    amountPaid: 950,
    reportConsentToMitra: true,
    createdAt: '2026-03-22T11:00:00Z',
    report: {
      id: 'rep-001',
      bookingId: 'stb-002',
      reportUrl: '#',
      testParameters: { ph: 6.8, nitrogen: 280, phosphorus: 42, potassium: 195, moisture: 22, organicCarbon: 0.68 },
      technicianNotes: 'Apply 120 kg/ha urea. Phosphorus is adequate.',
      uploadedAt: '2026-03-30T14:00:00Z',
    },
  },
  {
    id: 'stb-003',
    farmerId: 'farmer-001',
    farmerName: 'Ramesh Kumar',
    labId: 'lab-001',
    labName: 'AgroScience Soil Lab',
    status: 'PENDING',
    cropType: 'Maize',
    landParcelDetails: '2 acres, Field Block C, Ludhiana',
    collectionDate: '2026-04-20',
    amountPaid: 1200,
    reportConsentToMitra: false,
    createdAt: '2026-04-11T16:00:00Z',
  },
];

// ─── Mitra Bookings ────────────────────────────────────────────────────────────
export const mockMitraBookings: MitraBooking[] = [
  {
    id: 'mb-001',
    farmerId: 'farmer-001',
    farmerName: 'Ramesh Kumar',
    mitraId: 'mitra-001',
    mitraName: 'Dr. Gurpreet Singh',
    status: 'CONFIRMED',
    sessionDatetime: '2026-04-15T10:00:00Z',
    durationMinutes: 45,
    amountPaid: 600,
    farmerConsentedReport: true,
    createdAt: '2026-04-11T08:00:00Z',
  },
  {
    id: 'mb-002',
    farmerId: 'farmer-001',
    farmerName: 'Ramesh Kumar',
    mitraId: 'mitra-002',
    mitraName: 'Dr. Anita Sharma',
    status: 'COMPLETED',
    sessionDatetime: '2026-03-20T14:00:00Z',
    durationMinutes: 60,
    amountPaid: 750,
    farmerConsentedReport: false,
    farmerRating: 5,
    createdAt: '2026-03-18T10:00:00Z',
  },
];

// ─── Crop Listings ─────────────────────────────────────────────────────────────
export const mockCropListings: CropListing[] = [
  {
    id: 'cl-001',
    farmerId: 'farmer-001',
    farmerName: 'Ramesh Kumar',
    farmerDistrict: 'Ludhiana',
    farmerState: 'Punjab',
    residueType: 'Paddy Straw',
    quantityTons: 8.5,
    location: 'Ludhiana, Punjab',
    farmhithPricePerTon: 2800,
    availableFrom: '2026-04-25',
    status: 'ACTIVE',
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'cl-002',
    farmerId: 'farmer-001',
    farmerName: 'Ramesh Kumar',
    farmerDistrict: 'Ludhiana',
    farmerState: 'Punjab',
    residueType: 'Wheat Straw',
    quantityTons: 12.0,
    location: 'Ludhiana, Punjab',
    farmhithPricePerTon: 2600,
    availableFrom: '2026-05-10',
    status: 'ACTIVE',
    createdAt: '2026-04-08T14:00:00Z',
  },
];

// ─── Procurement Orders ────────────────────────────────────────────────────────
export const mockProcurementOrders: ProcurementOrder[] = [
  {
    id: 'po-001',
    listingId: 'cl-001',
    listingResidueType: 'Paddy Straw',
    plantId: 'plant-001',
    plantName: 'Green Energy Bio-Pellet Plant',
    farmerId: 'farmer-001',
    farmerName: 'Ramesh Kumar',
    finalQuantityTons: 8.5,
    totalAmount: 23800,
    status: 'INTERESTED',
    createdAt: '2026-04-11T14:00:00Z',
  },
];

// ─── Available Labs (for browsing) ────────────────────────────────────────────
export const mockLabs: LabProfile[] = [
  {
    id: 'lp-001', userId: 'lab-001',
    labName: 'AgroScience Soil Lab',
    address: 'Plot 45, Industrial Area, Ludhiana',
    state: 'Punjab', perTestPrice: 1200, isVerified: true, dailyCapacity: 15,
  },
  {
    id: 'lp-002', userId: 'lab-002',
    labName: 'Punjab Soil Testing Centre',
    address: 'Sector 12, Amritsar',
    state: 'Punjab', perTestPrice: 950, isVerified: true, dailyCapacity: 20,
  },
  {
    id: 'lp-003', userId: 'lab-003',
    labName: 'GreenGrow Analytics Lab',
    address: 'Civil Lines, Patiala',
    state: 'Punjab', perTestPrice: 1100, isVerified: true, dailyCapacity: 10,
  },
];

// ─── Soil Mitras (for browsing) ───────────────────────────────────────────────
export const mockSoilMitras: SoilmitraProfile[] = [
  {
    id: 'smp-001', userId: 'mitra-001',
    fullName: 'Dr. Gurpreet Singh',
    specialisation: ['Soil Fertility', 'Crop Nutrition', 'Organic Farming'],
    languagesSpoken: ['Hindi', 'Punjabi', 'English'],
    sessionFee: 600, rating: 4.8, totalSessions: 142,
    bio: 'PhD in Agronomy from PAU Ludhiana with 12 years of field experience.',
    isVerified: true,
  },
  {
    id: 'smp-002', userId: 'mitra-002',
    fullName: 'Dr. Anita Sharma',
    specialisation: ['Irrigation Management', 'Wheat Cultivation', 'Pest Control'],
    languagesSpoken: ['Hindi', 'Haryanvi', 'English'],
    sessionFee: 750, rating: 4.6, totalSessions: 98,
    bio: 'Senior agronomist with expertise in wheat belt farming across Punjab and Haryana.',
    isVerified: true,
  },
  {
    id: 'smp-003', userId: 'mitra-003',
    fullName: 'Dr. Rajendra Patel',
    specialisation: ['Rice Cultivation', 'Soil pH Management', 'Bio-Fertilisers'],
    languagesSpoken: ['Hindi', 'Gujarati'],
    sessionFee: 500, rating: 4.9, totalSessions: 210,
    bio: 'Expert in soil restoration and sustainable agriculture.',
    isVerified: true,
  },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: 'n-001', userId: 'farmer-001',
    title: 'Soil Test Accepted',
    message: 'AgroScience Lab accepted your booking for April 14.',
    type: 'success', read: false, createdAt: '2026-04-11T09:00:00Z',
  },
  {
    id: 'n-002', userId: 'farmer-001',
    title: 'Session Confirmed',
    message: 'Dr. Gurpreet Singh confirmed your session on April 15 at 10:00 AM.',
    type: 'success', read: false, createdAt: '2026-04-11T08:30:00Z',
  },
  {
    id: 'n-003', userId: 'farmer-001',
    title: 'New Order Interest',
    message: 'Green Energy Plant is interested in your Paddy Straw listing (8.5 tons).',
    type: 'info', read: true, createdAt: '2026-04-10T15:00:00Z',
  },
  {
    id: 'n-004', userId: 'farmer-001',
    title: 'Soil Report Ready',
    message: 'Your soil test report from Punjab Soil Testing Centre is ready.',
    type: 'info', read: true, createdAt: '2026-03-30T14:00:00Z',
  },
];
