import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

export const mitrasRouter = Router();

// GET /api/mitras — public browse
mitrasRouter.get('/', async (req, res, next) => {
  try {
    const { specialisation, language, minRating } = req.query;

    const mitras = await prisma.soilmitraProfile.findMany({
      where: {
        user: { isActive: true, isVerified: true },
        ...(specialisation ? { specialisation: { contains: String(specialisation) } } : {}),
        ...(language ? { languagesSpoken: { contains: String(language) } } : {}),
        ...(minRating ? { rating: { gte: parseFloat(String(minRating)) } } : {}),
      },
      include: { user: { select: { id: true, createdAt: true } } },
      orderBy: { rating: 'desc' },
    });

    res.json(mitras);
  } catch (err) {
    next(err);
  }
});

// GET /api/mitras/:id — public
mitrasRouter.get('/:id', async (req, res, next) => {
  try {
    const mitra = await prisma.soilmitraProfile.findFirst({
      where: { userId: req.params.id },
      include: { user: { select: { id: true, createdAt: true, isVerified: true } } },
    });
    if (!mitra) throw new AppError(404, 'Soil-Mitra not found.');
    res.json(mitra);
  } catch (err) {
    next(err);
  }
});

// PUT /api/mitras/me
mitrasRouter.put('/me', requireAuth, requireRole('SOILMITRA'), async (req, res, next) => {
  try {
    const { fullName, bio, sessionFee, specialisation, languagesSpoken } = req.body;

    const profile = await prisma.soilmitraProfile.upsert({
      where: { userId: req.user!.userId },
      update: { fullName, bio, sessionFee, specialisation: JSON.stringify(specialisation), languagesSpoken: JSON.stringify(languagesSpoken) },
      create: {
        userId: req.user!.userId,
        fullName: fullName ?? '',
        bio,
        sessionFee: sessionFee ?? 0,
        specialisation: JSON.stringify(specialisation ?? []),
        languagesSpoken: JSON.stringify(languagesSpoken ?? ['Hindi']),
      },
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PUT /api/mitras/me/availability
mitrasRouter.put('/me/availability', requireAuth, requireRole('SOILMITRA'), async (req, res, next) => {
  try {
    const profile = await prisma.soilmitraProfile.update({
      where: { userId: req.user!.userId },
      data: { availability: JSON.stringify(req.body) },
    });
    res.json({ availability: JSON.parse(profile.availability ?? '{}') });
  } catch (err) {
    next(err);
  }
});
