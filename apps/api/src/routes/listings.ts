import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

export const listingsRouter = Router();

const createListingSchema = z.object({
  residueType: z.string().min(1),
  quantityTons: z.number().positive(),
  location: z.string().min(1),
  availableFrom: z.string(),
  farmhithPricePerTon: z.number().positive(),
  marketPricePerTon: z.number().positive().optional(),
});

// GET /api/listings — public browse
listingsRouter.get('/', async (req, res, next) => {
  try {
    const { residueType, minQuantity, state } = req.query;

    const listings = await prisma.cropListing.findMany({
      where: {
        status: 'ACTIVE',
        ...(residueType ? { residueType: String(residueType) } : {}),
        ...(minQuantity ? { quantityTons: { gte: parseFloat(String(minQuantity)) } } : {}),
        ...(state ? { location: { contains: String(state), mode: 'insensitive' } } : {}),
      },
      include: {
        farmer: { select: { id: true, farmerProfile: { select: { fullName: true, district: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings);
  } catch (err) {
    next(err);
  }
});

// POST /api/listings — FARMER creates
listingsRouter.post('/', requireAuth, requireRole('FARMER'), validate(createListingSchema), async (req, res, next) => {
  try {
    const listing = await prisma.cropListing.create({
      data: {
        farmerId: req.user!.userId,
        ...req.body,
        availableFrom: new Date(req.body.availableFrom),
      },
    });
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
});

// GET /api/listings/:id
listingsRouter.get('/:id', async (req, res, next) => {
  try {
    const listing = await prisma.cropListing.findUnique({
      where: { id: req.params.id },
      include: {
        farmer: { select: { id: true, phone: true, farmerProfile: true } },
        orders: { select: { id: true, status: true, plant: { select: { biopelletProfile: { select: { plantName: true } } } } } },
      },
    });
    if (!listing) throw new AppError(404, 'Listing not found.');
    res.json(listing);
  } catch (err) {
    next(err);
  }
});

// PUT /api/listings/:id/status — FARMER or ADMIN
listingsRouter.put('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['ACTIVE', 'MATCHED', 'SOLD', 'EXPIRED'];
    if (!valid.includes(status)) throw new AppError(400, 'Invalid status.');

    const listing = await prisma.cropListing.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(listing);
  } catch (err) {
    next(err);
  }
});
