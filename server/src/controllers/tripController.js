import Trip from '../models/Trip.js';
import { generatePublicId } from '../utils/generatePublicId.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

export const getAllTrips = asyncHandler(async (req, res, next) => {
  const trips = await Trip.find({ user: req.user.userId })
    .sort({ createdAt: -1 })
    .select('-__v')
    .populate('stops.city', 'name country image');

  res.json({
    success: true,
    message: 'Trips retrieved successfully',
    data: trips
  });
});

export const getTripById = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id)
    .select('-__v')
    .populate('stops.city', 'name country image');

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  res.json({
    success: true,
    message: 'Trip retrieved successfully',
    data: trip
  });
});

export const createTrip = asyncHandler(async (req, res, next) => {
  const { name, description, coverImage, startDate, endDate, status, budgetLimit, stops } = req.body;

  const publicId = generatePublicId();

  const trip = await Trip.create({
    user: req.user.userId,
    name,
    description: description || '',
    coverImage: coverImage || '',
    startDate: startDate || '',
    endDate: endDate || '',
    status: status || 'upcoming',
    visibility: 'private',
    publicId,
    budgetLimit: budgetLimit || 0,
    stops: stops || [],
    budget: { transport: 0, stay: 0, activities: 0, meals: 0, miscellaneous: 0 },
    checklist: [],
    notes: []
  });

  res.status(201).json({
    success: true,
    message: 'Trip created successfully',
    data: trip
  });
});

export const updateTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const allowedUpdates = ['name', 'description', 'coverImage', 'startDate', 'endDate', 'status', 'visibility', 'budgetLimit', 'stops', 'notes'];
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      trip[field] = req.body[field];
    }
  });

  await trip.save();

  res.json({
    success: true,
    message: 'Trip updated successfully',
    data: trip
  });
});

export const deleteTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  await Trip.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Trip deleted successfully',
    data: null
  });
});

export const filterTrips = asyncHandler(async (req, res, next) => {
  const { query, status } = req.query;

  let trips = await Trip.find({ user: req.user.userId })
    .select('-__v')
    .populate('stops.city', 'name country');

  if (status) {
    trips = trips.filter(t => t.status === status);
  }

  if (query) {
    const q = query.toLowerCase();
    trips = trips.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    message: 'Trips filtered successfully',
    data: trips
  });
});