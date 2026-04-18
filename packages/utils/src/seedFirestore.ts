/**
 * seedFirestore.ts — Farmhith Firestore seed script
 *
 * Usage (from monorepo root):
 *   npx ts-node -e "require('./packages/utils/src/seedFirestore.ts')"
 *   OR compile and run as ESM with tsx:
 *   pnpm dlx tsx packages/utils/src/seedFirestore.ts
 *
 * Requirements:
 *   GOOGLE_APPLICATION_CREDENTIALS env var pointing to a Firebase service-account JSON.
 *   (Download from Firebase Console → Project Settings → Service Accounts)
 *
 * This script is IDEMPOTENT — it uses setDoc with merge:true and fixed
 * "seed_" prefixed document IDs, so running it twice is safe.
 */

import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// ─── Init ─────────────────────────────────────────────────────────────────────

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'farmhith-893f4',
  });
}

const db = admin.firestore();

// Helper: setDoc with merge:true — idempotent
async function upsert(
  collectionPath: string,
  docId: string,
  data: Record<string, unknown>,
) {
  await db.collection(collectionPath).doc(docId).set(data, { merge: true });
  console.log(`✅  upserted  ${collectionPath}/${docId}`);
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const NOW = Timestamp.now();
const FUTURE = Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
const PAST   = Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));

async function seed() {
  console.log('\n🌱  Starting Farmhith Firestore seed…\n');

  // ── /users ──────────────────────────────────────────────────────────────────

  await upsert('users', 'seed_farmer_uid', {
    uid: 'seed_farmer_uid',
    email: 'ramesh.patel@example.in',
    role: 'FARMER',
    preferredLang: 'hi',
    createdAt: NOW,
  });

  await upsert('users', 'seed_lab_uid', {
    uid: 'seed_lab_uid',
    email: 'info@agrilab.in',
    role: 'LAB',
    preferredLang: 'en',
    createdAt: NOW,
  });

  await upsert('users', 'seed_mitra_uid', {
    uid: 'seed_mitra_uid',
    email: 'priya.mitra@example.in',
    role: 'SOIL_MITRA',
    preferredLang: 'hi',
    createdAt: NOW,
  });

  await upsert('users', 'seed_biopellet_uid', {
    uid: 'seed_biopellet_uid',
    email: 'ops@greenpower.in',
    role: 'BIOPELLET',
    preferredLang: 'en',
    createdAt: NOW,
  });

  // ── /farmerProfiles ──────────────────────────────────────────────────────────

  await upsert('farmerProfiles', 'seed_farmer_uid', {
    uid: 'seed_farmer_uid',
    fullName: 'Ramesh Patel',
    phone: '+919876543210',
    state: 'Madhya Pradesh',
    district: 'Indore',
    totalLandAcres: 12.5,
    primaryCrop: 'Wheat',
    aadhaarNumber: '1234-5678-9012',
  });

  // ── /labProfiles ─────────────────────────────────────────────────────────────

  await upsert('labProfiles', 'seed_lab_uid', {
    uid: 'seed_lab_uid',
    labName: 'Agri Soil Testing Lab',
    address: '42, Industrial Area, Phase 2',
    state: 'Madhya Pradesh',
    district: 'Indore',
    perTestPrice: 350,
    isVerified: true,
    dailyCapacity: 40,
  });

  // ── /soilmitraProfiles ───────────────────────────────────────────────────────

  await upsert('soilmitraProfiles', 'seed_mitra_uid', {
    uid: 'seed_mitra_uid',
    fullName: 'Priya Sharma',
    specialisation: ['Wheat', 'Soybean', 'Cotton'],
    languagesSpoken: ['hi', 'en', 'mr'],
    sessionFee: 299,
    rating: 4.8,
    totalSessions: 134,
    isVerified: true,
    availableSlots: [
      new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    ],
  });

  // ── /biopelletProfiles ───────────────────────────────────────────────────────

  await upsert('biopelletProfiles', 'seed_biopellet_uid', {
    uid: 'seed_biopellet_uid',
    plantName: 'Green Power Energy Pvt. Ltd.',
    state: 'Maharashtra',
    acceptedResidueTypes: ['Wheat Straw', 'Paddy Straw', 'Sugarcane Bagasse'],
    procurementRatePerTon: 2800,
    isVerified: true,
  });

  // ── /soilTestBookings ────────────────────────────────────────────────────────

  await upsert('soilTestBookings', 'seed_booking_001', {
    farmerId: 'seed_farmer_uid',
    labId: 'seed_lab_uid',
    farmerName: 'Ramesh Patel',
    labName: 'Agri Soil Testing Lab',
    collectionDate: FUTURE,
    cropType: 'Wheat',
    landParcelDetails: 'Survey No. 142, Village Rau, Indore',
    status: 'PENDING',
    amountPaid: 350,
    reportConsentToMitra: true,
    createdAt: NOW,
  });

  // ── /soilTestBookings/{bookingId}/reports/{reportId} ─────────────────────────

  await db
    .collection('soilTestBookings')
    .doc('seed_booking_001')
    .collection('reports')
    .doc('seed_report_001')
    .set(
      {
        reportUrl: 'https://storage.googleapis.com/farmhith-893f4/reports/seed_report_001.pdf',
        testParameters: {
          pH: 7.2,
          nitrogen: 285,
          phosphorus: 62,
          potassium: 198,
        },
        technicianNotes: 'Soil health is moderate. Consider adding organic matter.',
        uploadedAt: NOW,
      },
      { merge: true },
    );
  console.log('✅  upserted  soilTestBookings/seed_booking_001/reports/seed_report_001');

  // ── /mitraBookings ───────────────────────────────────────────────────────────

  await upsert('mitraBookings', 'seed_mitra_booking_001', {
    farmerId: 'seed_farmer_uid',
    mitraId: 'seed_mitra_uid',
    farmerName: 'Ramesh Patel',
    mitraName: 'Priya Sharma',
    sessionDatetime: FUTURE,
    status: 'CONFIRMED',
    videoRoomUrl: 'https://meet.farmhith.in/room/abc123',
    amountPaid: 299,
    farmerConsentedReport: true,
    linkedReportUrl: 'https://storage.googleapis.com/farmhith-893f4/reports/seed_report_001.pdf',
    mitraNotes: null,
    farmerRating: null,
    createdAt: NOW,
  });

  // ── /cropListings ────────────────────────────────────────────────────────────

  await upsert('cropListings', 'seed_listing_001', {
    farmerId: 'seed_farmer_uid',
    farmerName: 'Ramesh Patel',
    farmerDistrict: 'Indore',
    residueType: 'Wheat Straw',
    quantityTons: 18,
    availableFrom: PAST,
    farmhithPricePerTon: 2660, // = 2800 * 0.95
    status: 'ACTIVE',
    createdAt: NOW,
  });

  // ── /procurementOrders ───────────────────────────────────────────────────────

  await upsert('procurementOrders', 'seed_order_001', {
    listingId: 'seed_listing_001',
    plantId: 'seed_biopellet_uid',
    farmerId: 'seed_farmer_uid',
    plantName: 'Green Power Energy Pvt. Ltd.',
    finalQuantityTons: 18,
    totalAmount: 47880, // 18 × 2660
    status: 'INTERESTED',
    paymentId: null,
    createdAt: NOW,
  });

  // ── /payments ────────────────────────────────────────────────────────────────

  await upsert('payments', 'seed_payment_001', {
    razorpayOrderId: 'order_seed123456',
    razorpayPaymentId: 'pay_seed123456',
    payerUid: 'seed_farmer_uid',
    payeeUid: 'seed_lab_uid',
    grossAmount: 350,
    platformCommission: 35,  // 10% of gross
    netPayout: 315,
    serviceType: 'SOIL_TEST',
    serviceRefId: 'seed_booking_001',
    status: 'CAPTURED',
    createdAt: NOW,
  });

  console.log('\n🎉  All seed documents written successfully!\n');
}

seed().catch((err) => {
  console.error('\n❌  Seed failed:', err);
  process.exit(1);
});
