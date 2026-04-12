import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const paymentsRouter = Router();

// GET /api/payments — role-filtered ledger
paymentsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const { userId, role } = req.user!;

    const payments = await prisma.payment.findMany({
      where: role === 'ADMIN'
        ? {}
        : { OR: [{ payerId: userId }, { payeeId: userId }] },
      include: {
        payer: { select: { id: true, role: true, farmerProfile: { select: { fullName: true } }, biopelletProfile: { select: { plantName: true } } } },
        payee: { select: { id: true, role: true, labProfile: { select: { labName: true } }, soilmitraProfile: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch (err) {
    next(err);
  }
});

// GET /api/payments/:id
paymentsRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        payer: { select: { id: true, phone: true, role: true } },
        payee: { select: { id: true, phone: true, role: true } },
        soilTestBooking: true,
        mitraBooking: true,
        procurementOrder: true,
      },
    });
    if (!payment) throw new AppError(404, 'Payment not found.');
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/webhook — Razorpay webhook (stub for future)
paymentsRouter.post('/webhook', async (req, res) => {
  // TODO: Verify Razorpay webhook signature and update payment status
  console.log('[Webhook] Payment event received:', req.body?.event);
  res.json({ received: true });
});
