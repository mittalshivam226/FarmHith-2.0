// apps/farmer/app/api/mitra/create-room/route.ts
// Task 4.5 — Generate Daily.co video room after payment confirmed
// Auth: FARMER role required
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'FARMER') throw new ApiError(403, 'FARMER role required');

    const body = await request.json() as { bookingId?: string };
    const { bookingId } = body;
    if (!bookingId) throw new ApiError(400, 'Missing required field: bookingId');

    // Verify booking belongs to this farmer
    const bookingSnap = await adminDb.collection('mitraBookings').doc(bookingId).get();
    if (!bookingSnap.exists) throw new ApiError(404, 'Booking not found');
    const booking = bookingSnap.data()!;

    if (booking.farmerId !== decoded.uid) {
      throw new ApiError(403, 'This booking does not belong to you');
    }

    // Return existing room URL if already created (idempotent)
    if (booking.videoRoomUrl) {
      return Response.json({ videoRoomUrl: booking.videoRoomUrl }, { status: 200 });
    }

    const dailyApiKey = process.env.DAILY_API_KEY;
    if (!dailyApiKey) throw new ApiError(500, 'Video room service not configured (DAILY_API_KEY missing)');

    // Call Daily.co REST API
    const dailyRes = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${dailyApiKey}`,
      },
      body: JSON.stringify({
        name: `farmhith-${bookingId}`,
        properties: {
          // Room expires 4 hours after creation
          exp:             Math.floor(Date.now() / 1000) + 60 * 60 * 4,
          enable_chat:     true,
          enable_knocking: false,
          max_participants: 2,
        },
      }),
    });

    if (!dailyRes.ok) {
      const errText = await dailyRes.text();
      console.error('[Daily.co] create room error:', errText);
      throw new ApiError(502, 'Failed to create video room');
    }

    const { url: videoRoomUrl } = await dailyRes.json() as { url: string };

    // Persist videoRoomUrl on the booking
    await adminDb.collection('mitraBookings').doc(bookingId).update({ videoRoomUrl });

    return Response.json({ videoRoomUrl }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/mitra/create-room]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
