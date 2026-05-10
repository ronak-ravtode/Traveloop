import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff, Calendar, MapPin, Wallet, Plus, ArrowRight, Compass, Star, TrendingUp, Loader2 } from 'lucide-react';
import TripCard from '../components/trip/TripCard';
import { tripService } from '../data/mockTripService';
import { cityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [tripsData, citiesData] = await Promise.all([
          tripService.getAll(),
          cityAPI.getAll({ limit: 4, sort: 'popularity:desc' })
        ]);

        setTrips(tripsData);
        setCities(citiesData.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from API data
  const userTrips = trips; // Backend filters by user
  const upcomingTrips = userTrips.filter(t => t.status === 'upcoming' || t.status === 'planning');
  const totalCitiesPlanned = userTrips.reduce((sum, trip) => sum + (trip.stops?.length || 0), 0);
  // Handle both old format (budget.total) and new server format (budgetLimit)
  const estimatedTotalBudget = userTrips.reduce((sum, trip) => sum + (trip.budgetLimit || trip.budget?.total || 0), 0);

  // Get recent trips (last 3)
  const recentTrips = userTrips.slice(0, 3);

  // Get recommended destinations (top 4 cities)
  const recommendedCities = cities.slice(0, 4);

  // Calculate budget stats - sum up all budget category values
  const totalSpent = userTrips.reduce((sum, trip) => {
    const budgetObj = trip.budget || {};
    const categorySum = Object.values(budgetObj).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
    return sum + categorySum;
  }, 0);
  const remainingBudget = estimatedTotalBudget - totalSpent;

  const stats = [
    { label: 'Total Trips', value: userTrips.length, icon: PlaneTakeoff, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Upcoming Trips', value: upcomingTrips.length, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Cities Planned', value: totalCitiesPlanned, icon: MapPin, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Est. Total Budget', value: `$${estimatedTotalBudget.toLocaleString()}`, icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Traveler'}
          </h1>
          <p className="text-dark-lighter/60 mt-1">Ready for your next adventure?</p>
        </div>
        <Link to="/trips/create" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Plan New Trip
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-dark">{value}</p>
            <p className="text-sm text-dark-lighter/60">{label}</p>
          </div>
        ))}
      </div>

      {/* Budget Highlight Card */}
      <div className="card p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-dark">Trip Budget Overview</h3>
              <p className="text-sm text-dark-lighter/60">Across all your trips</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <p className="text-lg font-display font-bold text-dark">${estimatedTotalBudget.toLocaleString()}</p>
              <p className="text-xs text-dark-lighter/60">Total Budget</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display font-bold text-amber-600">${totalSpent.toLocaleString()}</p>
              <p className="text-xs text-dark-lighter/60">Spent</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display font-bold text-green-600">${remainingBudget.toLocaleString()}</p>
              <p className="text-xs text-dark-lighter/60">Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Recent Trips</h2>
            <p className="section-subtitle mt-1">Your latest travel plans</p>
          </div>
          <Link to="/trips" className="btn-ghost text-sm inline-flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map(trip => (
              <TripCard key={trip._id || trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-surface-alt rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-dark-lighter/30" />
            </div>
            <h3 className="font-display font-semibold text-dark mb-2">No trips yet</h3>
            <p className="text-sm text-dark-lighter/60 mb-6">Start planning your first adventure!</p>
            <Link to="/trips/create" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Plan a Trip
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Destinations Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Recommended Destinations</h2>
            <p className="section-subtitle mt-1">Popular cities for your next trip</p>
          </div>
          <Link to="/search/cities" className="btn-ghost text-sm inline-flex items-center gap-1">
            Explore More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedCities.map(city => (
            <Link
              key={city._id}
              to={`/search/cities?city=${city._id}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display font-bold text-lg text-white">{city.name}</h3>
                <p className="text-sm text-white/70">{city.country}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-white/80">Popular</span>
                </div>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Trips Highlight */}
      {upcomingTrips.length > 0 && (
        <div className="card p-6 border-l-4 border-l-primary">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-dark">Next Adventure</h3>
              <p className="text-sm text-dark-lighter/60">Your nearest upcoming trip</p>
            </div>
          </div>
          {upcomingTrips[0] && (
            <Link to={`/trips/${upcomingTrips[0]._id || upcomingTrips[0].id}/itinerary`} className="flex items-center justify-between group">
              <div>
                <h4 className="font-display font-bold text-dark group-hover:text-primary transition-colors">
                  {upcomingTrips[0].title}
                </h4>
                <p className="text-sm text-dark-lighter/60">
                  {formatDate(upcomingTrips[0].startDate)} - {formatDate(upcomingTrips[0].endDate)}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-dark-lighter/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;