import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';
import { validate } from '../middleware/validate';

export const adminRouter = Router();

// All admin routes require ADMIN role
adminRouter.use(requireAuth, requireRole('ADMIN'));

// GET /api/admin/stats — platform metrics
adminRouter.get('/stats', async (_req, res, next) => {
  try {
    const [
      totalFarmers, totalLabs, totalMitras, totalPlants,
      totalBookings, completedBookings,
      totalSessions, completedSessions,
      activeListings, totalOrders,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'FARMER' } }),
      prisma.user.count({ where: { role: 'LAB' } }),
      prisma.user.count({ where: { role: 'SOILMITRA' } }),
      prisma.user.count({ where: { role: 'BIOPELLET' } }),
      prisma.soilTestBooking.count(),
      prisma.soilTestBooking.count({ where: { status: 'COMPLETED' } }),
      prisma.mitraBooking.count(),
      prisma.mitraBooking.count({ where: { status: 'COMPLETED' } }),
      prisma.cropListing.count({ where: { status: 'ACTIVE' } }),
      prisma.procurementOrder.count(),
    ]);

    const [revenueResult] = await prisma.$queryRaw<{ total: string }[]>`
      SELECT COALESCE(SUM("grossAmount"), 0) as total FROM "payments"
    `;
    const totalRevenue = parseFloat(revenueResult?.total ?? '0');

    res.json({
      users: { totalFarmers, totalLabs, totalMitras, totalPlants },
      bookings: { total: totalBookings, completed: completedBookings },
      sessions: { total: totalSessions, completed: completedSessions },
      marketplace: { activeListings, totalOrders },
      revenue: { totalRevenue },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
adminRouter.get('/users', async (req, res, next) => {
  try {
    const { role, isVerified } = req.query;
    const users = await prisma.user.findMany({
      where: {
        ...(role ? { role: String(role) as any } : {}),
        ...(isVerified !== undefined ? { isVerified: isVerified === 'true' } : {}),
      },
      include: {
        farmerProfile: { select: { fullName: true, state: true } },
        labProfile: { select: { labName: true } },
        soilmitraProfile: { select: { fullName: true } },
        biopelletProfile: { select: { plantName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id/verify
adminRouter.put('/users/:id/verify', async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isVerified: true },
    });
    res.json({ message: 'User verified.', user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id/suspend
adminRouter.put('/users/:id/suspend', async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'User suspended.', user });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/broadcast
const broadcastSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(5),
  targetRole: z.enum(['FARMER', 'LAB', 'SOILMITRA', 'BIOPELLET', 'ALL']),
});

adminRouter.post('/broadcast', validate(broadcastSchema), async (req, res, next) => {
  try {
    const { title, message, targetRole } = req.body;

    const users = await prisma.user.findMany({
      where: targetRole === 'ALL' ? { isActive: true } : { role: targetRole, isActive: true },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        type: 'INFO' as const,
        title,
        message,
      })),
    });

    res.json({
      message: `Broadcast sent to ${users.length} users.`,
      recipientCount: users.length,
    });
  } catch (err) {
    next(err);
  }
});
