// apps/lab/app/api/bookings/[bookingId]/route.ts
// Task 4.3 — Lab accepts or cancels a soil test booking
// Auth: LAB role required
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

const ALLOWED_STATUSES = ['ACCEPTED', 'CANCELLED', 'IN_PROGRESS'] as const;
type AllowedStatus = typeof ALLOWED_STATUSES[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'LAB') throw new ApiError(403, 'LAB role required');

    const { bookingId } = await params;
    const body = await request.json() as { status?: AllowedStatus };
    const { status } = body;

    if (!status || !(ALLOWED_STATUSES as readonly string[]).includes(status)) {
      throw new ApiError(400, `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}`);
    }

    // Verify booking exists and belongs to this lab
    const bookingSnap = await adminDb.collection('soilTestBookings').doc(bookingId).get();
    if (!bookingSnap.exists) throw new ApiError(404, 'Booking not found');
    const booking = bookingSnap.data()!;

    if (booking.labId !== decoded.uid) {
      throw new ApiError(403, 'This booking does not belong to your lab');
    }

    await adminDb.collection('soilTestBookings').doc(bookingId).update({ status });

    return Response.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/bookings/:bookingId]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
