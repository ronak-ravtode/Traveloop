import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Compass, Star, TrendingUp, Loader2, Search, ArrowUpDown, Filter } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

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

  const userTrips = trips;
  const upcomingTrips = userTrips.filter(t => t.status === 'upcoming' || t.status === 'planning');

  const matchesSearch = (trip) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    const title = (trip.name || trip.title || '').toLowerCase();
    const desc = (trip.description || '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  };

  const sortedTrips = [...userTrips]
    .filter(matchesSearch)
    .sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || a.title || '').localeCompare(b.name || b.title || '');
      }
      const aDate = new Date(a.updatedAt || a.createdAt || a.startDate || 0).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt || b.startDate || 0).getTime();
      return bDate - aDate;
    });

  const recentTrips = sortedTrips.slice(0, 3);
  const recommendedCities = cities.slice(0, 5);

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
      {/* Banner Section */}
      <div className="card p-6 md:p-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">
              Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Traveler'}
            </h1>
            <p className="text-dark-lighter/60 mt-1">Ready for your next adventure?</p>
          </div>
          <Link to="/trips/create" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Plan a trip
          </Link>
        </div>
      </div>

      {/* Search / Group / Filter / Sort */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bar ...."
              className="input-field pl-12"
            />
          </div>

          <div className="flex gap-2">
            <button type="button" className="btn-secondary inline-flex items-center gap-2" disabled>
              <Filter className="w-4 h-4" />
              Group by
            </button>
            <button type="button" className="btn-secondary inline-flex items-center gap-2" disabled>
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              type="button"
              className="btn-secondary inline-flex items-center gap-2"
              onClick={() => setSortBy(prev => (prev === 'recent' ? 'name' : 'recent'))}
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort by...
            </button>
          </div>
        </div>
      </div>

      {/* Top Regional Selections */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Top Regional Selections</h2>
            <p className="section-subtitle mt-1">Popular cities for your next trip</p>
          </div>
          <Link to="/cities" className="btn-ghost text-sm inline-flex items-center gap-1">
            Explore More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {recommendedCities.map(city => (
            <Link
              key={city._id}
              to={`/cities?city=${city._id}`}
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
            </Link>
          ))}
        </div>
      </div>

      {/* Previous Trips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Previous Trips</h2>
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

        <div className="mt-6 flex justify-end">
          <Link to="/trips/create" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Plan a trip
          </Link>
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
                  {upcomingTrips[0].name || upcomingTrips[0].title}
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