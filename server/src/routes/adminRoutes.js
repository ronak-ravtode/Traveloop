import express from 'express';
import { authenticate, requireAdmin } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/stats - Get admin analytics
router.get('/stats', asyncHandler(adminController.getAnalytics));
// GET /api/admin/users - Get all users
router.get('/users', asyncHandler(adminController.getAllUsers));
// GET /api/admin/trips - Get all trips
router.get('/trips', asyncHandler(adminController.getAllTripsAdmin));

export default router;