import express from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/noteController.js';
import { authenticate } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/trip/:tripId', asyncHandler(getNotes));
router.post('/trip/:tripId', asyncHandler(createNote));
router.put('/trip/:tripId/note/:noteId', asyncHandler(updateNote));
router.delete('/trip/:tripId/note/:noteId', asyncHandler(deleteNote));

export default router;