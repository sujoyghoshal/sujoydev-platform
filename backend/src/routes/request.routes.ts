import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, authenticateOptional, authorize } from '../middleware/auth.middleware';
import {
  createRequest,
  trackRequest,
  listRequests,
  updateRequestStatus,
} from '../controllers/request.controller';

const router = Router();

router.post('/', authenticateOptional, asyncHandler(createRequest));
router.get('/track/:ticket', asyncHandler(trackRequest));
router.get('/', authenticate, authorize('admin', 'superadmin'), asyncHandler(listRequests));
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin', 'superadmin'),
  asyncHandler(updateRequestStatus),
);

export default router;
