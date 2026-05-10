import City from '../models/City.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

// Get all cities with search, filters, sort, and pagination
export const getAllCities = asyncHandler(async (req, res, next) => {
  const {
    search,
    country,
    region,
    costLevel,
    sort,
    page = 1,
    limit = 20
  } = req.query;

  // Build query
  let query = {};

  // Search by name, country, or tags
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { name: searchRegex },
      { country: searchRegex },
      { tags: searchRegex }
    ];
  }

  // Filter by country
  if (country) {
    query.country = new RegExp(country, 'i');
  }

  // Filter by region
  if (region) {
    query.region = region;
  }

  // Filter by cost level
  if (costLevel) {
    query.costLevel = costLevel;
  }

  // Build sort options
  let sortOption = { popularity: -1 }; // default
  if (sort) {
    switch (sort) {
      case 'popularity':
        sortOption = { popularity: -1 };
        break;
      case 'costLowToHigh':
        sortOption = { costIndex: 1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { popularity: -1 };
    }
  }

  // Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const cities = await City.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)
    .select('-__v');

  // Get total count for pagination
  const total = await City.countDocuments(query);

  res.json({
    success: true,
    message: 'Cities retrieved successfully',
    data: cities,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

// Get city by ID
export const getCityById = asyncHandler(async (req, res, next) => {
  const city = await City.findById(req.params.id).select('-__v');

  if (!city) {
    return next(new AppError('City not found', 404));
  }

  res.json({
    success: true,
    message: 'City retrieved successfully',
    data: city
  });
});