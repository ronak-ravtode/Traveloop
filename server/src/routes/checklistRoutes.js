import express from 'express';
import { getPackingList, addPackingItem, updatePackingItem, deletePackingItem, getPackingProgress } from '../controllers/checklistController.js';
import { authenticate } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/trip/:tripId', asyncHandler(getPackingList));
router.get('/trip/:tripId/progress', asyncHandler(getPackingProgress));
router.post('/trip/:tripId', asyncHandler(addPackingItem));
router.put('/trip/:tripId/item/:itemId', asyncHandler(updatePackingItem));
router.delete('/trip/:tripId/item/:itemId', asyncHandler(deletePackingItem));

export default router;