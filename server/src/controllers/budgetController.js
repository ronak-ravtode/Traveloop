import Trip from '../models/Trip.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';
import {
  calculateBudgetTotal,
  calculateActivitiesCost,
  calculateCostPerDay,
  isOverBudget,
  getCategoryBreakdown
} from '../utils/calculateTripCost.js';

// Get budget with full details
export const getBudget = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId).select(
    'budget budgetLimit startDate endDate stops user'
  );

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  // Calculate activities cost from stops
  const activitiesCost = calculateActivitiesCost(trip.stops);

  // Update budget.activities with calculated value
  const budget = {
    ...trip.budget.toObject(),
    activities: activitiesCost
  };

  // Calculate totals
  const totalEstimatedCost = calculateBudgetTotal(budget);
  const remainingBudget = trip.budgetLimit - totalEstimatedCost;
  const overBudget = isOverBudget(totalEstimatedCost, trip.budgetLimit);
  const averageCostPerDay = calculateCostPerDay(
    totalEstimatedCost,
    trip.startDate,
    trip.endDate
  );

  res.json({
    success: true,
    message: 'Budget retrieved successfully',
    data: {
      budgetLimit: trip.budgetLimit || 0,
      transport: budget.transport || 0,
      stay: budget.stay || 0,
      activities: activitiesCost, // Auto-calculated from stops
      meals: budget.meals || 0,
      miscellaneous: budget.miscellaneous || 0,
      totalEstimatedCost,
      remainingBudget,
      averageCostPerDay,
      isOverBudget: overBudget,
      categoryBreakdown: getCategoryBreakdown(budget)
    }
  });
});

// Update budget
export const updateBudget = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  if (trip.user.toString() !== req.user.userId.toString()) {
    return next(new AppError('Access denied', 403));
  }

  const { budgetLimit, transport, stay, meals, miscellaneous } = req.body;

  // Update allowed fields
  if (budgetLimit !== undefined) {
    trip.budgetLimit = budgetLimit;
  }
  if (transport !== undefined) {
    trip.budget.transport = transport;
  }
  if (stay !== undefined) {
    trip.budget.stay = stay;
  }
  if (meals !== undefined) {
    trip.budget.meals = meals;
  }
  if (miscellaneous !== undefined) {
    trip.budget.miscellaneous = miscellaneous;
  }
  // Note: activities is NOT directly editable, it's calculated from stops

  await trip.save();

  // Calculate response with auto-calculated activities
  const activitiesCost = calculateActivitiesCost(trip.stops);
  const totalEstimatedCost = calculateBudgetTotal({
    ...trip.budget.toObject(),
    activities: activitiesCost
  });
  const remainingBudget = trip.budgetLimit - totalEstimatedCost;
  const overBudget = isOverBudget(totalEstimatedCost, trip.budgetLimit);
  const averageCostPerDay = calculateCostPerDay(
    totalEstimatedCost,
    trip.startDate,
    trip.endDate
  );

  res.json({
    success: true,
    message: 'Budget updated successfully',
    data: {
      budgetLimit: trip.budgetLimit || 0,
      transport: trip.budget.transport || 0,
      stay: trip.budget.stay || 0,
      activities: activitiesCost,
      meals: trip.budget.meals || 0,
      miscellaneous: trip.budget.miscellaneous || 0,
      totalEstimatedCost,
      remainingBudget,
      averageCostPerDay,
      isOverBudget: overBudget,
      categoryBreakdown: getCategoryBreakdown(trip.budget)
    }
  });
});