import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[${req.method}] ${req.path} —`, err.message);

  // Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code ?? 'APP_ERROR',
    });
  }

  // Prisma unique constraint violation
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as { code: string; meta?: { target?: string[] } };
    if (prismaErr.code === 'P2002') {
      return res.status(409).json({
        error: `A record with this ${prismaErr.meta?.target?.join(', ')} already exists.`,
        code: 'DUPLICATE_ENTRY',
      });
    }
    if (prismaErr.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found', code: 'NOT_FOUND' });
    }
  }

  // Zod validation errors
  if (err.constructor.name === 'ZodError') {
    return res.status(422).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: JSON.parse(err.message),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token', code: 'AUTH_ERROR' });
  }

  // Fallback
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  });
}
