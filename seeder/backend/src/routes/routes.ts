import express from 'express';

import contractRoutes from './contract';
import paymentRoutes from './payment';
import authRoutes from './auth';
import cashkickRoutes from './cashkick';

const router = express.Router();

router.use('/api', contractRoutes);
router.use('/api', paymentRoutes);
router.use('/api', cashkickRoutes);
router.use('/api', authRoutes);

export default router;