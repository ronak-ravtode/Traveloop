import express from 'express';
import { getBudget, updateBudget, getBudgetSummary } from '../controllers/budgetController.js';
import { authenticate } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/trip/:tripId', asyncHandler(getBudget));
router.put('/trip/:tripId', asyncHandler(updateBudget));
router.get('/trip/:tripId/summary', asyncHandler(getBudgetSummary));

export default router;