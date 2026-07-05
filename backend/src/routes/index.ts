import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import authRoutes from './auth.routes';
import requestRoutes from './request.routes';
import bugRoutes from './bug.routes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'NurixSoft API is running',
    data: {
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database:
        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV ?? 'development',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);
router.use('/bugs', bugRoutes);

// Mounted in later phases:
// router.use('/projects', projectRoutes);
// router.use('/services', serviceRoutes);
// router.use('/blogs', blogRoutes);
// router.use('/admin', adminRoutes);

export default router;
