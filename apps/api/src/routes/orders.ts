import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

export const ordersRouter = Router();

const createOrderSchema = z.object({
  listingId: z.string(),
  finalQuantityTons: z.number().positive(),
});

// GET /api/orders — role-filtered
ordersRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const { userId, role } = req.user!;
    const { status } = req.query;

    const orders = await prisma.procurementOrder.findMany({
      where: {
        ...(role === 'BIOPELLET' ? { plantId: userId } : {}),
        ...(role === 'FARMER' ? { listing: { farmerId: userId } } : {}),
        ...(status ? { status: String(status) as any } : {}),
      },
      include: {
        listing: {
          include: { farmer: { select: { id: true, farmerProfile: { select: { fullName: true } } } } },
        },
        plant: { select: { id: true, biopelletProfile: { select: { plantName: true } } } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// POST /api/orders — BIOPELLET expresses interest
ordersRouter.post('/', requireAuth, requireRole('BIOPELLET'), validate(createOrderSchema), async (req, res, next) => {
  try {
    const { listingId, finalQuantityTons } = req.body;

    const listing = await prisma.cropListing.findUnique({ where: { id: listingId } });
    if (!listing) throw new AppError(404, 'Listing not found.');
    if (listing.status !== 'ACTIVE') throw new AppError(409, 'This listing is no longer active.');

    const totalAmount = Number(listing.farmhithPricePerTon) * finalQuantityTons;

    const order = await prisma.procurementOrder.create({
      data: {
        listingId,
        plantId: req.user!.userId,
        finalQuantityTons,
        totalAmount,
      },
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
ordersRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const order = await prisma.procurementOrder.findUnique({
      where: { id: req.params.id },
      include: {
        listing: { include: { farmer: { select: { id: true, phone: true, farmerProfile: true } } } },
        plant: { select: { id: true, biopelletProfile: true } },
        payment: true,
      },
    });
    if (!order) throw new AppError(404, 'Order not found.');
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/status — FARMER confirms/cancels
ordersRouter.put('/:id/status', requireAuth, requireRole('FARMER'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['CONFIRMED', 'CANCELLED'];
    if (!valid.includes(status)) throw new AppError(400, 'Invalid status for this action.');

    const order = await prisma.procurementOrder.update({
      where: { id: req.params.id },
      data: { status },
    });

    // Mark listing as matched when confirmed
    if (status === 'CONFIRMED') {
      await prisma.cropListing.update({
        where: { id: order.listingId },
        data: { status: 'MATCHED' },
      });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});
