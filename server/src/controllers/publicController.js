import Trip from '../models/Trip.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

export const getPublicTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findOne({ shareCode: req.params.shareCode }).select('-__v');

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (!trip.isPublic) {
    return next(new AppError('This trip is not public', 403));
  }

  res.json({
    success: true,
    message: 'Public trip retrieved successfully',
    data: {
      id: trip._id,
      title: trip.title,
      description: trip.description,
      coverImage: trip.coverImage,
      startDate: trip.startDate,
      endDate: trip.endDate,
      cities: trip.cities,
      activities: trip.activities
    }
  });
});

export const makeTripPublic = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.userId.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  trip.isPublic = true;
  await trip.save();

  res.json({
    success: true,
    message: 'Trip is now public',
    data: { isPublic: true, shareCode: trip.shareCode }
  });
});

export const makeTripPrivate = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.userId.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  trip.isPublic = false;
  await trip.save();

  res.json({
    success: true,
    message: 'Trip is now private',
    data: { isPublic: false }
  });
});