// apps/biopellet/app/api/orders/route.ts
// Task 4.7 — Biopellet plant places a procurement order on a crop listing
// Auth: BIOPELLET role required
import { adminDb, FieldValue } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'BIOPELLET') throw new ApiError(403, 'BIOPELLET role required');

    const body = await request.json() as {
      listingId?:        string;
      finalQuantityTons?: number;
    };

    const { listingId, finalQuantityTons } = body;

    if (!listingId) throw new ApiError(400, 'Missing required field: listingId');
    if (typeof finalQuantityTons !== 'number' || finalQuantityTons <= 0) {
      throw new ApiError(400, 'finalQuantityTons must be a positive number');
    }

    // Read crop listing
    const listingSnap = await adminDb.collection('cropListings').doc(listingId).get();
    if (!listingSnap.exists) throw new ApiError(404, 'Crop listing not found');
    const listing = listingSnap.data()!;

    if (listing.status !== 'ACTIVE') throw new ApiError(400, `Listing is no longer active (status: ${listing.status})`);
    if (finalQuantityTons > listing.quantityTons) {
      throw new ApiError(400, `Requested ${finalQuantityTons}t exceeds available ${listing.quantityTons}t`);
    }

    // Read biopellet plant profile for plantName
    const plantSnap = await adminDb.collection('biopelletProfiles').doc(decoded.uid).get();
    if (!plantSnap.exists) throw new ApiError(404, 'Plant profile not found. Complete registration first.');
    const plant = plantSnap.data()!;

    const totalAmount = Math.round(finalQuantityTons * listing.farmhithPricePerTon);

    // Write to /procurementOrders
    const orderRef = adminDb.collection('procurementOrders').doc();
    await orderRef.set({
      listingId,
      listingResidueType: listing.residueType,
      plantId:            decoded.uid,
      plantName:          plant.plantName,
      farmerId:           listing.farmerId,
      farmerName:         listing.farmerName,
      finalQuantityTons,
      totalAmount,
      status:             'INTERESTED',
      paymentId:          null,
      createdAt:          FieldValue.serverTimestamp(),
    });

    // Mark listing as MATCHED so it doesn't accept duplicate orders
    await adminDb.collection('cropListings').doc(listingId).update({ status: 'MATCHED' });

    return Response.json({ orderId: orderRef.id, totalAmount }, { status: 201 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/orders]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
