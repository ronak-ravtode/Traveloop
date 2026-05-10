import { useParams, Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, AlertTriangle, Lightbulb, Building2, Plane, Utensils, Ticket, Coffee, Loader2, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { tripService } from '../data/mockTripService';

const COLORS = ['#0F766E', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];
const CATEGORY_COLORS = {
  accommodation: '#0F766E',
  flights: '#6366F1',
  food: '#F59E0B',
  activities: '#EF4444',
  transport: '#8B5CF6',
  other: '#EC4899',
};

const categoryLabels = {
  accommodation: 'Stay',
  flights: 'Flights',
  food: 'Meals',
  activities: 'Activities',
  transport: 'Transport',
  other: 'Miscellaneous',
};

const categoryIcons = {
  accommodation: Building2,
  flights: Plane,
  food: Utensils,
  activities: Ticket,
  transport: '🚗',
  other: Coffee,
};

const BudgetBreakdown = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const data = await tripService.getById(tripId);
        setTrip(data);
      } catch (err) {
        setError('Failed to load trip budget');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  const budgetData = useMemo(() => {
    if (!trip) return null;

    // Handle both old format (budget.total/spent/categories) and new server format (budgetLimit + budget object)
    const total = trip.budgetLimit || trip.budget?.total || 0;
    // For spent, calculate from budget categories or use default
    const budgetObj = trip.budget || {};
    const spent = Object.values(budgetObj).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);

    const stops = trip.stops || trip.cities || [];
    const totalDays = trip.startDate && trip.endDate
      ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
      : 14;

    const remaining = total - spent;
    const percentSpent = total > 0 ? (spent / total) * 100 : 0;
    const avgPerDay = totalDays > 0 ? total / totalDays : 0;
    const spentPerDay = totalDays > 0 ? spent / totalDays : 0;

    // Category breakdown - handle server format with transport/stay/activities/meals/miscellaneous
    const serverCategories = trip.budget || {};
    // Map server category names to display names
    const categoryMapping = {
      transport: 'transport',
      stay: 'accommodation',
      activities: 'activities',
      meals: 'food',
      miscellaneous: 'other',
    };
    const categories = {};
    Object.entries(serverCategories).forEach(([key, value]) => {
      const mappedKey = categoryMapping[key] || key;
      categories[mappedKey] = value;
    });
    const categoryData = Object.entries(categories).map(([key, value]) => ({
      name: categoryLabels[key] || key,
      key,
      value: value || 0,
      percentage: total > 0 ? ((value || 0) / total) * 100 : 0,
      color: CATEGORY_COLORS[key] || '#999',
    }));

    // Day-wise spending
    const dayData = [];
    for (let i = 1; i <= totalDays; i++) {
      const daySpending = spent / totalDays * (0.7 + Math.random() * 0.6);
      dayData.push({
        day: `Day ${i}`,
        spending: Math.round(daySpending),
        budget: avgPerDay,
      });
    }

    // City-wise cost breakdown
    const cityData = [];
    if (stops.length > 0) {
      const cityCosts = stops.map(() => Math.round(total / stops.length));
      stops.forEach((cityStop, idx) => {
        const cityName = cityStop.city || cityStop.name || `City ${idx + 1}`;
        const days = cityStop.startDate && cityStop.endDate
          ? Math.ceil((new Date(cityStop.endDate) - new Date(cityStop.startDate)) / (1000 * 60 * 60 * 24)) + 1
          : Math.round(totalDays / stops.length);
        cityData.push({
          city: cityName,
          days,
          cost: cityCosts[idx] || 0,
          perDay: Math.round((cityCosts[idx] || 0) / days) || 0,
        });
      });
    } else {
      cityData.push({ city: 'No cities added', days: 0, cost: 0, perDay: 0 });
    }

    // Insights
    const overBudgetDays = dayData.filter(d => d.spending > d.budget).length;
    const mostExpensiveCity = cityData.reduce((max, c) => c.cost > max.cost ? c : max, { city: '-', cost: 0 });
    const suggestedSavings = Math.round((categories.other || 100) * 0.2);

    return {
      total, spent, remaining, percentSpent, avgPerDay, spentPerDay,
      categoryData, dayData, cityData,
      overBudgetDays, mostExpensiveCity, suggestedSavings, totalDays
    };
  }, [trip]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-4">{error || 'Trip not found'}</p>
        <Link to="/trips" className="btn-primary">Back to Trips</Link>
      </div>
    );
  }

  if (!budgetData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/trips/${tripId}/itinerary`} className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-dark">Budget Breakdown</h1>
          <p className="text-dark-lighter/60">{trip.title}</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Total Budget</p>
              <p className="text-xl font-display font-bold text-dark">${budgetData.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Spent</p>
              <p className="text-xl font-display font-bold text-dark">${budgetData.spent.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${budgetData.remaining >= 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Remaining</p>
              <p className="text-xl font-display font-bold text-dark">${budgetData.remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold">{Math.round(budgetData.percentSpent)}%</span>
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Spent</p>
              <p className="text-sm font-display font-bold text-dark">of budget</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Spending by Category</h3>
          {budgetData.categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-dark-lighter/60">
              No budget categories set
            </div>
          )}
        </div>

        {/* Daily Spending */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Daily Spending vs Budget</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={budgetData.dayData.slice(0, 14)}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line type="monotone" dataKey="spending" stroke="#F59E0B" strokeWidth={2} name="Spending" />
                <Line type="monotone" dataKey="budget" stroke="#0F766E" strokeWidth={2} name="Budget" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* City Breakdown */}
      {budgetData.cityData.length > 0 && budgetData.cityData[0].cost > 0 && (
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Cost by Destination</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData.cityData}>
                <XAxis dataKey="city" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="cost" fill="#0F766E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-primary" />
          <h3 className="font-display font-semibold text-dark">Budget Insights</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl">
            <p className="text-sm text-dark-lighter/60 mb-1">Avg. per day</p>
            <p className="text-xl font-display font-bold text-dark">${Math.round(budgetData.avgPerDay)}</p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <p className="text-sm text-dark-lighter/60 mb-1">Most expensive</p>
            <p className="text-xl font-display font-bold text-dark">{budgetData.mostExpensiveCity.city}</p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <p className="text-sm text-dark-lighter/60 mb-1">Potential savings</p>
            <p className="text-xl font-display font-bold text-green-600">${budgetData.suggestedSavings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetBreakdown;