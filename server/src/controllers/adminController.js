import User from '../models/User.js';
import Trip from '../models/Trip.js';
import City from '../models/City.js';
import Activity from '../models/Activity.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

// Get comprehensive analytics
export const getAnalytics = asyncHandler(async (req, res, next) => {
  // Basic counts
  const totalUsers = await User.countDocuments();
  const totalTrips = await Trip.countDocuments();

  // Get trips for aggregation
  const trips = await Trip.find();

  // Public trips
  const publicTrips = trips.filter(t => t.visibility === 'public').length;

  // Average trip budget
  const tripsWithBudget = trips.filter(t => t.budgetLimit && t.budgetLimit > 0);
  const averageTripBudget = tripsWithBudget.length > 0
    ? Math.round(tripsWithBudget.reduce((sum, t) => sum + t.budgetLimit, 0) / tripsWithBudget.length)
    : 0;

  // Top cities (by popularity in cities collection)
  const topCities = await City.find()
    .sort({ popularity: -1 })
    .limit(10)
    .select('name country');

  // Top activity categories
  const activityCategories = await Activity.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  const topActivityCategories = activityCategories.map(cat => ({
    category: cat._id || 'Other',
    count: cat.count
  }));

  // Trips created over time (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const tripsOverTime = await Trip.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const tripsCreatedOverTime = tripsOverTime.map(t => ({
    month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
    count: t.count
  }));

  // Budget distribution across all trips
  const budgetDistribution = await Trip.aggregate([
    {
      $group: {
        _id: null,
        transport: { $sum: '$budget.transport' },
        stay: { $sum: '$budget.stay' },
        activities: { $sum: '$budget.activities' },
        meals: { $sum: '$budget.meals' },
        miscellaneous: { $sum: '$budget.miscellaneous' }
      }
    }
  ]);

  const budgetData = budgetDistribution[0] || {};
  const budgetDistributionResult = [
    { category: 'Transport', amount: budgetData.transport || 0 },
    { category: 'Stay', amount: budgetData.stay || 0 },
    { category: 'Activities', amount: budgetData.activities || 0 },
    { category: 'Meals', amount: budgetData.meals || 0 },
    { category: 'Miscellaneous', amount: budgetData.miscellaneous || 0 }
  ].filter(item => item.amount > 0);

  // Trips by status
  const tripsByStatus = {
    upcoming: trips.filter(t => t.status === 'upcoming').length,
    ongoing: trips.filter(t => t.status === 'ongoing').length,
    completed: trips.filter(t => t.status === 'completed').length
  };

  res.json({
    success: true,
    message: 'Analytics retrieved successfully',
    data: {
      totalUsers,
      totalTrips,
      publicTrips,
      averageTripBudget,
      topCities: topCities.map(c => ({ name: c.name, country: c.country })),
      topActivityCategories,
      tripsCreatedOverTime,
      budgetDistribution: budgetDistributionResult,
      tripsByStatus
    }
  });
});

// Get all users for admin table
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, search } = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  let query = {};
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
  }

  const users = await User.find(query)
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(query);

  // Get trip counts for each user
  const usersWithTripCounts = await Promise.all(
    users.map(async (user) => {
      const tripCount = await Trip.countDocuments({ user: user._id });
      return {
        ...user.toObject(),
        tripCount
      };
    })
  );

  res.json({
    success: true,
    message: 'Users retrieved successfully',
    data: usersWithTripCounts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

// Get all trips for admin table
export const getAllTripsAdmin = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  let query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }

  const trips = await Trip.find(query)
    .populate('user', 'email name')
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Trip.countDocuments(query);

  res.json({
    success: true,
    message: 'Trips retrieved successfully',
    data: trips,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});