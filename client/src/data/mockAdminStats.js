export const adminStats = {
  overview: {
    totalUsers: 1247,
    totalTrips: 3892,
    totalDestinations: 48,
    activeUsers: 892,
    growthRate: 12.5,
    avgTripsPerUser: 3.1,
    revenue: 156750,
  },
  userGrowth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [680, 720, 785, 810, 890, 945, 1020, 1080, 1145, 1190, 1220, 1247],
    newUsers: [0, 40, 65, 25, 80, 55, 75, 60, 65, 45, 30, 27],
  },
  tripTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [180, 195, 245, 320, 385, 420, 445, 460, 380, 295, 285, 272],
    completed: [120, 135, 180, 240, 290, 320, 340, 355, 290, 220, 210, 195],
    upcoming: [60, 60, 65, 80, 95, 100, 105, 105, 90, 75, 75, 77],
  },
  destinationPopularity: {
    labels: ['Paris', 'Tokyo', 'Bali', 'New York', 'Barcelona', 'Rome', 'London', 'Dubai', 'Singapore', 'Bangkok'],
    data: [425, 398, 365, 342, 298, 275, 245, 228, 195, 182],
  },
  budgetDistribution: {
    labels: ['Flights', 'Accommodation', 'Food', 'Activities', 'Transport', 'Other'],
    data: [35, 30, 15, 10, 5, 5],
    colors: ['#0F766E', '#14B8A6', '#5EEAD4', '#99F6E4', '#CCFBF1', '#F0FDFA'],
  },
  tripStatus: {
    labels: ['Planning', 'Upcoming', 'Ongoing', 'Completed'],
    data: [485, 892, 145, 2370],
    colors: ['#F59E0B', '#3B82F6', '#10B981', '#6B7280'],
  },
  monthlyRevenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [8500, 9200, 11500, 14200, 15800, 17500, 18200, 19400, 16500, 12800, 11500, 10950],
  },
  userEngagement: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    activeUsers: [650, 720, 780, 820, 790, 680, 590],
    newSignups: [25, 32, 45, 38, 28, 22, 18],
  },
  topCountries: {
    labels: ['United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia', 'India', 'Japan'],
    data: [425, 285, 195, 168, 145, 125, 98, 82],
  },
  ageDistribution: {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    data: [185, 412, 328, 195, 87, 40],
  },
};

export const getUserStats = () => adminStats.overview;
export const getTripStats = () => ({
  total: adminStats.overview.totalTrips,
  completed: adminStats.tripStatus.data[3],
  upcoming: adminStats.tripStatus.data[1],
  planning: adminStats.tripStatus.data[0],
});
export const getDestinationStats = () => ({
  total: adminStats.overview.totalDestinations,
  topDestinations: adminStats.destinationPopularity.labels.slice(0, 5),
});

export const getMonthlyData = (month) => ({
  users: adminStats.userGrowth.data[month],
  trips: adminStats.tripTrends.data[month],
  revenue: adminStats.monthlyRevenue.data[month],
});

export const getGrowthPercentage = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};