import Trip from '../models/Trip.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

// Get notes with search and filter
export const getNotes = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId).select('notes user');

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const { search, relatedCity } = req.query;

  let notes = [...trip.notes];

  // Filter by relatedCity
  if (relatedCity) {
    notes = notes.filter(note =>
      note.relatedCity && note.relatedCity.toLowerCase().includes(relatedCity.toLowerCase())
    );
  }

  // Search in title and content
  if (search) {
    const searchLower = search.toLowerCase();
    notes = notes.filter(note =>
      (note.title && note.title.toLowerCase().includes(searchLower)) ||
      (note.content && note.content.toLowerCase().includes(searchLower))
    );
  }

  // Sort by date, latest first (handle empty/null dates by putting them at end)
  notes.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA;
  });

  res.json({
    success: true,
    message: 'Notes retrieved successfully',
    data: notes
  });
});

// Create note
export const createNote = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const { title, content, relatedCity, date } = req.body;

  if (!content && !title) {
    return next(new AppError('Title or content is required', 400));
  }

  const newNote = {
    title: title || '',
    content: content || '',
    relatedCity: relatedCity || '',
    date: date || new Date().toISOString().split('T')[0]
  };

  trip.notes.push(newNote);
  await trip.save();

  const createdNote = trip.notes[trip.notes.length - 1];

  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    data: createdNote
  });
});

// Update note
export const updateNote = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const note = trip.notes.find(n => n._id.toString() === req.params.noteId);

  if (!note) {
    return next(new AppError('Note not found', 404));
  }

  const allowedUpdates = ['title', 'content', 'relatedCity', 'date'];
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      note[field] = req.body[field];
    }
  });

  await trip.save();

  res.json({
    success: true,
    message: 'Note updated successfully',
    data: note
  });
});

// Delete note
export const deleteNote = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const noteIndex = trip.notes.findIndex(n => n._id.toString() === req.params.noteId);

  if (noteIndex === -1) {
    return next(new AppError('Note not found', 404));
  }

  trip.notes.splice(noteIndex, 1);
  await trip.save();

  res.json({
    success: true,
    message: 'Note deleted successfully',
    data: null
  });
});