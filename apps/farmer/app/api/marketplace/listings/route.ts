// apps/farmer/app/api/marketplace/listings/route.ts
// Task 4.6 — Create crop listing with fixed rate table
// Auth: FARMER role required
import { adminDb, FieldValue } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

// Fixed rate table — must match the frontend PRICING_MODEL in marketplace/list/page.tsx
const RESIDUE_BASE_RATES: Record<string, number> = {
  'paddy straw':       2500,
  'wheat straw':       2200,
  'sugarcane bagasse': 1800,
  'cotton stalks':     1600,
  'maize stalks':      1400,
  'default':           2000,
};

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'FARMER') throw new ApiError(403, 'FARMER role required');

    const body = await request.json() as {
      residueType?: string;
      quantityTons?: number;
      availableFrom?: string;
      location?: string;
    };

    const { residueType, quantityTons, availableFrom, location } = body;

    if (!residueType || !availableFrom) {
      throw new ApiError(400, 'Missing required fields: residueType, availableFrom');
    }
    if (!location) {
      throw new ApiError(400, 'Missing required field: location');
    }
    if (typeof quantityTons !== 'number' || quantityTons <= 0) {
      throw new ApiError(400, 'quantityTons must be a positive number');
    }

    // Read farmer profile for denormalized fields
    const farmerSnap = await adminDb.collection('farmerProfiles').doc(decoded.uid).get();
    if (!farmerSnap.exists) throw new ApiError(404, 'Farmer profile not found. Complete registration first.');
    const farmer = farmerSnap.data()!;

    // Fixed rate table pricing
    const baseRate = RESIDUE_BASE_RATES[residueType.toLowerCase()] ?? RESIDUE_BASE_RATES['default']!;
    const farmhithPricePerTon = baseRate;

    // Write to /cropListings
    const listingRef = adminDb.collection('cropListings').doc();
    await listingRef.set({
      farmerId:           decoded.uid,
      farmerName:         farmer.fullName ?? farmer.name ?? 'Unknown',
      farmerDistrict:     farmer.district ?? '',
      farmerState:        farmer.state ?? '',
      residueType,
      quantityTons,
      // Store location explicitly so the UI can display it
      location:           location ?? `${farmer.district ?? ''}, ${farmer.state ?? ''}`,
      // Use admin.firestore.Timestamp so formatDate() works on the client
      availableFrom:      new Date(availableFrom),
      farmhithPricePerTon,
      status:             'ACTIVE',
      createdAt:          FieldValue.serverTimestamp(),
    });

    return Response.json(
      { listingId: listingRef.id, farmhithPricePerTon },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/marketplace/listings]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
