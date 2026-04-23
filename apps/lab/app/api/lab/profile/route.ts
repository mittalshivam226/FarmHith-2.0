// apps/lab/app/api/lab/profile/route.ts
// PATCH — Lab updates their own profile
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function PATCH(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'LAB') throw new ApiError(403, 'LAB role required');

    const body = await request.json() as {
      labName?: string;
      address?: string;
      perTestPrice?: number;
      dailyCapacity?: number;
    };

    const allowed: Record<string, unknown> = {};
    if (body.labName !== undefined) allowed.labName = String(body.labName).trim();
    if (body.address !== undefined) allowed.address = String(body.address).trim();
    if (body.perTestPrice !== undefined) {
      const price = Number(body.perTestPrice);
      if (isNaN(price) || price < 0) throw new ApiError(400, 'perTestPrice must be a non-negative number');
      allowed.perTestPrice = price;
    }
    if (body.dailyCapacity !== undefined) {
      const cap = Number(body.dailyCapacity);
      if (isNaN(cap) || cap < 1) throw new ApiError(400, 'dailyCapacity must be at least 1');
      allowed.dailyCapacity = Math.floor(cap);
    }

    if (Object.keys(allowed).length === 0) {
      throw new ApiError(400, 'No valid fields provided to update');
    }

    const labRef = adminDb.collection('labProfiles').doc(decoded.uid);
    const snap = await labRef.get();
    if (!snap.exists) throw new ApiError(404, 'Lab profile not found');

    await labRef.update(allowed);

    return Response.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/lab/profile]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
