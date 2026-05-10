// Calculate total cost from all budget categories
export const calculateBudgetTotal = (budget) => {
  if (!budget) return 0;
  return (
    (budget.transport || 0) +
    (budget.stay || 0) +
    (budget.activities || 0) +
    (budget.meals || 0) +
    (budget.miscellaneous || 0)
  );
};

// Calculate activities cost from all stops in trip
export const calculateActivitiesCost = (stops) => {
  if (!stops || !Array.isArray(stops)) return 0;

  let total = 0;
  stops.forEach(stop => {
    if (stop.activities && Array.isArray(stop.activities)) {
      stop.activities.forEach(activity => {
        total += activity.cost || 0;
      });
    }
  });
  return total;
};

// Calculate average cost per day
export const calculateCostPerDay = (totalCost, startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end

  if (days <= 0) return 0;
  return Math.round(totalCost / days);
};

// Check if over budget
export const isOverBudget = (totalCost, budgetLimit) => {
  if (!budgetLimit || budgetLimit === 0) return false;
  return totalCost > budgetLimit;
};

// Get category breakdown for charts
export const getCategoryBreakdown = (budget) => {
  if (!budget) return [];

  return [
    { category: 'Transport', amount: budget.transport || 0 },
    { category: 'Stay', amount: budget.stay || 0 },
    { category: 'Activities', amount: budget.activities || 0 },
    { category: 'Meals', amount: budget.meals || 0 },
    { category: 'Miscellaneous', amount: budget.miscellaneous || 0 }
  ].filter(item => item.amount > 0);
};

export default {
  calculateBudgetTotal,
  calculateActivitiesCost,
  calculateCostPerDay,
  isOverBudget,
  getCategoryBreakdown
};