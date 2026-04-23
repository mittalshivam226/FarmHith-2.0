// apps/farmer/app/api/farmer/profile/route.ts
// PATCH — Farmer updates their own profile
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function PATCH(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'FARMER') throw new ApiError(403, 'FARMER role required');

    const body = await request.json() as {
      fullName?: string;
      state?: string;
      district?: string;
      totalLandAcres?: number;
      primaryCrop?: string;
    };

    // Only allow updating specific fields
    const allowed: Record<string, unknown> = {};
    if (body.fullName !== undefined) allowed.fullName = String(body.fullName).trim();
    if (body.state !== undefined) allowed.state = String(body.state).trim();
    if (body.district !== undefined) allowed.district = String(body.district).trim();
    if (body.totalLandAcres !== undefined) {
      const acres = Number(body.totalLandAcres);
      if (isNaN(acres) || acres < 0) throw new ApiError(400, 'totalLandAcres must be a non-negative number');
      allowed.totalLandAcres = acres;
    }
    if (body.primaryCrop !== undefined) allowed.primaryCrop = String(body.primaryCrop).trim();

    if (Object.keys(allowed).length === 0) {
      throw new ApiError(400, 'No valid fields provided to update');
    }

    const farmerRef = adminDb.collection('farmerProfiles').doc(decoded.uid);
    const snap = await farmerRef.get();
    if (!snap.exists) throw new ApiError(404, 'Farmer profile not found');

    await farmerRef.update(allowed);

    return Response.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/farmer/profile]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
