// apps/admin/app/api/verify/[profileType]/[profileId]/route.ts
// Admin-only: toggle isVerified on lab or soilmitra profiles
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

const ALLOWED_TYPES = ['lab', 'soilmitra'] as const;
type ProfileType = typeof ALLOWED_TYPES[number];

const COLLECTION_MAP: Record<ProfileType, string> = {
  lab: 'labProfiles',
  soilmitra: 'soilmitraProfiles',
};

export async function PATCH(
  request: Request,
  { params }: { params: { profileType: string; profileId: string } }
) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'ADMIN') throw new ApiError(403, 'ADMIN role required');

    const profileType = params.profileType as ProfileType;
    const { profileId } = params;

    if (!ALLOWED_TYPES.includes(profileType)) {
      throw new ApiError(400, `Invalid profileType. Must be one of: ${ALLOWED_TYPES.join(', ')}`);
    }

    const body = await request.json() as { isVerified?: boolean };
    if (typeof body.isVerified !== 'boolean') {
      throw new ApiError(400, 'Missing required field: isVerified (boolean)');
    }

    const collection = COLLECTION_MAP[profileType];
    const docRef = adminDb.collection(collection).doc(profileId);
    const snap = await docRef.get();

    if (!snap.exists) throw new ApiError(404, `Profile not found in ${collection}`);

    await docRef.update({ isVerified: body.isVerified });

    return Response.json(
      { success: true, profileId, isVerified: body.isVerified },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/verify]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
