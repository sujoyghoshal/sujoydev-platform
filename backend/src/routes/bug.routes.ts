import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, authenticateOptional, authorize } from '../middleware/auth.middleware';
import { createBug, listBugs, updateBugStatus } from '../controllers/bug.controller';

const router = Router();

router.post('/', authenticateOptional, asyncHandler(createBug));
router.get('/', authenticate, authorize('admin', 'superadmin'), asyncHandler(listBugs));
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin', 'superadmin'),
  asyncHandler(updateBugStatus),
);

export default router;
