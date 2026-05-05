// apps/lab/app/api/reports/upload/route.ts
// Stores PDF report as base64 in Firestore — no Firebase Storage required (100% free tier).
import { adminDb, FieldValue } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

// Firestore has a 1MB document size limit.
// A typical soil test PDF is 100–400KB → base64 is ~550KB max, well within limits.
const MAX_FILE_BYTES = 900 * 1024; // 900KB safety limit

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

    if (!bookingId) {
      throw new ApiError(400, 'Missing required field: bookingId');
    }

    // Verify booking exists and belongs to this lab
    const bookingSnap = await adminDb.collection('soilTestBookings').doc(bookingId).get();
    if (!bookingSnap.exists) throw new ApiError(404, 'Booking not found');
    const booking = bookingSnap.data()!;
    if (booking.labId !== decoded.uid) {
      throw new ApiError(403, 'This booking does not belong to your lab');
    }

    // --- Handle PDF (optional) — store as base64 in Firestore ---
    let pdfBase64: string | null = null;
    let pdfFileName: string | null = null;
    let pdfMimeType: string | null = null;

    if (file && file.size > 0) {
      if (file.type && file.type !== 'application/pdf') {
        throw new ApiError(400, 'Only PDF files are accepted');
      }
      if (file.size > MAX_FILE_BYTES) {
        throw new ApiError(400, `PDF must be under 900KB. Your file is ${Math.round(file.size / 1024)}KB.`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      pdfBase64 = buffer.toString('base64');
      pdfFileName = file.name;
      pdfMimeType = file.type || 'application/pdf';
    }

    // --- Write the report to Firestore ---
    const reportData: Record<string, any> = {
      bookingId,
      testParameters: { pH: ph, nitrogen, phosphorus, potassium },
      technicianNotes,
      recommendation: technicianNotes,
      hasPdf: !!pdfBase64,
      generatedAt: new Date().toISOString(),
      uploadedAt: FieldValue.serverTimestamp(),
    };

    // Only store base64 if a PDF was provided
    if (pdfBase64) {
      reportData.pdfBase64   = pdfBase64;
      reportData.pdfFileName = pdfFileName;
      reportData.pdfMimeType = pdfMimeType;
    }

    // Write to soilReports/{bookingId} for the farmer's dashboard hook
    await adminDb.collection('soilReports').doc(bookingId).set(reportData, { merge: true });

    // Also write as a sub-document for legacy compatibility
    const reportRef = adminDb
      .collection('soilTestBookings')
      .doc(bookingId)
      .collection('reports')
      .doc();

    await reportRef.set({
      testParameters: { pH: ph, nitrogen, phosphorus, potassium },
      technicianNotes,
      hasPdf: !!pdfBase64,
      uploadedAt: FieldValue.serverTimestamp(),
    });

    // Update booking status → COMPLETED
    await adminDb.collection('soilTestBookings').doc(bookingId).update({
      status: 'COMPLETED',
      completedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({
      success: true,
      reportId: reportRef.id,
      hasPdf: !!pdfBase64,
      message: 'Report submitted successfully.',
    }, { status: 201 });

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
