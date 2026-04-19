// apps/farmer/app/api/webhooks/razorpay/route.ts
// Task 5.4 — Razorpay webhook handler
// CRITICAL: Raw body must be read BEFORE any JSON parse for signature verification.
// Always returns 200 — Razorpay retries on non-200.
import { adminDb } from '@farmhith/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { createHmac } from 'crypto';

// Maps serviceType note → Firestore collection
const SERVICE_COLLECTION: Record<string, string> = {
  SOIL_TEST:         'soilTestBookings',
  MITRA_SESSION:     'mitraBookings',
  CROP_PROCUREMENT:  'procurementOrders',
};

export async function POST(request: Request) {
  // STEP 1: Read raw body BEFORE any parsing
  const rawBody  = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Webhook] RAZORPAY_WEBHOOK_SECRET is not set');
    // Still return 200 to prevent Razorpay from flooding with retries
    return new Response('OK', { status: 200 });
  }

  // STEP 2: Verify webhook signature
  const expectedSig = createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSig !== signature) {
    console.warn('[Webhook] Signature mismatch — possible replay attack');
    return new Response('Bad signature', { status: 400 });
  }

  // STEP 3: Parse event safely
  let event: { event: string; payload: Record<string, any> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  // STEP 4: Handle payment.captured
  try {
    if (event.event === 'payment.captured') {
      const entity = event.payload?.payment?.entity;
      if (!entity) {
        console.warn('[Webhook] payment.captured missing entity');
        return new Response('OK', { status: 200 });
      }

      const {
        id:       razorpayPaymentId,
        order_id: razorpayOrderId,
        amount,   // paise
        notes,
      } = entity as {
        id: string;
        order_id: string;
        amount: number;
        notes?: Record<string, string>;
      };

      const serviceType  = notes?.serviceType;
      const serviceRefId = notes?.serviceRefId;
      const payerUid     = notes?.payerUid ?? '';

      if (serviceType && serviceRefId) {
        // Upsert payment document (may already exist from /verify endpoint)
        const existingSnap = await adminDb
          .collection('payments')
          .where('razorpayPaymentId', '==', razorpayPaymentId)
          .limit(1)
          .get();

        if (existingSnap.empty) {
          // Create payment document (fallback — /verify wasn't called first)
          await adminDb.collection('payments').add({
            razorpayOrderId,
            razorpayPaymentId,
            payerUid,
            payeeUid:          '',
            grossAmount:       Math.round(amount / 100),  // convert paise → rupees
            platformCommission: 0,
            netPayout:         0,
            serviceType,
            serviceRefId,
            status:            'CAPTURED',
            createdAt:         FieldValue.serverTimestamp(),
          });
        } else {
          // Mark existing payment as CAPTURED
          await existingSnap.docs[0].ref.update({ status: 'CAPTURED' });
        }

        // Update booking/order status if still PENDING
        const collection = SERVICE_COLLECTION[serviceType];
        if (collection) {
          const docRef = adminDb.collection(collection).doc(serviceRefId);
          const snap   = await docRef.get();
          if (snap.exists && snap.data()!.status === 'PENDING') {
            await docRef.update({ status: 'CONFIRMED' });
          }
        }
      }
    }
    // Add more event handlers here if needed (e.g. payment.failed, refund.created)
  } catch (err) {
    // Log error but ALWAYS return 200 — Razorpay retries on non-200
    console.error('[Webhook] Handler error:', err);
  }

  return new Response('OK', { status: 200 });
}
