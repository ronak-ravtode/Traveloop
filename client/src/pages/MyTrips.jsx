import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Compass } from 'lucide-react';
import TripCard from '../components/trip/TripCard';
import { mockTrips } from '../data/mockTrips';

const MyTrips = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = ['all', 'upcoming', 'planning', 'ongoing', 'completed'];

  const filteredTrips = mockTrips.filter(trip => {
    const matchesFilter = filter === 'all' || trip.status === filter;
    const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase()) ||
      trip.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">My Trips</h1>
          <p className="text-dark-lighter/60 mt-1">Manage and plan your travel adventures</p>
        </div>
        <Link to="/trips/create" className="btn-primary">
          <Plus className="w-5 h-5" />
          New Trip
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trips..."
            className="input-field pl-12"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark-lighter hover:bg-surface-alt'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredTrips.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-surface-alt rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8 text-dark-lighter/30" />
          </div>
          <h3 className="font-display font-semibold text-dark mb-2">No trips found</h3>
          <p className="text-sm text-dark-lighter/60 mb-6">
            {search ? 'Try adjusting your search' : 'Start planning your next adventure!'}
          </p>
          <Link to="/trips/create" className="btn-primary">
            <Plus className="w-5 h-5" />
            Create Trip
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
