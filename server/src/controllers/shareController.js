import Trip from '../models/Trip.js';
import { generatePublicId } from '../utils/generatePublicId.js';
import { calculateBudgetTotal } from '../utils/calculateTripCost.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

// Make trip public (protected - only owner)
export const makeTripPublic = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  // Generate publicId if not exists
  if (!trip.publicId) {
    trip.publicId = generatePublicId();
  }

  trip.visibility = 'public';
  await trip.save();

  res.json({
    success: true,
    message: 'Trip is now public',
    data: {
      visibility: 'public',
      publicId: trip.publicId,
      shareUrl: `/share/${trip.publicId}`
    }
  });
});

// Get public trip (public route - no auth required)
export const getPublicTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findOne({ publicId: req.params.publicId })
    .select('-__v -user')
    .populate('stops.city', 'name country image');

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.visibility !== 'public') {
    return next(new AppError('This trip is not public', 403));
  }

  // Calculate budget summary
  const activitiesCost = trip.stops.reduce((total, stop) => {
    if (stop.activities && stop.activities.length > 0) {
      return total + stop.activities.reduce((sum, act) => sum + (act.cost || 0), 0);
    }
    return total;
  }, 0);

  const budgetTotal = calculateBudgetTotal({
    ...trip.budget.toObject(),
    activities: activitiesCost
  });

  // Extract cities from stops
  const cities = trip.stops.map(stop => ({
    cityName: stop.cityName,
    country: stop.country,
    arrivalDate: stop.arrivalDate,
    departureDate: stop.departureDate
  }));

  // Build itinerary with activities
  const itinerary = trip.stops.map(stop => ({
    cityName: stop.cityName,
    country: stop.country,
    arrivalDate: stop.arrivalDate,
    departureDate: stop.departureDate,
    notes: stop.notes,
    activities: stop.activities.map(act => ({
      title: act.title,
      category: act.category,
      time: act.time,
      duration: act.duration,
      cost: act.cost
    }))
  }));

  res.json({
    success: true,
    message: 'Public trip retrieved successfully',
    data: {
      id: trip._id,
      name: trip.name,
      description: trip.description,
      coverImage: trip.coverImage,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status,
      cities,
      itinerary,
      budget: {
        limit: trip.budgetLimit || 0,
        transport: trip.budget.transport || 0,
        stay: trip.budget.stay || 0,
        activities: activitiesCost,
        meals: trip.budget.meals || 0,
        miscellaneous: trip.budget.miscellaneous || 0,
        total: budgetTotal
      }
    }
  });
});

// Copy public trip (protected - logged in user can copy)
export const copyPublicTrip = asyncHandler(async (req, res, next) => {
  const publicTrip = await Trip.findOne({ publicId: req.params.publicId })
    .select('-__v -user');

  if (!publicTrip) {
    return next(new AppError('Trip not found', 404));
  }

  if (publicTrip.visibility !== 'public') {
    return next(new AppError('This trip is not public', 403));
  }

  // Create new trip with current user as owner
  const newTrip = await Trip.create({
    user: req.user.userId,
    name: `${publicTrip.name} (Copy)`,
    description: publicTrip.description,
    coverImage: publicTrip.coverImage,
    startDate: publicTrip.startDate,
    endDate: publicTrip.endDate,
    status: 'upcoming',
    visibility: 'private', // Make copied trip private by default
    publicId: generatePublicId(),
    budgetLimit: publicTrip.budgetLimit,
    stops: publicTrip.stops,
    budget: {
      transport: publicTrip.budget.transport || 0,
      stay: publicTrip.budget.stay || 0,
      activities: publicTrip.budget.activities || 0,
      meals: publicTrip.budget.meals || 0,
      miscellaneous: publicTrip.budget.miscellaneous || 0
    },
    checklist: [],
    notes: []
  });

  res.status(201).json({
    success: true,
    message: 'Trip copied successfully',
    data: {
      id: newTrip._id,
      name: newTrip.name,
      visibility: newTrip.visibility
    }
  });
});

// Make trip private (protected - only owner)
export const makeTripPrivate = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  trip.visibility = 'private';
  await trip.save();

  res.json({
    success: true,
    message: 'Trip is now private',
    data: { visibility: 'private' }
  });
});