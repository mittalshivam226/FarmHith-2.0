import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

export const soilTestsRouter = Router();

const createBookingSchema = z.object({
  labId: z.string(),
  cropType: z.string().min(1),
  landParcelDetails: z.string().min(1),
  collectionDate: z.string().datetime({ offset: true }).or(z.string().date()),
});

const reportSchema = z.object({
  nitrogen: z.number().positive(),
  phosphorus: z.number().positive(),
  potassium: z.number().positive(),
  ph: z.number().min(0).max(14),
  moisture: z.number().positive().optional(),
  recommendation: z.string().min(10),
});

// GET /api/soil-tests — list, filtered by role
soilTestsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const { userId, role } = req.user!;
    const { status } = req.query;

    const where = {
      ...(role === 'FARMER' ? { farmerId: userId } : {}),
      ...(role === 'LAB' ? { labId: userId } : {}),
      ...(status ? { status: String(status) as any } : {}),
    };

    const bookings = await prisma.soilTestBooking.findMany({
      where,
      include: {
        farmer: { select: { id: true, phone: true, farmerProfile: { select: { fullName: true } } } },
        lab: { select: { id: true, labProfile: { select: { labName: true } } } },
        report: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// POST /api/soil-tests — create booking (FARMER)
soilTestsRouter.post('/', requireAuth, requireRole('FARMER'), validate(createBookingSchema), async (req, res, next) => {
  try {
    const { labId, cropType, landParcelDetails, collectionDate } = req.body;

    const lab = await prisma.labProfile.findFirst({ where: { userId: labId } });
    if (!lab) throw new AppError(404, 'Lab not found.');

    const booking = await prisma.soilTestBooking.create({
      data: {
        farmerId: req.user!.userId,
        labId,
        cropType,
        landParcelDetails,
        collectionDate: new Date(collectionDate),
        amountPaid: lab.perTestPrice,
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// GET /api/soil-tests/:id
soilTestsRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const booking = await prisma.soilTestBooking.findUnique({
      where: { id: req.params.id },
      include: {
        farmer: { select: { id: true, phone: true, farmerProfile: { select: { fullName: true, state: true, district: true } } } },
        lab: { select: { id: true, labProfile: { select: { labName: true, address: true } } } },
        report: true,
        payment: true,
      },
    });
    if (!booking) throw new AppError(404, 'Booking not found.');
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// PUT /api/soil-tests/:id/status — (LAB)
soilTestsRouter.put('/:id/status', requireAuth, requireRole('LAB'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const validTransitions = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    if (!validTransitions.includes(status)) {
      throw new AppError(400, `Invalid status. Must be one of: ${validTransitions.join(', ')}`);
    }

    const booking = await prisma.soilTestBooking.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// POST /api/soil-tests/:id/report — upload test results (LAB)
soilTestsRouter.post('/:id/report', requireAuth, requireRole('LAB'), validate(reportSchema), async (req, res, next) => {
  try {
    const { nitrogen, phosphorus, potassium, ph, moisture, recommendation } = req.body;

    const booking = await prisma.soilTestBooking.findUnique({ where: { id: req.params.id } });
    if (!booking) throw new AppError(404, 'Booking not found.');
    if (booking.labId !== req.user!.userId) throw new AppError(403, 'This booking does not belong to your lab.');

    const [report] = await prisma.$transaction([
      prisma.soilReport.create({
        data: { bookingId: req.params.id, nitrogen, phosphorus, potassium, ph, moisture, recommendation },
      }),
      prisma.soilTestBooking.update({
        where: { id: req.params.id },
        data: { status: 'COMPLETED' },
      }),
    ]);

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
});
