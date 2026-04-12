/**
 * FarmHith 2.0 — Database Seed Script
 * Run: pnpm --filter @farmhith/api db:seed
 *
 * Creates a full set of test data covering all 5 portal roles.
 */

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FarmHith database...\n');

  // ── Clean existing data (dev only) ──────────────────────────────
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.procurementOrder.deleteMany(),
    prisma.cropListing.deleteMany(),
    prisma.soilReport.deleteMany(),
    prisma.soilTestBooking.deleteMany(),
    prisma.mitraBooking.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.farmerProfile.deleteMany(),
    prisma.labProfile.deleteMany(),
    prisma.soilmitraProfile.deleteMany(),
    prisma.biopelletProfile.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // ── Seed Users ───────────────────────────────────────────────────
  const farmer = await prisma.user.create({
    data: {
      phone: '+919876543210',
      role: 'FARMER',
      isActive: true,
      isVerified: true,
      farmerProfile: {
        create: {
          fullName: 'Ramesh Kumar',
          state: 'Punjab',
          district: 'Ludhiana',
          totalLandAcres: 12.5,
          primaryCrop: 'Wheat',
          preferredLang: 'Hindi',
        },
      },
    },
  });

  const farmer2 = await prisma.user.create({
    data: {
      phone: '+919812345678',
      role: 'FARMER',
      isActive: true,
      isVerified: true,
      farmerProfile: {
        create: {
          fullName: 'Gurpreet Singh',
          state: 'Punjab',
          district: 'Amritsar',
          totalLandAcres: 8.0,
          primaryCrop: 'Paddy',
          preferredLang: 'Punjabi',
        },
      },
    },
  });

  const lab = await prisma.user.create({
    data: {
      phone: '+919988776655',
      role: 'LAB',
      isActive: true,
      isVerified: true,
      labProfile: {
        create: {
          labName: 'AgriTest Punjab Lab',
          address: 'Phase 5, Industrial Area, Ludhiana',
          state: 'Punjab',
          district: 'Ludhiana',
          perTestPrice: 299,
          dailyCapacity: 20,
          certifications: 'NABL Accredited',
        },
      },
    },
  });

  const mitra = await prisma.user.create({
    data: {
      phone: '+919911223344',
      role: 'SOILMITRA',
      isActive: true,
      isVerified: true,
      soilmitraProfile: {
        create: {
          fullName: 'Dr. Harpreet Kaur',
          bio: 'Agronomy expert with 8+ years helping Punjab farmers maximize yield through soil health management.',
          sessionFee: 499,
          rating: 4.8,
          totalSessions: 142,
          specialisation: JSON.stringify(['Wheat', 'Paddy', 'Soil Fertility', 'Pest Management']),
          languagesSpoken: JSON.stringify(['Hindi', 'Punjabi', 'English']),
          availability: JSON.stringify({
            mon: ['10:00 AM', '11:00 AM', '02:00 PM'],
            tue: ['10:00 AM', '11:00 AM'],
            wed: ['10:00 AM', '02:00 PM', '04:00 PM'],
            thu: ['10:00 AM', '11:00 AM', '02:00 PM'],
            fri: ['10:00 AM', '03:00 PM'],
          }),
        },
      },
    },
  });

  const plant = await prisma.user.create({
    data: {
      phone: '+919900112233',
      role: 'BIOPELLET',
      isActive: true,
      isVerified: true,
      biopelletProfile: {
        create: {
          plantName: 'Greenleaf Bio-Energy Ltd.',
          address: 'Industrial Zone, Rajpura',
          state: 'Punjab',
          district: 'Patiala',
          acceptedResidueTypes: 'Paddy Straw,Wheat Straw',
          procurementRatePerTon: 2500,
        },
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      phone: '+919000000001',
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Users created:', { farmer: farmer.id, lab: lab.id, mitra: mitra.id, plant: plant.id, admin: admin.id });

  // ── Seed Soil Test Booking ───────────────────────────────────────
  const booking = await prisma.soilTestBooking.create({
    data: {
      farmerId: farmer.id,
      labId: lab.id,
      cropType: 'Wheat',
      landParcelDetails: '5 Acres, North Field',
      collectionDate: new Date('2026-04-20'),
      status: 'COMPLETED',
      amountPaid: 299,
      report: {
        create: {
          nitrogen: 142,
          phosphorus: 28,
          potassium: 198,
          ph: 7.2,
          moisture: 18.5,
          recommendation:
            'Soil is nitrogen deficient. Apply urea at 120 kg/acre before next sowing. pH is ideal. Potassium levels are adequate.',
        },
      },
    },
  });

  const pendingBooking = await prisma.soilTestBooking.create({
    data: {
      farmerId: farmer2.id,
      labId: lab.id,
      cropType: 'Paddy',
      landParcelDetails: '3 Acres, East Plot',
      collectionDate: new Date('2026-04-25'),
      status: 'PENDING',
      amountPaid: 299,
    },
  });

  console.log('✅ Soil test bookings created:', booking.id, pendingBooking.id);

  // ── Seed Mitra Session ───────────────────────────────────────────
  const session = await prisma.mitraBooking.create({
    data: {
      farmerId: farmer.id,
      mitraId: mitra.id,
      sessionDatetime: new Date('2026-04-22T10:00:00Z'),
      durationMinutes: 30,
      cropType: 'Wheat',
      notes: 'Yellowing of leaves visible across the entire north field.',
      status: 'CONFIRMED',
      amountPaid: 499,
    },
  });

  console.log('✅ Mitra session created:', session.id);

  // ── Seed Crop Listing ────────────────────────────────────────────
  const listing = await prisma.cropListing.create({
    data: {
      farmerId: farmer2.id,
      residueType: 'Paddy Straw',
      quantityTons: 8,
      location: 'Amritsar, Punjab',
      availableFrom: new Date('2026-05-01'),
      status: 'ACTIVE',
      farmhithPricePerTon: 2500,
      marketPricePerTon: 2200,
    },
  });

  console.log('✅ Crop listing created:', listing.id);

  // ── Seed Procurement Order ───────────────────────────────────────
  const order = await prisma.procurementOrder.create({
    data: {
      listingId: listing.id,
      plantId: plant.id,
      finalQuantityTons: 6,
      totalAmount: 15000,
      status: 'INTERESTED',
    },
  });

  console.log('✅ Procurement order created:', order.id);

  // ── Seed Payment ─────────────────────────────────────────────────
  await prisma.payment.create({
    data: {
      payerId: farmer.id,
      payeeId: lab.id,
      serviceType: 'SOIL_TEST',
      grossAmount: 299,
      platformCommission: 29.9,
      netPayout: 269.1,
      status: 'SETTLED',
      soilTestBookingId: booking.id,
    },
  });

  console.log('✅ Payment record created');

  // ── Seed Notifications ───────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: farmer.id,
        type: 'SUCCESS',
        title: 'Soil Report Ready',
        message: 'Your soil test report from AgriTest Punjab Lab is now available.',
      },
      {
        userId: farmer.id,
        type: 'INFO',
        title: 'Session Confirmed',
        message: 'Your consultation with Dr. Harpreet Kaur is confirmed for Apr 22, 10:00 AM.',
      },
      {
        userId: lab.id,
        type: 'INFO',
        title: 'New Booking Request',
        message: 'Gurpreet Singh has submitted a soil test booking for Paddy crop.',
      },
    ],
  });

  console.log('✅ Notifications seeded');

  console.log(`
🌾 Database seeded successfully!

Test accounts (any phone → OTP bypass: 123456):
  Farmer      : +91 98765 43210
  Farmer 2    : +91 98123 45678
  Lab         : +91 99887 76655
  Soil-Mitra  : +91 99112 23344
  Bio-Pellet  : +91 99001 12233
  Admin       : +91 90000 00001
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
