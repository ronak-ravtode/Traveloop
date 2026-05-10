import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.userId)
    .select('-__v')
    .populate('savedDestinations', 'name country image');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, photoURL, language, currency, travelStyle, savedDestinations, publicProfile, allowTripSharing } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (photoURL !== undefined) updateData.photoURL = photoURL;
  if (language !== undefined) updateData.language = language;
  if (currency !== undefined) updateData.currency = currency;
  if (travelStyle !== undefined) updateData.travelStyle = travelStyle;
  if (savedDestinations !== undefined) updateData.savedDestinations = savedDestinations;
  if (publicProfile !== undefined) updateData.publicProfile = publicProfile;
  if (allowTripSharing !== undefined) updateData.allowTripSharing = allowTripSharing;

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-__v');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Delete all trips associated with user
  await Trip.deleteMany({ user: req.user.userId });

  res.json({
    success: true,
    message: 'Account deleted successfully',
    data: null
  });
});

export const getUserStats = asyncHandler(async (req, res, next) => {
  const trips = await Trip.find({ user: req.user.userId });

  const stats = {
    totalTrips: trips.length,
    upcoming: trips.filter(t => t.status === 'upcoming').length,
    completed: trips.filter(t => t.status === 'completed').length,
    ongoing: trips.filter(t => t.status === 'ongoing').length
  };

  res.json({
    success: true,
    message: 'User stats retrieved successfully',
    data: stats
  });
});