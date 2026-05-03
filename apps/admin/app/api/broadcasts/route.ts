// apps/admin/app/api/broadcasts/route.ts
// Admin: Send platform broadcast (writes to Firestore notifications collection)
import { adminDb, FieldValue } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

const VALID_TARGETS = ['ALL_USERS', 'FARMERS', 'SOILMITRAS', 'LABS', 'BIOPELLET'] as const;
type TargetAudience = typeof VALID_TARGETS[number];

// Maps target → Firestore role string used in /users collection
const TARGET_ROLE_MAP: Record<TargetAudience, string | null> = {
  ALL_USERS:  null,          // no filter — all users
  FARMERS:    'FARMER',
  SOILMITRAS: 'SOILMITRA',
  LABS:       'LAB',
  BIOPELLET:  'BIOPELLET',
};

export async function GET(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'ADMIN') throw new ApiError(403, 'ADMIN role required');

    const snap = await adminDb
      .collection('broadcasts')
      .orderBy('sentAt', 'desc')
      .limit(50)
      .get();

    const broadcasts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return Response.json({ broadcasts }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) return Response.json({ error: err.message }, { status: err.status });
    console.error('[GET /api/broadcasts]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'ADMIN') throw new ApiError(403, 'ADMIN role required');

    const body = await request.json() as {
      title?: string;
      message?: string;
      targetAudience?: string;
    };

    const { title, message, targetAudience } = body;
    if (!title || !message || !targetAudience) {
      throw new ApiError(400, 'Missing required fields: title, message, targetAudience');
    }
    if (!VALID_TARGETS.includes(targetAudience as TargetAudience)) {
      throw new ApiError(400, `Invalid targetAudience. Must be one of: ${VALID_TARGETS.join(', ')}`);
    }

    const target = targetAudience as TargetAudience;
    const roleFilter = TARGET_ROLE_MAP[target];

    // 1. Write broadcast record
    const broadcastRef = adminDb.collection('broadcasts').doc();
    await broadcastRef.set({
      title,
      message,
      targetAudience: target,
      sentByUid: decoded.uid,
      sentAt: FieldValue.serverTimestamp(),
      status: 'SENT',
    });

    // 2. Fan-out: write individual notifications per matched user
    //    (batch-limited to 500 Firestore writes per batch)
    let usersQuery = adminDb.collection('users') as FirebaseFirestore.Query;
    if (roleFilter) {
      usersQuery = usersQuery.where('role', '==', roleFilter);
    }

    const usersSnap = await usersQuery.get();
    const BATCH_SIZE = 400;
    let batch = adminDb.batch();
    let count = 0;

    for (const userDoc of usersSnap.docs) {
      const notifRef = adminDb.collection('notifications').doc();
      batch.set(notifRef, {
        userId:    userDoc.id,
        title,
        message,
        type:      'info',
        read:      false,
        broadcastId: broadcastRef.id,
        createdAt: FieldValue.serverTimestamp(),
      });
      count++;
      if (count % BATCH_SIZE === 0) {
        await batch.commit();
        batch = adminDb.batch();
      }
    }
    if (count % BATCH_SIZE !== 0) await batch.commit();

    return Response.json(
      { broadcastId: broadcastRef.id, notificationsSent: count },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof ApiError) return Response.json({ error: err.message }, { status: err.status });
    console.error('[POST /api/broadcasts]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
