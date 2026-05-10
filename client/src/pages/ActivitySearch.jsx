import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Clock, Star, MapPin, DollarSign, Calendar, Check, AlertCircle, Loader2 } from 'lucide-react';
import ActivityCard from '../components/trip/ActivityCard';
import { activityAPI, cityAPI } from '../services/api';
import { tripService } from '../data/mockTripService';

const ActivitySearch = () => {
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [costRange, setCostRange] = useState('all');
  const [duration, setDuration] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewActivity, setViewActivity] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Fetch activities and cities from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [activitiesRes, citiesRes] = await Promise.all([
          activityAPI.getAll({ limit: 100 }),
          cityAPI.getAll({ limit: 50 })
        ]);
        setActivities(activitiesRes.data || []);
        setCities(citiesRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load activities. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sightseeing', label: 'Sightseeing' },
    { value: 'culture', label: 'Cultural' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'nature', label: 'Nature' },
    { value: 'nightlife', label: 'Nightlife' },
    { value: 'shopping', label: 'Shopping' },
  ];

  const costRanges = [
    { value: 'all', label: 'Any Price' },
    { value: 'free', label: 'Free' },
    { value: '0-25', label: '$0 - $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50+', label: '$50+' },
  ];

  const durations = [
    { value: 'all', label: 'Any Duration' },
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4+ hours' },
  ];

  const cityOptions = useMemo(() => {
    return [{ _id: 'all', name: 'All Cities' }, ...cities];
  }, [cities]);

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(act =>
        act.title?.toLowerCase().includes(lowerSearch) ||
        act.city?.name?.toLowerCase().includes(lowerSearch) ||
        act.description?.toLowerCase().includes(lowerSearch)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(act => act.category === selectedCategory);
    }

    // Cost range filter
    if (costRange !== 'all') {
      result = result.filter(act => {
        if (costRange === 'free') return act.cost === 0;
        if (costRange === '50+') return act.cost >= 50;
        const [min, max] = costRange.split('-').map(Number);
        return act.cost >= min && act.cost <= max;
      });
    }

    // Duration filter
    if (duration !== 'all') {
      const dur = parseInt(duration);
      if (dur === 4) {
        result = result.filter(act => act.duration >= 4);
      } else {
        result = result.filter(act => act.duration === dur);
      }
    }

    // City filter - match by city name
    if (selectedCity !== 'all') {
      const selectedCityObj = cities.find(c => c._id === selectedCity);
      if (selectedCityObj) {
        result = result.filter(act => act.city?._id === selectedCity || act.city?.name === selectedCityObj.name);
      }
    }

    return result;
  }, [activities, search, selectedCategory, costRange, duration, selectedCity, cities]);

  const handleAddToTrip = (activity) => {
    setViewActivity(activity);
    setShowAddModal(true);
  };

  const addActivityToTrip = async (tripId) => {
    try {
      const trip = tripService.getById(tripId);
      if (trip && viewActivity) {
        const newActivity = {
          activityId: viewActivity._id,
          activity: viewActivity.title,
          cityId: viewActivity.city?._id,
          city: viewActivity.city?.name || viewActivity.city,
          date: trip.startDate || new Date().toISOString().split('T')[0],
          time: '10:00',
          notes: ''
        };
        await tripService.update(tripId, {
          activities: [...(trip.activities || []), newActivity]
        });
        setToast({ visible: true, message: `Added ${viewActivity.title} to trip!`, type: 'success' });
        setTimeout(() => setToast({ visible: false, message: '' }), 3000);
      }
      setShowAddModal(false);
      setViewActivity(null);
    } catch (err) {
      console.error('Error adding activity:', err);
      setToast({ visible: true, message: 'Failed to add activity to trip', type: 'error' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    }
  };

  const activeFiltersCount = [selectedCategory !== 'all', costRange !== 'all', duration !== 'all', selectedCity !== 'all'].filter(Boolean).length;

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
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-20 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
          toast.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Activity Search</h1>
          <p className="text-dark-lighter/60 mt-1">Find the best experiences for your trip</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${activeFiltersCount > 0 ? 'border-primary text-primary' : ''}`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities, cities, or tags..."
            className="input-field pl-12 pr-4"
          />
        </div>
      </div>

      {/* Quick filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.slice(1, 6).map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(selectedCategory === cat.value ? 'all' : cat.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.value
                ? 'bg-primary text-white'
                : 'bg-white text-dark-lighter hover:bg-surface-alt border border-dark-lighter/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="card p-5 animate-in slide-in-from-top-2">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Category */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-lighter mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Cost Range */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-lighter mb-2">Price Range</label>
              <select
                value={costRange}
                onChange={(e) => setCostRange(e.target.value)}
                className="input-field cursor-pointer"
              >
                {costRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-lighter mb-2">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-field cursor-pointer"
              >
                {durations.map(dur => (
                  <option key={dur.value} value={dur.value}>{dur.label}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-lighter mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field cursor-pointer"
              >
                {cityOptions.map(city => (
                  <option key={city._id} value={city._id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-lighter/60">
          {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
        </p>
        {(search || activeFiltersCount > 0) && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setCostRange('all');
              setDuration('all');
              setSelectedCity('all');
            }}
            className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>

      {filteredActivities.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map(activity => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onAdd={handleAddToTrip}
              onView={setViewActivity}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Filter className="w-12 h-12 text-dark-lighter/30 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-dark mb-2">No activities found</h3>
          <p className="text-sm text-dark-lighter/60">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Quick View Modal */}
      {viewActivity && !showAddModal && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-64 overflow-hidden">
              <img
                src={viewActivity.image}
                alt={viewActivity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
              <button
                onClick={() => setViewActivity(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="badge bg-white/20 backdrop-blur-sm text-white mb-2">
                  {viewActivity.category}
                </span>
                <h2 className="font-display font-bold text-2xl text-white">{viewActivity.title}</h2>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
              <p className="text-dark-lighter/70 mb-6 leading-relaxed">{viewActivity.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-surface-alt rounded-xl text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-dark-lighter/60">Duration</p>
                  <p className="font-semibold text-dark">{viewActivity.duration} hours</p>
                </div>
                <div className="p-3 bg-surface-alt rounded-xl text-center">
                  <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-dark-lighter/60">Cost</p>
                  <p className="font-semibold text-dark">{viewActivity.cost === 0 ? 'Free' : `$${viewActivity.cost}`}</p>
                </div>
                <div className="p-3 bg-surface-alt rounded-xl text-center">
                  <Star className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className="text-xs text-dark-lighter/60">Rating</p>
                  <p className="font-semibold text-dark">{viewActivity.rating}</p>
                </div>
                <div className="p-3 bg-surface-alt rounded-xl text-center">
                  <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-dark-lighter/60">City</p>
                  <p className="font-semibold text-dark">{viewActivity.city?.name || viewActivity.city}</p>
                </div>
              </div>

              <div className="p-4 bg-surface-alt rounded-xl mb-6">
                <div className="flex items-center gap-2 text-dark-lighter/70 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Recommended Time</span>
                </div>
                <p className="text-dark font-medium">{viewActivity.recommendedTime || 'Any time'}</p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary w-full py-3 text-lg"
              >
                Add to Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Trip Modal */}
      {showAddModal && viewActivity && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-dark-lighter/10 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-dark">Add to Trip</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setViewActivity(null);
                }}
                className="p-2 rounded-lg hover:bg-surface-alt text-dark-lighter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-5 p-3 bg-surface-alt rounded-xl">
                <img
                  src={viewActivity.image}
                  alt={viewActivity.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-dark">{viewActivity.title}</p>
                  <p className="text-sm text-dark-lighter/60 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {viewActivity.city?.name || viewActivity.city}
                  </p>
                </div>
              </div>

              <p className="text-sm text-dark-lighter mb-4">Select a trip to add this activity to:</p>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tripService.getAll().map(trip => (
                  <button
                    key={trip._id || trip.id}
                    onClick={() => addActivityToTrip(trip._id || trip.id)}
                    className="w-full p-3 text-left rounded-xl border border-dark-lighter/10 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <p className="font-medium text-dark group-hover:text-primary">{trip.title}</p>
                    <p className="text-xs text-dark-lighter/60">
                      {trip.startDate && trip.endDate
                        ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`
                        : 'No dates set'}
                    </p>
                  </button>
                ))}

                {tripService.getAll().length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-dark-lighter/60 text-sm">No trips found</p>
                    <a href="/trips/create" className="text-primary text-sm hover:underline">
                      Create a trip first
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySearch;