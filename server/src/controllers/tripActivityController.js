import Trip from '../models/Trip.js';
import Activity from '../models/Activity.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

// Helper to recalculate activities budget from all stops
const updateActivitiesBudget = async (trip) => {
  let totalActivityCost = 0;

  trip.stops.forEach(stop => {
    if (stop.activities && stop.activities.length > 0) {
      stop.activities.forEach(activity => {
        totalActivityCost += activity.cost || 0;
      });
    }
  });

  trip.budget.activities = totalActivityCost;
  await trip.save();
};

// Add activity to a stop
export const addActivityToStop = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const stop = trip.stops.find(s => s._id.toString() === req.params.stopId);

  if (!stop) {
    return next(new AppError('Stop not found', 404));
  }

  const { activityId, time } = req.body;

  if (!activityId) {
    return next(new AppError('Activity ID is required', 400));
  }

  // Fetch Activity from database
  const activity = await Activity.findById(activityId);

  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  // Check for duplicate activity in the same stop
  const isDuplicate = stop.activities.some(
    a => a.activity && a.activity.toString() === activityId
  );

  if (isDuplicate) {
    return next(new AppError('Activity already exists in this stop', 400));
  }

  const newActivity = {
    activity: activity._id,
    title: activity.title,
    category: activity.category,
    time: time || '10:00',
    duration: activity.duration || 1,
    cost: activity.cost || 0
  };

  stop.activities.push(newActivity);
  await trip.save();

  // Update budget.activities automatically
  await updateActivitiesBudget(trip);

  // Populate activity for response
  const addedActivity = stop.activities[stop.activities.length - 1];
  await Trip.populate(trip, {
    path: 'stops.activities.activity',
    select: 'title category duration cost'
  });

  res.status(201).json({
    success: true,
    message: 'Activity added successfully',
    data: stop.activities.find(a => a._id.toString() === addedActivity._id.toString())
  });
});

// Remove activity from stop
export const removeActivityFromStop = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const stop = trip.stops.find(s => s._id.toString() === req.params.stopId);

  if (!stop) {
    return next(new AppError('Stop not found', 404));
  }

  const activityIndex = stop.activities.findIndex(
    a => a._id.toString() === req.params.activityId
  );

  if (activityIndex === -1) {
    return next(new AppError('Activity not found', 404));
  }

  // Remove activity
  stop.activities.splice(activityIndex, 1);
  await trip.save();

  // Update budget.activities automatically
  await updateActivitiesBudget(trip);

  res.json({
    success: true,
    message: 'Activity removed successfully',
    data: null
  });
});