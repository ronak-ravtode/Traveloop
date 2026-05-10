import express from 'express';
import { getAllCities, getCityById } from '../controllers/cityController.js';
import { optionalAuth } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// All city routes are public, but optionalAuth allows logged-in users to pass token
router.use(optionalAuth);

// GET /api/cities - Get all cities with search, filters, sort, pagination
// Query params: search, country, region, costLevel, sort, page, limit
router.get('/', asyncHandler(getAllCities));

// GET /api/cities/:id - Get city by ID
router.get('/:id', asyncHandler(getCityById));

export default router;