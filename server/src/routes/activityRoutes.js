import express from 'express';
import { getAllActivities, getActivityById } from '../controllers/activityController.js';
import { optionalAuth } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// All activity routes are public, but optionalAuth allows logged-in users to pass token
router.use(optionalAuth);

// GET /api/activities - Get all activities with search, filters, sort, pagination
// Query params: search, cityId, category, minCost, maxCost, duration, sort, page, limit
router.get('/', asyncHandler(getAllActivities));

// GET /api/activities/:id - Get activity by ID with city info
router.get('/:id', asyncHandler(getActivityById));

export default router;