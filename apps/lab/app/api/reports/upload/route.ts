// apps/lab/app/api/reports/upload/route.ts
// Task 4.2 — Lab uploads soil report PDF to Firebase Storage
// Auth: LAB role required
import { adminDb, adminStorage } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'LAB') throw new ApiError(403, 'LAB role required');

    const formData = await request.formData();

    const bookingId      = formData.get('bookingId') as string | null;
    const file           = formData.get('file') as File | null;
    const technicianNotes = (formData.get('technicianNotes') as string) ?? '';
    const ph         = parseFloat(formData.get('ph') as string) || 0;
    const nitrogen   = parseFloat(formData.get('nitrogen') as string) || 0;
    const phosphorus = parseFloat(formData.get('phosphorus') as string) || 0;
    const potassium  = parseFloat(formData.get('potassium') as string) || 0;

    if (!bookingId || !file) {
      throw new ApiError(400, 'Missing required fields: bookingId, file');
    }

    // Verify booking exists and belongs to this lab
    const bookingSnap = await adminDb.collection('soilTestBookings').doc(bookingId).get();
    if (!bookingSnap.exists) throw new ApiError(404, 'Booking not found');
    const booking = bookingSnap.data()!;
    if (booking.labId !== decoded.uid) throw new ApiError(403, 'This booking does not belong to your lab');

    // Upload PDF to Firebase Storage: reports/{bookingId}/{filename}
    const bucket   = adminStorage.bucket();
    const destPath = `reports/${bookingId}/${file.name}`;
    const fileRef  = bucket.file(destPath);
    const buffer   = Buffer.from(await file.arrayBuffer());

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || 'application/pdf',
      },
    });

    // Make file publicly readable
    await fileRef.makePublic();
    const reportUrl = `https://storage.googleapis.com/${bucket.name}/${destPath}`;

    // Write report sub-document
    const reportRef = adminDb
      .collection('soilTestBookings')
      .doc(bookingId)
      .collection('reports')
      .doc();

    await reportRef.set({
      reportUrl,
      testParameters: { pH: ph, nitrogen, phosphorus, potassium },
      technicianNotes,
      uploadedAt: FieldValue.serverTimestamp(),
    });

    // Update parent booking status → COMPLETED
    await adminDb.collection('soilTestBookings').doc(bookingId).update({
      status: 'COMPLETED',
    });

    return Response.json({ reportUrl, reportId: reportRef.id }, { status: 201 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/reports/upload]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
