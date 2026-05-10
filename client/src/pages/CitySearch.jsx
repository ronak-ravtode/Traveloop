import { useState, useMemo } from 'react';
import { Search, MapPin, Globe, X, ChevronDown, Check, AlertCircle } from 'lucide-react';
import CityCard from '../components/trip/CityCard';
import { mockCities } from '../data/mockCities';
import { tripService } from '../data/mockTripService';

const CitySearch = () => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [costLevel, setCostLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(mockCities.map(c => c.region))];
    return ['all', ...uniqueRegions];
  }, []);

  const costLevels = [
    { value: 'all', label: 'All Costs' },
    { value: 'low', label: 'Budget ($)' },
    { value: 'medium', label: 'Mid-Range ($$)' },
    { value: 'high', label: 'Luxury ($$$)' },
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'cost-low', label: 'Cost: Low to High' },
    { value: 'cost-high', label: 'Cost: High to Low' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  const filteredCities = useMemo(() => {
    let result = [...mockCities];

    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(city =>
        city.name.toLowerCase().includes(lowerSearch) ||
        city.country.toLowerCase().includes(lowerSearch) ||
        city.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }

    // Region filter
    if (selectedRegion !== 'all') {
      result = result.filter(city => city.region === selectedRegion);
    }

    // Cost level filter
    if (costLevel !== 'all') {
      const costMap = { low: 1, medium: 2, high: 3 };
      result = result.filter(city => city.costIndex === costMap[costLevel]);
    }

    // Sorting
    switch (sortBy) {
      case 'popularity':
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'cost-low':
        result.sort((a, b) => a.costIndex - b.costIndex);
        break;
      case 'cost-high':
        result.sort((a, b) => b.costIndex - a.costIndex);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [search, selectedRegion, costLevel, sortBy]);

  const handleAddToTrip = (city) => {
    const userTrips = tripService.getAll();
    if (userTrips.length === 0) {
      setToast({ visible: true, message: 'Create a trip first to add cities', type: 'error' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
      return;
    }
    // Check if city already exists in any trip
    const inTrip = userTrips.some(trip => trip.cities?.some(c => c.cityId === city.id));
    if (inTrip) {
      setToast({ visible: true, message: `${city.name} is already in one of your trips`, type: 'error' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
      return;
    }
    setSelectedCity(city);
    setShowModal(true);
  };

  const addCityToTrip = (tripId) => {
    const trip = tripService.getById(tripId);
    if (trip && selectedCity) {
      const existingCity = trip.cities?.find(c => c.cityId === selectedCity.id);
      if (!existingCity) {
        const newCity = {
          cityId: selectedCity.id,
          city: selectedCity.name,
          startDate: trip.startDate || new Date().toISOString().split('T')[0],
          endDate: trip.endDate || new Date().toISOString().split('T')[0],
          order: (trip.cities?.length || 0) + 1
        };
        tripService.update(tripId, {
          cities: [...(trip.cities || []), newCity]
        });
      }
    }
    setShowModal(false);
    setSelectedCity(null);
  };

  const activeFiltersCount = [selectedRegion !== 'all', costLevel !== 'all'].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
          toast.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">City Search</h1>
          <p className="text-dark-lighter/60 mt-1">Discover destinations around the world</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${activeFiltersCount > 0 ? 'border-primary text-primary' : ''}`}
        >
          <Globe className="w-4 h-4" />
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
            placeholder="Search cities, countries, or tags..."
            className="input-field pl-12 pr-4"
          />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field appearance-none pr-10 cursor-pointer min-w-[180px]"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-lighter/40 pointer-events-none" />
        </div>
      </div>

      {showFilters && (
        <div className="card p-5 animate-in slide-in-from-top-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-lighter mb-2">Region</label>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedRegion === region
                        ? 'bg-primary text-white'
                        : 'bg-surface-alt text-dark-lighter hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {region === 'all' ? 'All Regions' : region}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-lighter mb-2">Cost Level</label>
              <div className="flex flex-wrap gap-2">
                {costLevels.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setCostLevel(level.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      costLevel === level.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-alt text-dark-lighter hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-lighter/60">
          {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'} found
        </p>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear search
          </button>
        )}
      </div>

      {filteredCities.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map(city => (
            <CityCard key={city.id} city={city} onSelect={handleAddToTrip} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <MapPin className="w-12 h-12 text-dark-lighter/30 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-dark mb-2">No cities found</h3>
          <p className="text-sm text-dark-lighter/60">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add to Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-dark-lighter/10 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-dark">Add to Trip</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-surface-alt text-dark-lighter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {selectedCity && (
                <div className="flex items-center gap-3 mb-5 p-3 bg-surface-alt rounded-xl">
                  <img
                    src={selectedCity.image}
                    alt={selectedCity.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-dark">{selectedCity.name}</p>
                    <p className="text-sm text-dark-lighter/60">{selectedCity.country}</p>
                  </div>
                </div>
              )}

              <p className="text-sm text-dark-lighter mb-4">Select a trip to add this city to:</p>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tripService.getAll().map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => addCityToTrip(trip.id)}
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

export default CitySearch;