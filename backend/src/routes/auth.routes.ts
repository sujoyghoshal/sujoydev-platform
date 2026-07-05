import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticateOptional } from '../middleware/auth.middleware';
import { googleLogin, adminLogin, refresh, logout } from '../controllers/auth.controller';

const router = Router();

router.post('/google', authLimiter, asyncHandler(googleLogin));
router.post('/admin/login', authLimiter, asyncHandler(adminLogin));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', authenticateOptional, asyncHandler(logout));

export default router;
