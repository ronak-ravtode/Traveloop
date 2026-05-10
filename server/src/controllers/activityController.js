import Activity from '../models/Activity.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

// Get all activities with search, filters, sort, and pagination
export const getAllActivities = asyncHandler(async (req, res, next) => {
  const {
    search,
    cityId,
    category,
    minCost,
    maxCost,
    duration,
    sort,
    page = 1,
    limit = 20
  } = req.query;

  // Build query
  let query = {};

  // Search by title or description
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex }
    ];
  }

  // Filter by city
  if (cityId) {
    query.city = cityId;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by cost range
  if (minCost) {
    query.cost = { ...query.cost, $gte: parseInt(minCost) };
  }
  if (maxCost) {
    query.cost = { ...query.cost, $lte: parseInt(maxCost) };
  }

  // Filter by duration
  if (duration) {
    query.duration = { $lte: parseInt(duration) };
  }

  // Build sort options
  let sortOption = { rating: -1 }; // default
  if (sort) {
    switch (sort) {
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'costLowToHigh':
        sortOption = { cost: 1 };
        break;
      case 'duration':
        sortOption = { duration: 1 };
        break;
      default:
        sortOption = { rating: -1 };
    }
  }

  // Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Execute query with city population
  const activities = await Activity.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)
    .select('-__v')
    .populate('city', 'name country');

  // Get total count for pagination
  const total = await Activity.countDocuments(query);

  res.json({
    success: true,
    message: 'Activities retrieved successfully',
    data: activities,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

// Get activity by ID with city info
export const getActivityById = asyncHandler(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id)
    .select('-__v')
    .populate('city', 'name country region image');

  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  res.json({
    success: true,
    message: 'Activity retrieved successfully',
    data: activity
  });
});