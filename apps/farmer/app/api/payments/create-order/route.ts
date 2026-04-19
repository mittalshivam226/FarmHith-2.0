// apps/farmer/app/api/payments/create-order/route.ts
// Task 5.2 — Create Razorpay payment order (server-side)
// Auth: Any authenticated user
import { verifyToken, ApiError } from '@farmhith/firebase/verifyToken';

export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    // Any authenticated user can create an order

    const body = await request.json() as {
      amount?: number;         // in rupees
      serviceType?: string;
      serviceRefId?: string;
    };

    const { amount, serviceType, serviceRefId } = body;

    if (!amount || !serviceType || !serviceRefId) {
      throw new ApiError(400, 'Missing required fields: amount, serviceType, serviceRefId');
    }
    if (typeof amount !== 'number' || amount <= 0) {
      throw new ApiError(400, 'amount must be a positive number (in rupees)');
    }

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new ApiError(500, 'Payment service not configured');

    // Create Razorpay order via their REST API
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount:   Math.round(amount * 100),  // Razorpay expects paise
        currency: 'INR',
        receipt:  `rcpt_${serviceRefId}`,
        notes: { serviceType, serviceRefId, payerUid: decoded.uid },
      }),
    });

    if (!rzpRes.ok) {
      const errText = await rzpRes.text();
      console.error('[Razorpay create-order]', errText);
      throw new ApiError(502, 'Failed to create Razorpay order');
    }

    const data = await rzpRes.json() as { id: string; amount: number; currency: string };

    return Response.json({
      razorpayOrderId: data.id,
      amount:          data.amount,   // paise
      currency:        data.currency,
    }, { status: 201 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/payments/create-order]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
