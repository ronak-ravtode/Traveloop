import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Compass, Filter, X, Loader2, AlertCircle } from 'lucide-react';
import TripListCard from '../components/trip/TripListCard';
import { tripService } from '../data/mockTripService';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load trips from API
  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tripService.getAll();
        setTrips(data);
      } catch (err) {
        console.error('Error loading trips:', err);
        setError('Failed to load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  // Handle delete
  const handleDelete = async (tripId) => {
    try {
      await tripService.delete(tripId);
      // Refresh trips after delete
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err) {
      console.error('Error deleting trip:', err);
      alert('Failed to delete trip. Please try again.');
    }
  };

  // Filter trips based on search and status
  const filteredTrips = trips.filter(trip => {
    const matchesFilter = filter === 'all' || trip.status === filter;
    const tripTitle = trip.name || trip.title || '';
    const matchesSearch = tripTitle.toLowerCase().includes(search.toLowerCase()) ||
      trip.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Clear filters
  const clearFilters = () => {
    setSearch('');
    setFilter('all');
  };

  const hasFilters = search || filter !== 'all';
  const activeFilter = filter !== 'all' ? filter : null;

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'planning', label: 'Planning' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

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
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">My Trips</h1>
          <p className="text-dark-lighter/60 mt-1">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} total
          </p>
        </div>
        <Link to="/trips/create" className="btn-primary">
          <Plus className="w-5 h-5" />
          Create New Trip
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips by name..."
              className="input-field pl-12 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-dark-lighter/10 rounded-lg"
              >
                <X className="w-4 h-4 text-dark-lighter/40" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-dark-lighter/60 flex items-center gap-1.5">
            <Filter className="w-4 h-4" />
            Filter by status:
          </span>
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-alt text-dark-lighter hover:bg-dark-lighter/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-lighter/60">Showing results for:</span>
          {search && (
            <span className="badge bg-primary/10 text-primary flex items-center gap-1">
              Search: "{search}"
              <button onClick={() => setSearch('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeFilter && (
            <span className="badge bg-secondary/10 text-secondary flex items-center gap-1">
              Status: {activeFilter}
              <button onClick={() => setFilter('all')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Trip Grid or Empty State */}
      {filteredTrips.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <TripListCard key={trip._id || trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-surface-alt rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8 text-dark-lighter/30" />
          </div>
          <h3 className="font-display font-semibold text-dark mb-2">
            {hasFilters ? 'No trips match your filters' : 'No trips yet'}
          </h3>
          <p className="text-sm text-dark-lighter/60 mb-6">
            {hasFilters
              ? 'Try adjusting your search or filter criteria'
              : 'Start planning your first adventure!'}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          ) : (
            <Link to="/trips/create" className="btn-primary">
              <Plus className="w-5 h-5" />
              Create New Trip
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MyTrips;