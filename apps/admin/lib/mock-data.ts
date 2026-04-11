import type { AdminStats, User, SoilTestBooking, MitraBooking, CropListing, ProcurementOrder, Payment } from '@farmhith/types';

export const mockStats: AdminStats = {
  totalFarmers: 1248,
  totalLabs: 34,
  totalMitras: 67,
  totalPlants: 12,
  bookingsToday: 23,
  revenueToday: 45600,
  activeListings: 312,
  completionRate: 87.4,
};

export const mockUsers: User[] = [
  { id: 'farmer-001', email: 'ramesh@farmhith.in', phone: '+91 98765 43210', role: 'FARMER', preferredLang: 'hi', createdAt: '2026-01-15T09:00:00Z' },
  { id: 'lab-001', email: 'info@agrosciencelab.in', phone: '+91 99887 65432', role: 'LAB', preferredLang: 'en', createdAt: '2026-01-20T10:00:00Z' },
  { id: 'mitra-001', email: 'dr.singh@farmhith.in', phone: '+91 77665 43219', role: 'SOILMITRA', preferredLang: 'en', createdAt: '2026-01-18T11:00:00Z' },
  { id: 'plant-001', email: 'ops@greenenergyplant.in', phone: '+91 88776 54321', role: 'BIOPELLET', preferredLang: 'en', createdAt: '2026-01-22T08:00:00Z' },
  { id: 'farmer-002', email: 'sukhwinder@farmhith.in', phone: '+91 99123 45678', role: 'FARMER', preferredLang: 'hi', createdAt: '2026-02-01T10:00:00Z' },
];

// Re-export combined data from other portals for admin overview
export const allBookings: SoilTestBooking[] = [
  { id: 'stb-001', farmerId: 'farmer-001', farmerName: 'Ramesh Kumar', labId: 'lab-001', labName: 'AgroScience Soil Lab', status: 'IN_PROGRESS', cropType: 'Wheat', landParcelDetails: '3.5 acres', collectionDate: '2026-04-14', amountPaid: 1200, reportConsentToMitra: true, createdAt: '2026-04-10T09:30:00Z' },
  { id: 'stb-002', farmerId: 'farmer-002', farmerName: 'Sukhwinder Singh', labId: 'lab-001', labName: 'AgroScience Soil Lab', status: 'PENDING', cropType: 'Rice', landParcelDetails: '4 acres', collectionDate: '2026-04-13', amountPaid: 1200, reportConsentToMitra: false, createdAt: '2026-04-10T14:00:00Z' },
  { id: 'stb-003', farmerId: 'farmer-003', farmerName: 'Balwant Kaur', labId: 'lab-002', labName: 'Punjab Soil Testing Centre', status: 'COMPLETED', cropType: 'Maize', landParcelDetails: '2 acres', collectionDate: '2026-04-08', amountPaid: 950, reportConsentToMitra: true, createdAt: '2026-04-06T09:00:00Z' },
];

export const allPayments: Payment[] = [
  { id: 'pay-001', payerUserId: 'farmer-001', payerName: 'Ramesh Kumar', payeeUserId: 'lab-001', payeeName: 'AgroScience Lab', grossAmount: 1200, platformCommission: 60, netPayout: 1140, serviceType: 'SOIL_TEST', serviceRefId: 'stb-001', status: 'CAPTURED', createdAt: '2026-04-10T09:30:00Z' },
  { id: 'pay-002', payerUserId: 'farmer-001', payerName: 'Ramesh Kumar', payeeUserId: 'mitra-001', payeeName: 'Dr. Gurpreet Singh', grossAmount: 600, platformCommission: 60, netPayout: 540, serviceType: 'MITRA_SESSION', serviceRefId: 'mb-001', status: 'CAPTURED', createdAt: '2026-04-11T08:00:00Z' },
  { id: 'pay-003', payerUserId: 'farmer-007', payerName: 'Prem Chand Sharma', payeeUserId: 'plant-001', payeeName: 'Green Energy Plant', grossAmount: 26000, platformCommission: 1300, netPayout: 24700, serviceType: 'CROP_PROCUREMENT', serviceRefId: 'po-001', status: 'SETTLED', createdAt: '2026-04-09T14:00:00Z' },
];
