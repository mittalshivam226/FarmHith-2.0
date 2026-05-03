// apps/farmer/app/api/mitra/bookings/route.ts
// Task 4.4 — Create Soil-Mitra booking
// Auth: FARMER role required
import { adminDb, FieldValue } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'FARMER') throw new ApiError(403, 'FARMER role required');

    const body = await request.json() as {
      mitraId?: string;
      sessionDatetime?: string;
      farmDetails?: string;
      cropType?: string;
      soilReportId?: string;
      farmerConsentedReport?: boolean;
    };

    const { mitraId, sessionDatetime, farmDetails, cropType, soilReportId, farmerConsentedReport } = body;

    if (!mitraId || !sessionDatetime) {
      throw new ApiError(400, 'Missing required fields: mitraId, sessionDatetime');
    }

    // Read Mitra profile for mitraName + sessionFee
    const mitraSnap = await adminDb.collection('soilmitraProfiles').doc(mitraId).get();
    if (!mitraSnap.exists) throw new ApiError(404, 'Soil-Mitra not found');
    const mitra = mitraSnap.data()!;
    if (!mitra.isVerified) throw new ApiError(400, 'Soil-Mitra is not yet verified');

    // Read farmer profile for farmerName
    const farmerSnap = await adminDb.collection('farmerProfiles').doc(decoded.uid).get();
    if (!farmerSnap.exists) throw new ApiError(404, 'Farmer profile not found. Complete registration first.');
    const farmer = farmerSnap.data()!;

    // Write to /mitraBookings
    const bookingRef = adminDb.collection('mitraBookings').doc();
    await bookingRef.set({
      farmerId:              decoded.uid,
      mitraId,
      farmerName:            farmer.fullName,
      mitraName:             mitra.fullName,
      sessionDatetime:       new Date(sessionDatetime),
      durationMinutes:       60,
      status:                'PENDING',
      videoRoomUrl:          null,
      amountPaid:            mitra.sessionFee,
      farmerConsentedReport: Boolean(farmerConsentedReport),
      linkedReportUrl:       soilReportId ? `soilTestBookings/${soilReportId}` : null,
      farmDetails:           farmDetails ?? null,
      cropType:              cropType ?? null,
      mitraNotes:            null,
      farmerRating:          null,
      createdAt:             FieldValue.serverTimestamp(),
    });

    return Response.json(
      { bookingId: bookingRef.id, amount: mitra.sessionFee },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/mitra/bookings]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
