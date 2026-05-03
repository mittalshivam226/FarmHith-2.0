// apps/farmer/app/api/soil-test/bookings/route.ts
// Task 4.1 — Create soil test booking
// Auth: FARMER role required
import { adminDb, FieldValue } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'FARMER') throw new ApiError(403, 'FARMER role required');

    const body = await request.json() as {
      labId?: string;
      collectionDate?: string;
      cropType?: string;
      landParcelDetails?: string;
      reportConsentToMitra?: boolean;
    };

    const { labId, collectionDate, cropType, landParcelDetails, reportConsentToMitra } = body;

    if (!labId || !collectionDate || !cropType || !landParcelDetails) {
      throw new ApiError(400, 'Missing required fields: labId, collectionDate, cropType, landParcelDetails');
    }

    // Read lab profile for labName + perTestPrice
    const labSnap = await adminDb.collection('labProfiles').doc(labId).get();
    if (!labSnap.exists) throw new ApiError(404, 'Lab not found');
    const lab = labSnap.data()!;
    if (!lab.isVerified) throw new ApiError(400, 'Lab is not verified');

    // Read farmer profile for farmerName
    const farmerSnap = await adminDb.collection('farmerProfiles').doc(decoded.uid).get();
    if (!farmerSnap.exists) throw new ApiError(404, 'Farmer profile not found. Complete registration first.');
    const farmer = farmerSnap.data()!;

    // Write to /soilTestBookings
    const bookingRef = adminDb.collection('soilTestBookings').doc();
    await bookingRef.set({
      farmerId:             decoded.uid,
      labId,
      farmerName:           farmer.fullName,
      labName:              lab.labName,
      collectionDate:       new Date(collectionDate),
      cropType,
      landParcelDetails,
      status:               'PENDING',
      amountPaid:           0, // Payment on hold — Razorpay integration deferred
      reportConsentToMitra: Boolean(reportConsentToMitra),
      createdAt:            FieldValue.serverTimestamp(),
    });

    return Response.json(
      { bookingId: bookingRef.id, amount: lab.perTestPrice },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/soil-test/bookings]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
