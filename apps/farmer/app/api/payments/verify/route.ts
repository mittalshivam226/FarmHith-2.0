// apps/farmer/app/api/payments/verify/route.ts
// Task 5.3 — Verify Razorpay signature + write payment + update booking
// Auth: Any authenticated user
import { adminDb } from '@farmhith/firebase/admin';
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';
import { FieldValue } from 'firebase-admin/firestore';
import { createHmac } from 'crypto';

// Platform commission rates per service type
const COMMISSION_RATES: Record<string, number> = {
  SOIL_TEST:         0.12,   // 12%
  MITRA_SESSION:     0.18,   // 18%
  CROP_PROCUREMENT:  0.05,   // 5%
};

// Maps serviceType → Firestore collection name
const SERVICE_COLLECTION: Record<string, string> = {
  SOIL_TEST:         'soilTestBookings',
  MITRA_SESSION:     'mitraBookings',
  CROP_PROCUREMENT:  'procurementOrders',
};

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);

    const body = await request.json() as {
      razorpayOrderId?:   string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
      serviceType?:       string;
      serviceRefId?:      string;
      amount?:            number;  // in rupees
      payeeUid?:          string;  // recipient (lab / mitra / farmer)
    };

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      serviceType,
      serviceRefId,
      amount = 0,
      payeeUid = '',
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !serviceType || !serviceRefId) {
      throw new ApiError(400, 'Missing payment verification fields');
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new ApiError(500, 'Payment service not configured');

    // Verify HMAC-SHA256 signature
    const expectedSig = createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSig !== razorpaySignature) {
      throw new ApiError(400, 'Invalid payment signature');
    }

    // Calculate commission
    const commissionRate      = COMMISSION_RATES[serviceType] ?? 0.10;
    const grossAmount         = amount;
    const platformCommission  = Math.round(grossAmount * commissionRate);
    const netPayout           = grossAmount - platformCommission;

    // Write payment document
    const paymentRef = adminDb.collection('payments').doc();
    await paymentRef.set({
      razorpayOrderId,
      razorpayPaymentId,
      payerUid:           decoded.uid,
      payeeUid,
      grossAmount,
      platformCommission,
      netPayout,
      serviceType,
      serviceRefId,
      status:             'CAPTURED',
      createdAt:          FieldValue.serverTimestamp(),
    });

    // Update the referenced booking / order to CONFIRMED
    const collection = SERVICE_COLLECTION[serviceType];
    if (collection) {
      await adminDb.collection(collection).doc(serviceRefId).update({
        status:    'CONFIRMED',
        paymentId: paymentRef.id,
      });
    }

    return Response.json({ success: true, paymentId: paymentRef.id }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/payments/verify]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
