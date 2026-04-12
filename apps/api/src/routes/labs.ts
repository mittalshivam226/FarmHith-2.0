import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

export const labsRouter = Router();

// GET /api/labs — public browse
labsRouter.get('/', async (req, res, next) => {
  try {
    const { state, district } = req.query;

    const labs = await prisma.labProfile.findMany({
      where: {
        user: { isActive: true, isVerified: true },
        ...(state ? { state: String(state) } : {}),
        ...(district ? { district: String(district) } : {}),
      },
      include: { user: { select: { id: true, phone: true, isVerified: true } } },
      orderBy: { perTestPrice: 'asc' },
    });

    res.json(labs);
  } catch (err) {
    next(err);
  }
});

// GET /api/labs/:id — public
labsRouter.get('/:id', async (req, res, next) => {
  try {
    const lab = await prisma.labProfile.findFirst({
      where: { userId: req.params.id },
      include: { user: { select: { id: true, phone: true, isVerified: true, createdAt: true } } },
    });
    if (!lab) throw new AppError(404, 'Lab not found.');
    res.json(lab);
  } catch (err) {
    next(err);
  }
});

// PUT /api/labs/me
labsRouter.put('/me', requireAuth, requireRole('LAB'), async (req, res, next) => {
  try {
    const {
      labName, address, state, district,
      perTestPrice, dailyCapacity, serviceableArea, certifications,
    } = req.body;

    const profile = await prisma.labProfile.upsert({
      where: { userId: req.user!.userId },
      update: { labName, address, state, district, perTestPrice, dailyCapacity, serviceableArea, certifications },
      create: {
        userId: req.user!.userId,
        labName: labName ?? '',
        address: address ?? '',
        state: state ?? '',
        district: district ?? '',
        perTestPrice: perTestPrice ?? 0,
        dailyCapacity: dailyCapacity ?? 10,
        serviceableArea,
        certifications,
      },
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});
