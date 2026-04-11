import type { MitraBooking, Payment } from '@farmhith/types';

export const mockSessions: MitraBooking[] = [
  {
    id: 'mb-201',
    farmerId: 'farmer-001', farmerName: 'Ramesh Kumar',
    farmDetails: '12.5 acres, Ludhiana, Punjab',
    cropType: 'Wheat',
    mitraId: 'mitra-001', mitraName: 'Dr. Gurpreet Singh',
    sessionDatetime: '2026-04-15T10:00:00Z',
    durationMinutes: 45,
    status: 'CONFIRMED',
    amountPaid: 600,
    farmerConsentedReport: true,
    createdAt: '2026-04-11T08:00:00Z',
  },
  {
    id: 'mb-202',
    farmerId: 'farmer-002', farmerName: 'Sukhwinder Singh',
    farmDetails: '8 acres, Patiala, Punjab',
    cropType: 'Rice',
    mitraId: 'mitra-001', mitraName: 'Dr. Gurpreet Singh',
    sessionDatetime: '2026-04-16T14:00:00Z',
    durationMinutes: 45,
    status: 'PENDING',
    amountPaid: 600,
    farmerConsentedReport: false,
    createdAt: '2026-04-10T11:00:00Z',
  },
  {
    id: 'mb-203',
    farmerId: 'farmer-003', farmerName: 'Balwant Kaur',
    farmDetails: '5 acres, Moga, Punjab',
    cropType: 'Maize',
    mitraId: 'mitra-001', mitraName: 'Dr. Gurpreet Singh',
    sessionDatetime: '2026-04-08T11:00:00Z',
    durationMinutes: 60,
    status: 'COMPLETED',
    amountPaid: 600,
    farmerConsentedReport: true,
    farmerRating: 5,
    createdAt: '2026-04-06T09:00:00Z',
  },
];

export const mockEarnings: Payment[] = [
  { id: 'pay-201', payerUserId: 'farmer-001', payerName: 'Ramesh Kumar', payeeUserId: 'mitra-001', payeeName: 'Dr. Gurpreet Singh', grossAmount: 600, platformCommission: 60, netPayout: 540, serviceType: 'MITRA_SESSION', serviceRefId: 'mb-203', status: 'SETTLED', createdAt: '2026-04-08T12:00:00Z' },
  { id: 'pay-202', payerUserId: 'farmer-002', payerName: 'Sukhwinder Singh', payeeUserId: 'mitra-001', payeeName: 'Dr. Gurpreet Singh', grossAmount: 600, platformCommission: 60, netPayout: 540, serviceType: 'MITRA_SESSION', serviceRefId: 'mb-201', status: 'CAPTURED', createdAt: '2026-04-11T08:00:00Z' },
];
