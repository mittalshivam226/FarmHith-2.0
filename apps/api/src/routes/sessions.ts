import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

export const sessionsRouter = Router();

const createSessionSchema = z.object({
  mitraId: z.string(),
  sessionDatetime: z.string(),
  durationMinutes: z.number().int().min(15).default(30),
  cropType: z.string().optional(),
  notes: z.string().optional(),
  soilReportId: z.string().optional(),
});

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

// GET /api/sessions
sessionsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const { userId, role } = req.user!;
    const { status } = req.query;

    const sessions = await prisma.mitraBooking.findMany({
      where: {
        ...(role === 'FARMER' ? { farmerId: userId } : {}),
        ...(role === 'SOILMITRA' ? { mitraId: userId } : {}),
        ...(status ? { status: String(status) as any } : {}),
      },
      include: {
        farmer: { select: { id: true, farmerProfile: { select: { fullName: true } } } },
        mitra: { select: { id: true, soilmitraProfile: { select: { fullName: true } } } },
        payment: true,
      },
      orderBy: { sessionDatetime: 'asc' },
    });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions — FARMER books
sessionsRouter.post('/', requireAuth, requireRole('FARMER'), validate(createSessionSchema), async (req, res, next) => {
  try {
    const { mitraId, sessionDatetime, durationMinutes, cropType, notes, soilReportId } = req.body;

    const mitraProfile = await prisma.soilmitraProfile.findFirst({ where: { userId: mitraId } });
    if (!mitraProfile) throw new AppError(404, 'Soil-Mitra not found.');

    const fee = Number(mitraProfile.sessionFee) * (durationMinutes / 30);

    const session = await prisma.mitraBooking.create({
      data: {
        farmerId: req.user!.userId,
        mitraId,
        sessionDatetime: new Date(sessionDatetime),
        durationMinutes,
        cropType,
        notes,
        soilReportId,
        amountPaid: fee,
      },
    });
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

// GET /api/sessions/:id
sessionsRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const session = await prisma.mitraBooking.findUnique({
      where: { id: req.params.id },
      include: {
        farmer: { select: { id: true, phone: true, farmerProfile: true } },
        mitra: { select: { id: true, soilmitraProfile: true } },
        payment: true,
      },
    });
    if (!session) throw new AppError(404, 'Session not found.');
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// PUT /api/sessions/:id/status — SOILMITRA confirms/completes
sessionsRouter.put('/:id/status', requireAuth, requireRole('SOILMITRA'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!valid.includes(status)) throw new AppError(400, 'Invalid status.');

    const session = await prisma.mitraBooking.update({
      where: { id: req.params.id },
      data: { status },
    });

    // Update mitra's total session count on completion
    if (status === 'COMPLETED') {
      await prisma.soilmitraProfile.updateMany({
        where: { userId: session.mitraId },
        data: { totalSessions: { increment: 1 } },
      });
    }

    res.json(session);
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions/:id/rating — FARMER rates
sessionsRouter.post('/:id/rating', requireAuth, requireRole('FARMER'), validate(ratingSchema), async (req, res, next) => {
  try {
    const { rating, review } = req.body;

    const session = await prisma.mitraBooking.update({
      where: { id: req.params.id },
      data: { farmerRating: rating, farmerReview: review },
    });

    // Recalculate mitra rating average
    const allRatings = await prisma.mitraBooking.findMany({
      where: { mitraId: session.mitraId, farmerRating: { not: null } },
      select: { farmerRating: true },
    });
    const avgRating = allRatings.reduce((s, b) => s + Number(b.farmerRating), 0) / allRatings.length;

    await prisma.soilmitraProfile.updateMany({
      where: { userId: session.mitraId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    res.json(session);
  } catch (err) {
    next(err);
  }
});
