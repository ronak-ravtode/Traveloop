import Trip from '../models/Trip.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

// Valid categories
const VALID_CATEGORIES = [
  'Clothing',
  'Documents',
  'Electronics',
  'Toiletries',
  'Medicines',
  'Miscellaneous'
];

// Get packing list with progress stats
export const getPackingList = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId).select('checklist user');

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const totalItems = trip.checklist.length;
  const packedItems = trip.checklist.filter(item => item.packed).length;
  const progressPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  res.json({
    success: true,
    message: 'Checklist retrieved successfully',
    data: {
      items: trip.checklist,
      totalItems,
      packedItems,
      progressPercentage
    }
  });
});

// Add packing item
export const addPackingItem = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const { title, category } = req.body;

  if (!title) {
    return next(new AppError('Title is required', 400));
  }

  // Validate category
  const validCategory = category && VALID_CATEGORIES.includes(category)
    ? category
    : 'Miscellaneous';

  const newItem = {
    title,
    category: validCategory,
    packed: false
  };

  trip.checklist.push(newItem);
  await trip.save();

  const addedItem = trip.checklist[trip.checklist.length - 1];

  // Calculate progress
  const totalItems = trip.checklist.length;
  const packedItems = trip.checklist.filter(item => item.packed).length;
  const progressPercentage = Math.round((packedItems / totalItems) * 100);

  res.status(201).json({
    success: true,
    message: 'Item added successfully',
    data: {
      item: addedItem,
      totalItems,
      packedItems,
      progressPercentage
    }
  });
});

// Toggle packing item
export const togglePackingItem = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const item = trip.checklist.find(i => i._id.toString() === req.params.itemId);

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  item.packed = !item.packed;
  await trip.save();

  // Calculate progress
  const totalItems = trip.checklist.length;
  const packedItems = trip.checklist.filter(i => i.packed).length;
  const progressPercentage = Math.round((packedItems / totalItems) * 100);

  res.json({
    success: true,
    message: 'Item toggled successfully',
    data: {
      item,
      totalItems,
      packedItems,
      progressPercentage
    }
  });
});

// Delete packing item
export const deletePackingItem = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const itemIndex = trip.checklist.findIndex(i => i._id.toString() === req.params.itemId);

  if (itemIndex === -1) {
    return next(new AppError('Item not found', 404));
  }

  trip.checklist.splice(itemIndex, 1);
  await trip.save();

  // Calculate progress after deletion
  const totalItems = trip.checklist.length;
  const packedItems = trip.checklist.filter(i => i.packed).length;
  const progressPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  res.json({
    success: true,
    message: 'Item deleted successfully',
    data: {
      totalItems,
      packedItems,
      progressPercentage
    }
  });
});