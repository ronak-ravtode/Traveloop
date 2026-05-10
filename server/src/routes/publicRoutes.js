import express from 'express';
import { authenticate } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import * as shareController from '../controllers/shareController.js';

const router = express.Router();

// GET /api/public/:publicId - Get public trip (no auth required)
router.get('/:publicId', asyncHandler(shareController.getPublicTrip));

// POST /api/public/:publicId/copy - Copy public trip (requires auth)
router.post('/:publicId/copy', authenticate, asyncHandler(shareController.copyPublicTrip));

export default router;