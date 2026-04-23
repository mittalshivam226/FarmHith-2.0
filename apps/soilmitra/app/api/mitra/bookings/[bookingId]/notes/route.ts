// apps/soilmitra/app/api/mitra/bookings/[bookingId]/notes/route.ts
// PATCH — Soil-Mitra adds consultation notes after a completed session
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'SOILMITRA') throw new ApiError(403, 'SOILMITRA role required');

    const { bookingId } = await params;
    const body = await request.json() as { mitraNotes?: string };

    if (!body.mitraNotes || !body.mitraNotes.trim()) {
      throw new ApiError(400, 'mitraNotes is required and cannot be empty');
    }

    // Verify booking exists and belongs to this mitra
    const bookingSnap = await adminDb.collection('mitraBookings').doc(bookingId).get();
    if (!bookingSnap.exists) throw new ApiError(404, 'Booking not found');

    const booking = bookingSnap.data()!;
    if (booking.mitraId !== decoded.uid) {
      throw new ApiError(403, 'This booking does not belong to you');
    }
    if (booking.status !== 'COMPLETED') {
      throw new ApiError(400, 'Notes can only be added to completed sessions');
    }

    await adminDb.collection('mitraBookings').doc(bookingId).update({
      mitraNotes: body.mitraNotes.trim(),
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/mitra/bookings/:bookingId/notes]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
