import Trip from '../models/Trip.js';
import City from '../models/City.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

// Helper to validate dates
const validateDates = (arrivalDate, departureDate, tripStartDate, tripEndDate) => {
  if (!arrivalDate || !departureDate) {
    return 'Arrival and departure dates are required';
  }

  if (new Date(departureDate) < new Date(arrivalDate)) {
    return 'Departure date must be on or after arrival date';
  }

  // Check if dates are within trip range if trip has dates
  if (tripStartDate && new Date(arrivalDate) < new Date(tripStartDate)) {
    return 'Arrival date cannot be before trip start date';
  }

  if (tripEndDate && new Date(departureDate) > new Date(tripEndDate)) {
    return 'Departure date cannot be after trip end date';
  }

  return null;
};

// Add a new stop to trip
export const addStop = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const { cityId, arrivalDate, departureDate, notes } = req.body;

  // Validate required dates
  const dateError = validateDates(arrivalDate, departureDate, trip.startDate, trip.endDate);
  if (dateError) {
    return next(new AppError(dateError, 400));
  }

  let cityRef = null;
  let cityName = '';
  let country = '';

  // If cityId provided, fetch city from collection
  if (cityId) {
    const city = await City.findById(cityId);
    if (!city) {
      return next(new AppError('City not found', 404));
    }
    cityRef = city._id;
    cityName = city.name;
    country = city.country;
  }

  const newStop = {
    city: cityRef,
    cityName: cityName || req.body.cityName || '',
    country: country || req.body.country || '',
    arrivalDate,
    departureDate,
    notes: notes || '',
    order: trip.stops.length + 1,
    activities: []
  };

  trip.stops.push(newStop);
  await trip.save();

  // Populate city for response
  const addedStop = trip.stops[trip.stops.length - 1];
  await Trip.populate(addedStop, { path: 'city', select: 'name country image' });

  res.status(201).json({
    success: true,
    message: 'Stop added successfully',
    data: addedStop
  });
});

// Update a stop
export const updateStop = asyncHandler(async (req, res, next) => {
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

  // Get dates from body or existing stop
  const arrivalDate = req.body.arrivalDate ?? stop.arrivalDate;
  const departureDate = req.body.departureDate ?? stop.departureDate;

  // Validate dates if either is being updated
  if (req.body.arrivalDate || req.body.departureDate) {
    const dateError = validateDates(arrivalDate, departureDate, trip.startDate, trip.endDate);
    if (dateError) {
      return next(new AppError(dateError, 400));
    }
  }

  // Update allowed fields
  const allowedUpdates = ['cityName', 'country', 'arrivalDate', 'departureDate', 'notes'];
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      stop[field] = req.body[field];
    }
  });

  await trip.save();
  await Trip.populate(trip, { path: 'stops.city', select: 'name country image' });

  const updatedStop = trip.stops.find(s => s._id.toString() === req.params.stopId);

  res.json({
    success: true,
    message: 'Stop updated successfully',
    data: updatedStop
  });
});

// Delete a stop
export const deleteStop = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const stopIndex = trip.stops.findIndex(s => s._id.toString() === req.params.stopId);

  if (stopIndex === -1) {
    return next(new AppError('Stop not found', 404));
  }

  trip.stops.splice(stopIndex, 1);

  // Reorder remaining stops
  trip.stops.forEach((stop, index) => {
    stop.order = index + 1;
  });

  await trip.save();

  res.json({
    success: true,
    message: 'Stop deleted successfully',
    data: null
  });
});

// Reorder stops
export const reorderStops = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const { stopIds } = req.body;

  if (!Array.isArray(stopIds)) {
    return next(new AppError('stopIds must be an array', 400));
  }

  // Validate all stop IDs exist
  const existingStopIds = trip.stops.map(s => s._id.toString());
  const invalidIds = stopIds.filter(id => !existingStopIds.includes(id));
  if (invalidIds.length > 0) {
    return next(new AppError('Invalid stop IDs: ' + invalidIds.join(', '), 400));
  }

  // Reorder stops based on provided array
  const reorderedStops = [];
  stopIds.forEach((stopId, index) => {
    const stop = trip.stops.find(s => s._id.toString() === stopId);
    if (stop) {
      stop.order = index + 1;
      reorderedStops.push(stop);
    }
  });

  // Add any stops not in the provided array (shouldn't happen but safety check)
  trip.stops.forEach(stop => {
    if (!stopIds.includes(stop._id.toString())) {
      reorderedStops.push(stop);
    }
  });

  trip.stops = reorderedStops;
  await trip.save();
  await Trip.populate(trip, { path: 'stops.city', select: 'name country image' });

  res.json({
    success: true,
    message: 'Stops reordered successfully',
    data: trip.stops
  });
});