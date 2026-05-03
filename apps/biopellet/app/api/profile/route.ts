import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function PATCH(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'BIOPELLET') throw new ApiError(403, 'BIOPELLET role required');

    const body = await request.json() as {
      plantName?: string;
      state?: string;
      district?: string;
      address?: string;
      acceptedResidueTypes?: string[];
      procurementRatePerTon?: number;
    };

    const allowed: Record<string, unknown> = {};
    if (body.plantName !== undefined) allowed.plantName = String(body.plantName).trim();
    if (body.state !== undefined) allowed.state = String(body.state).trim();
    if (body.district !== undefined) allowed.district = String(body.district).trim();
    if (body.address !== undefined) allowed.address = String(body.address).trim();
    if (body.acceptedResidueTypes !== undefined && Array.isArray(body.acceptedResidueTypes)) {
      allowed.acceptedResidueTypes = body.acceptedResidueTypes.map(s => String(s).trim());
    }
    if (body.procurementRatePerTon !== undefined) {
      const rate = Number(body.procurementRatePerTon);
      if (isNaN(rate) || rate < 0) throw new ApiError(400, 'procurementRatePerTon must be a non-negative number');
      allowed.procurementRatePerTon = rate;
    }

    if (Object.keys(allowed).length === 0) {
      throw new ApiError(400, 'No valid fields provided to update');
    }

    const profileRef = adminDb.collection('biopelletProfiles').doc(decoded.uid);
    const snap = await profileRef.get();
    if (!snap.exists) throw new ApiError(404, 'Plant profile not found');

    await profileRef.update(allowed);

    return Response.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/profile]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
