import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

export const farmersRouter = Router();

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  totalLandAcres: z.number().positive().optional(),
  primaryCrop: z.string().optional(),
  preferredLang: z.string().optional(),
});

// GET /api/farmers/me
farmersRouter.get('/me', requireAuth, requireRole('FARMER'), async (req, res, next) => {
  try {
    const profile = await prisma.farmerProfile.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!profile) throw new AppError(404, 'Farmer profile not found.');
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PUT /api/farmers/me
farmersRouter.put('/me', requireAuth, requireRole('FARMER'), validate(updateProfileSchema), async (req, res, next) => {
  try {
    const profile = await prisma.farmerProfile.upsert({
      where: { userId: req.user!.userId },
      update: req.body,
      create: {
        userId: req.user!.userId,
        fullName: req.body.fullName ?? '',
        state: req.body.state ?? '',
        district: req.body.district ?? '',
        totalLandAcres: req.body.totalLandAcres ?? 0,
        primaryCrop: req.body.primaryCrop ?? '',
        preferredLang: req.body.preferredLang ?? 'Hindi',
      },
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});
