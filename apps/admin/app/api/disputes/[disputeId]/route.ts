// apps/admin/app/api/disputes/[disputeId]/route.ts
// Admin: Update dispute status (OPEN → INVESTIGATING → RESOLVED)
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';
import { FieldValue } from 'firebase-admin/firestore';

export async function PATCH(
  request: Request,
  { params }: { params: { disputeId: string } }
) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'ADMIN') throw new ApiError(403, 'ADMIN role required');

    const { disputeId } = params;
    const body = await request.json() as {
      status?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
      resolutionNote?: string;
    };

    const ALLOWED_STATUSES = ['OPEN', 'INVESTIGATING', 'RESOLVED'];
    if (body.status && !ALLOWED_STATUSES.includes(body.status)) {
      throw new ApiError(400, 'Invalid status value');
    }

    const ref = adminDb.collection('disputes').doc(disputeId);
    const snap = await ref.get();
    if (!snap.exists) throw new ApiError(404, 'Dispute not found');

    const updates: Record<string, any> = { updatedAt: FieldValue.serverTimestamp() };
    if (body.status) updates.status = body.status;
    if (body.resolutionNote) updates.resolutionNote = body.resolutionNote;

    await ref.update(updates);

    return Response.json({ success: true, disputeId, ...updates }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) return Response.json({ error: err.message }, { status: err.status });
    console.error('[PATCH /api/disputes/:id]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
