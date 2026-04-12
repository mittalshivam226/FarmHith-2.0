import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { generateTokens, requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const authRouter = Router();

// ── Schema ──────────────────────────────────────────────────────
const requestOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  role: z.enum(['FARMER', 'LAB', 'SOILMITRA', 'BIOPELLET', 'ADMIN']),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().length(6),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

// ── POST /api/auth/otp ───────────────────────────────────────────
// Request an OTP for the given phone number.
// In development, the OTP_BYPASS_CODE env var is always accepted.
authRouter.post('/otp', validate(requestOtpSchema), async (req, res, next) => {
  try {
    const { phone, role } = req.body;

    // Upsert user
    const user = await prisma.user.upsert({
      where: { phone },
      create: { phone, role },
      update: {},
    });

    // Generate OTP (mock in dev)
    const otp = process.env.NODE_ENV === 'production'
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : (process.env.OTP_BYPASS_CODE ?? '123456');

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiry },
    });

    // In production: send via SMS gateway (Twilio / MSG91)
    // For now: log to console
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
    }

    res.json({ message: 'OTP sent successfully', phoneLastFour: phone.slice(-4) });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────
// Verify OTP → return access + refresh tokens.
authRouter.post('/login', validate(verifyOtpSchema), async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) throw new AppError(404, 'Phone number not registered. Please request an OTP first.');

    const bypass = process.env.OTP_BYPASS_CODE ?? '123456';
    const isBypass = process.env.NODE_ENV !== 'production' && otp === bypass;
    const isValid = isBypass || (
      user.otpCode === otp &&
      user.otpExpiry !== null &&
      user.otpExpiry > new Date()
    );

    if (!isValid) throw new AppError(401, 'Invalid or expired OTP.');

    // Clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiry: null },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/refresh ───────────────────────────────────────
authRouter.post('/refresh', validate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      throw new AppError(401, 'Refresh token expired or invalid. Please log in again.');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      stored.user.id,
      stored.user.role
    );

    // Rotate refresh token
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/logout ────────────────────────────────────────
authRouter.post('/logout', requireAuth, validate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────────
authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, phone: true, email: true, role: true,
        isActive: true, isVerified: true, createdAt: true,
      },
    });
    if (!user) throw new AppError(404, 'User not found.');
    res.json(user);
  } catch (err) {
    next(err);
  }
});
