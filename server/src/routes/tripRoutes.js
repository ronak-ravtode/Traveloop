import express from 'express';
import { authenticate } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import * as tripController from '../controllers/tripController.js';
import * as stopController from '../controllers/stopController.js';
import * as activityController from '../controllers/tripActivityController.js';
import * as budgetController from '../controllers/budgetController.js';
import * as checklistController from '../controllers/checklistController.js';
import * as noteController from '../controllers/noteController.js';
import * as publicController from '../controllers/shareController.js';

const router = express.Router();

// All trip routes require authentication
router.use(authenticate);

// ============ TRIPS ============
// GET /api/trips - List all trips
router.get('/', asyncHandler(tripController.getAllTrips));
// POST /api/trips - Create new trip
router.post('/', asyncHandler(tripController.createTrip));
// GET /api/trips/:id - Get trip by ID
router.get('/:id', asyncHandler(tripController.getTripById));
// PUT /api/trips/:id - Update trip
router.put('/:id', asyncHandler(tripController.updateTrip));
// DELETE /api/trips/:id - Delete trip
router.delete('/:id', asyncHandler(tripController.deleteTrip));

// ============ STOPS (Itinerary) ============
// POST /api/trips/:tripId/stops - Add stop
router.post('/:tripId/stops', asyncHandler(stopController.addStop));
// PUT /api/trips/:tripId/stops/:stopId - Update stop
router.put('/:tripId/stops/:stopId', asyncHandler(stopController.updateStop));
// DELETE /api/trips/:tripId/stops/:stopId - Delete stop
router.delete('/:tripId/stops/:stopId', asyncHandler(stopController.deleteStop));
// PATCH /api/trips/:tripId/stops/reorder - Reorder stops
router.patch('/:tripId/stops/reorder', asyncHandler(stopController.reorderStops));

// ============ ACTIVITIES IN STOPS ============
// POST /api/trips/:tripId/stops/:stopId/activities - Add activity to stop
router.post('/:tripId/stops/:stopId/activities', asyncHandler(activityController.addActivityToStop));
// DELETE /api/trips/:tripId/stops/:stopId/activities/:activityId - Remove activity from stop
router.delete('/:tripId/stops/:stopId/activities/:activityId', asyncHandler(activityController.removeActivityFromStop));

// ============ BUDGET ============
// GET /api/trips/:tripId/budget
router.get('/:tripId/budget', asyncHandler(budgetController.getBudget));
// PUT /api/trips/:tripId/budget
router.put('/:tripId/budget', asyncHandler(budgetController.updateBudget));

// ============ CHECKLIST ============
// GET /api/trips/:tripId/checklist
router.get('/:tripId/checklist', asyncHandler(checklistController.getPackingList));
// POST /api/trips/:tripId/checklist
router.post('/:tripId/checklist', asyncHandler(checklistController.addPackingItem));
// PATCH /api/trips/:tripId/checklist/:itemId/toggle
router.patch('/:tripId/checklist/:itemId/toggle', asyncHandler(checklistController.togglePackingItem));
// DELETE /api/trips/:tripId/checklist/:itemId
router.delete('/:tripId/checklist/:itemId', asyncHandler(checklistController.deletePackingItem));

// ============ NOTES ============
// GET /api/trips/:tripId/notes
router.get('/:tripId/notes', asyncHandler(noteController.getNotes));
// POST /api/trips/:tripId/notes
router.post('/:tripId/notes', asyncHandler(noteController.createNote));
// PUT /api/trips/:tripId/notes/:noteId
router.put('/:tripId/notes/:noteId', asyncHandler(noteController.updateNote));
// DELETE /api/trips/:tripId/notes/:noteId
router.delete('/:tripId/notes/:noteId', asyncHandler(noteController.deleteNote));

// ============ PUBLIC SHARING ============
// POST /api/trips/:tripId/share - Make trip public
router.post('/:tripId/share', asyncHandler(publicController.makeTripPublic));

export default router;