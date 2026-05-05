// apps/lab/app/api/reports/upload/route.ts
// Task 4.2 — Lab uploads soil report PDF to Firebase Storage
// Auth: LAB role required
import { adminDb, adminStorage, FieldValue } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';



export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    if (decoded.role !== 'LAB') throw new ApiError(403, 'LAB role required');

    const formData = await request.formData();

    const bookingId       = formData.get('bookingId') as string | null;
    const file            = formData.get('file') as File | null;
    const technicianNotes = (formData.get('technicianNotes') as string) ?? '';
    const ph              = parseFloat(formData.get('ph') as string) || 0;
    const nitrogen        = parseFloat(formData.get('nitrogen') as string) || 0;
    const phosphorus      = parseFloat(formData.get('phosphorus') as string) || 0;
    const potassium       = parseFloat(formData.get('potassium') as string) || 0;

    if (!bookingId || !file) {
      throw new ApiError(400, 'Missing required fields: bookingId, file');
    }

    // Verify file is a PDF
    if (file.type && file.type !== 'application/pdf') {
      throw new ApiError(400, 'Only PDF files are accepted');
    }

    // Verify booking exists and belongs to this lab
    const bookingSnap = await adminDb.collection('soilTestBookings').doc(bookingId).get();
    if (!bookingSnap.exists) throw new ApiError(404, 'Booking not found');
    const booking = bookingSnap.data()!;
    if (booking.labId !== decoded.uid) {
      throw new ApiError(403, 'This booking does not belong to your lab');
    }

    // --- Upload PDF to Firebase Storage ---
    // Use a crypto random token so the URL never expires (same as Firebase Client SDK download URLs).
    // This avoids calling makePublic() which requires storage.buckets.setIamPolicy IAM permission.
    const downloadToken = crypto.randomUUID();

    // Strip surrounding quotes that .env.local parsing may inject, then use the bucket directly.
    // firebase-admin v12+ supports both *.appspot.com and *.firebasestorage.app bucket names.
    const bucketName = (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '').replace(/^"+|"+$/g, '');
    console.log('[upload] Resolved storage bucket:', JSON.stringify(bucketName));
    if (!bucketName) throw new ApiError(500, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set');
    const bucket = adminStorage.bucket(bucketName);
    // Sanitise filename to remove spaces / special chars that break Storage paths
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const destPath = `reports/${bookingId}/${safeName}`;
    const fileRef  = bucket.file(destPath);
    const buffer   = Buffer.from(await file.arrayBuffer());

    await fileRef.save(buffer, {
      metadata: {
        contentType: 'application/pdf',
        // Setting firebaseStorageDownloadTokens allows the standard
        // firebasestorage.googleapis.com URL to be used without makePublic().
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    // Construct the permanent Firebase Storage download URL
    const encodedPath = encodeURIComponent(destPath);
    const reportUrl   = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`;

    // Write report sub-document under booking
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

    // Write to top-level soilReports/{bookingId} so farmer's useSoilReport hook can read it
    await adminDb.collection('soilReports').doc(bookingId).set({
      bookingId,
      reportUrl,
      testParameters: { ph, nitrogen, phosphorus, potassium },
      technicianNotes,
      recommendation: technicianNotes,
      generatedAt: new Date().toISOString(),
      uploadedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    // Update booking status → COMPLETED
    await adminDb.collection('soilTestBookings').doc(bookingId).update({
      status: 'COMPLETED',
      completedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({ reportUrl, reportId: reportRef.id }, { status: 201 });

  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/reports/upload]', err);
    return Response.json(
      { error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
