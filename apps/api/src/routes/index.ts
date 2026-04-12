import { Router } from 'express';
import { authRouter } from './auth';
import { farmersRouter } from './farmers';
import { labsRouter } from './labs';
import { soilTestsRouter } from './soilTests';
import { mitrasRouter } from './mitras';
import { sessionsRouter } from './sessions';
import { listingsRouter } from './listings';
import { ordersRouter } from './orders';
import { notificationsRouter } from './notifications';
import { adminRouter } from './admin';
import { paymentsRouter } from './payments';

export const router = Router();

router.use('/auth', authRouter);
router.use('/farmers', farmersRouter);
router.use('/labs', labsRouter);
router.use('/soil-tests', soilTestsRouter);
router.use('/mitras', mitrasRouter);
router.use('/sessions', sessionsRouter);
router.use('/listings', listingsRouter);
router.use('/orders', ordersRouter);
router.use('/notifications', notificationsRouter);
router.use('/payments', paymentsRouter);
router.use('/admin', adminRouter);
