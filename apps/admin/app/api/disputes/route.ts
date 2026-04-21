// apps/admin/app/api/disputes/route.ts
// Admin: Create / read disputes
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'ADMIN') throw new ApiError(403, 'ADMIN role required');

    const snap = await adminDb
      .collection('disputes')
      .orderBy('createdAt', 'desc')
      .get();

    const disputes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return Response.json({ disputes }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) return Response.json({ error: err.message }, { status: err.status });
    console.error('[GET /api/disputes]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'ADMIN') throw new ApiError(403, 'ADMIN role required');

    const body = await request.json() as {
      type?: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      raisedByUid?: string;
      raisedByName?: string;
      againstUid?: string;
      againstName?: string;
      description?: string;
    };

    const { type, priority, raisedByName, againstName, description } = body;
    if (!type || !raisedByName) throw new ApiError(400, 'Missing required fields: type, raisedByName');

    const ref = adminDb.collection('disputes').doc();
    await ref.set({
      type,
      priority: priority ?? 'MEDIUM',
      raisedByUid: body.raisedByUid ?? '',
      raisedByName,
      againstUid: body.againstUid ?? '',
      againstName: againstName ?? '',
      description: description ?? '',
      status: 'OPEN',
      createdAt: FieldValue.serverTimestamp(),
    });

    return Response.json({ disputeId: ref.id }, { status: 201 });
  } catch (err: any) {
    if (err instanceof ApiError) return Response.json({ error: err.message }, { status: err.status });
    console.error('[POST /api/disputes]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
