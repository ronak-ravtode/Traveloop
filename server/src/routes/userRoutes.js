import express from 'express';
import { getProfile, updateProfile, deleteAccount, getUserStats } from '../controllers/userController.js';
import { authenticate } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.use(authenticate);

// GET /api/users/me - Get current user profile
router.get('/me', asyncHandler(getProfile));
// PUT /api/users/me - Update current user profile
router.put('/me', asyncHandler(updateProfile));
// DELETE /api/users/me - Delete account
router.delete('/me', asyncHandler(deleteAccount));
// GET /api/users/me/stats - Get user stats
router.get('/me/stats', asyncHandler(getUserStats));

export default router;