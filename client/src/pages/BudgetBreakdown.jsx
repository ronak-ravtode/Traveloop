import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, AlertTriangle, Lightbulb, Building2, Plane, Utensils, Ticket, Coffee } from 'lucide-react';
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
  const trip = tripService.getById(tripId);

  const budgetData = useMemo(() => {
    if (!trip) return null;

    const { budget } = trip;
    const totalDays = trip.startDate && trip.endDate
      ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
      : 14;

    const total = budget.total || 0;
    const spent = budget.spent || 0;
    const remaining = total - spent;
    const percentSpent = total > 0 ? (spent / total) * 100 : 0;
    const avgPerDay = totalDays > 0 ? total / totalDays : 0;
    const spentPerDay = totalDays > 0 ? spent / totalDays : 0;

    // Category breakdown
    const categories = budget.categories || {};
    const categoryData = Object.entries(categories).map(([key, value]) => ({
      name: categoryLabels[key] || key,
      key,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      color: CATEGORY_COLORS[key] || '#999',
    }));

    // Day-wise spending (mock data based on trip duration)
    const dayData = [];
    for (let i = 1; i <= totalDays; i++) {
      const daySpending = spent / totalDays * (0.7 + Math.random() * 0.6);
      dayData.push({
        day: `Day ${i}`,
        spending: Math.round(daySpending),
        budget: avgPerDay,
      });
    }

    // City-wise cost breakdown (mock data distributed based on cities)
    const cityData = [];
    if (trip.cities && trip.cities.length > 0) {
      const cityCosts = [1200, 900, 1100]; // Mock distribution for cities
      trip.cities.forEach((city, idx) => {
        const cityName = typeof city.city === 'object' ? city.city?.name : city.city;
        const days = city.startDate && city.endDate
          ? Math.ceil((new Date(city.endDate) - new Date(city.startDate)) / (1000 * 60 * 60 * 24)) + 1
          : 4;
        cityData.push({
          city: cityName || `City ${idx + 1}`,
          days,
          cost: cityCosts[idx] || 500,
          perDay: Math.round((cityCosts[idx] || 500) / days),
        });
      });
    } else {
      cityData.push({ city: 'No cities added', days: 0, cost: 0, perDay: 0 });
    }

    // Insights
    const overBudgetDays = dayData.filter(d => d.spending > d.budget).length;
    const mostExpensiveCity = cityData.reduce((max, c) => c.cost > max.cost ? c : max, { city: '-', cost: 0 });
    const suggestedSavings = Math.round(categories.other * 0.2 || 100);

    return {
      total,
      spent,
      remaining,
      percentSpent,
      avgPerDay,
      spentPerDay,
      totalDays,
      categoryData,
      dayData,
      cityData,
      insights: {
        overBudgetDays,
        mostExpensiveCity,
        suggestedSavings,
      },
    };
  }, [trip]);

  if (!trip || !budgetData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/trips" className="btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Budget Breakdown</h1>
        </div>
        <div className="card p-12 text-center">
          <p className="text-dark-lighter/60">Trip not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/trips/${tripId}/itinerary`} className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Budget Breakdown</h1>
          <p className="text-dark-lighter/60">{trip.title}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-dark-lighter/60 uppercase tracking-wide">Total Budget</span>
          </div>
          <p className="text-2xl font-display font-bold text-dark">${budgetData.total.toLocaleString()}</p>
        </div>

        <div className="card p-5 border-l-4 border-l-accent">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-dark-lighter/60 uppercase tracking-wide">Spent</span>
          </div>
          <p className="text-2xl font-display font-bold text-accent">${budgetData.spent.toLocaleString()}</p>
        </div>

        <div className="card p-5 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-dark-lighter/60 uppercase tracking-wide">Remaining</span>
          </div>
          <p className={`text-2xl font-display font-bold ${budgetData.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
            ${budgetData.remaining.toLocaleString()}
          </p>
        </div>

        <div className="card p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-dark-lighter/60 uppercase tracking-wide">Avg/Day</span>
          </div>
          <p className="text-2xl font-display font-bold text-dark">${Math.round(budgetData.avgPerDay)}</p>
          <p className="text-xs text-dark-lighter/60">{budgetData.totalDays} days</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-dark">Budget Progress</h3>
          <span className={`badge ${budgetData.percentSpent > 100 ? 'bg-red-100 text-red-700' : budgetData.percentSpent > 80 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            {budgetData.percentSpent.toFixed(0)}% used
          </span>
        </div>
        <div className="h-4 bg-surface-alt rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetData.percentSpent > 100 ? 'bg-red-500' : budgetData.percentSpent > 80 ? 'bg-amber-500' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(budgetData.percentSpent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark-lighter/60">${budgetData.spent.toLocaleString()} spent</span>
          <span className="text-dark-lighter/60">${budgetData.total.toLocaleString()} budget</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Category Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {budgetData.categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={(value) => <span className="text-sm text-dark-lighter">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day-wise Bar Chart */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Daily Spending</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData.dayData} barSize={12}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => `$${value}`}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="budget" fill="#e5e7eb" name="Daily Budget" radius={[2, 2, 0, 0]} />
                <Bar dataKey="spending" fill="#0F766E" name="Actual Spending" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* City-wise Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-dark-lighter/10">
          <h3 className="font-display font-semibold text-dark">Cost by City</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt">
              <tr>
                <th className="text-left text-xs font-semibold text-dark-lighter/60 uppercase tracking-wide px-5 py-3">City</th>
                <th className="text-left text-xs font-semibold text-dark-lighter/60 uppercase tracking-wide px-5 py-3">Days</th>
                <th className="text-right text-xs font-semibold text-dark-lighter/60 uppercase tracking-wide px-5 py-3">Total Cost</th>
                <th className="text-right text-xs font-semibold text-dark-lighter/60 uppercase tracking-wide px-5 py-3">Per Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter/10">
              {budgetData.cityData.map((city, idx) => (
                <tr key={idx} className="hover:bg-surface-alt/50">
                  <td className="px-5 py-4 font-medium text-dark">{city.city}</td>
                  <td className="px-5 py-4 text-dark-lighter/70">{city.days} days</td>
                  <td className="px-5 py-4 text-right font-semibold text-dark">${city.cost.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-dark-lighter/70">${city.perDay}/day</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-surface-alt/50">
              <tr>
                <td className="px-5 py-3 font-semibold text-dark">Total</td>
                <td className="px-5 py-3 text-dark font-medium">{budgetData.totalDays} days</td>
                <td className="px-5 py-3 text-right font-semibold text-primary">${budgetData.spent.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-dark-lighter/70">${Math.round(budgetData.spentPerDay)}/day</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Category Details Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-dark-lighter/10">
          <h3 className="font-display font-semibold text-dark">Detailed Category Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt">
              <tr>
                <th className="text-left text-xs font-semibold text-dark-lighter/60 uppercase tracking-wide px-5 py-3">Category</th>
                <th className="text-right text-xs font-semibold text-dark-lighter/60 uppercase tracking-wide px-5 py-3">Amount</th>
                <th className="text-right text-xs font-semibold text-dark-lighter/60 uppercase tracking-wide px-5 py-3">% of Budget</th>
                <th className="text-left text-xs font-semibold text-dark-lighter/60 uppercase tracking-wide px-5 py-3">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter/10">
              {budgetData.categoryData.map((cat, idx) => (
                <tr key={idx} className="hover:bg-surface-alt/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-medium text-dark">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-dark">${cat.value.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-dark-lighter/70">{cat.percentage.toFixed(1)}%</td>
                  <td className="px-5 py-4">
                    <div className="w-24 h-2 bg-surface-alt rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight Alerts */}
      <div className="grid md:grid-cols-3 gap-4">
        {budgetData.insights.overBudgetDays > 0 && (
          <div className="card p-5 border border-red-200 bg-red-50/50">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-dark text-sm">Over Budget Days</h4>
                <p className="text-2xl font-bold text-red-600 mt-1">{budgetData.insights.overBudgetDays}</p>
                <p className="text-xs text-dark-lighter/60 mt-1">days exceeded daily budget</p>
              </div>
            </div>
          </div>
        )}

        <div className="card p-5 border border-purple-200 bg-purple-50/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-dark text-sm">Most Expensive City</h4>
              <p className="text-lg font-bold text-dark mt-1">{budgetData.insights.mostExpensiveCity.city}</p>
              <p className="text-xs text-dark-lighter/60 mt-1">${budgetData.insights.mostExpensiveCity.cost.toLocaleString()} total</p>
            </div>
          </div>
        </div>

        <div className="card p-5 border border-green-200 bg-green-50/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Lightbulb className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-dark text-sm">Potential Savings</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">${budgetData.insights.suggestedSavings}</p>
              <p className="text-xs text-dark-lighter/60 mt-1">20% from misc. expenses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetBreakdown;