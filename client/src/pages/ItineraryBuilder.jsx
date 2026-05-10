import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Plus, Calendar, Clock, MapPin, Trash2, ArrowLeft, Save,
  ChevronUp, ChevronDown, X, Search, DollarSign, Activity, Flag, Loader2, AlertCircle
} from 'lucide-react';
import { tripService } from '../data/mockTripService';
import { cityAPI, activityAPI } from '../services/api';
import { DateInput } from '../components/forms';

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showActivityPicker, setShowActivityPicker] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trip, citiesData, activitiesData] = await Promise.all([
          tripService.getById(tripId),
          cityAPI.getAll({ limit: 50 }),
          activityAPI.getAll({ limit: 100 })
        ]);

        if (trip) {
          setTripData({
            ...trip,
            title: trip.name || trip.title || '',
            cities: (trip.stops || trip.cities || []).map(stop => ({
              ...stop,
              cityId: stop.city?._id || stop.cityId || stop._id,
              startDate: stop.arrivalDate || stop.startDate || '',
              endDate: stop.departureDate || stop.endDate || '',
              activities: (stop.activities || []).map(act => ({
                ...act,
                activityId: act.activity?._id || act.activityId || act._id,
              }))
            })),
            activities: trip.activities || []
          });
        } else {
          navigate('/trips');
        }

        setCities(citiesData.data || []);
        setActivities(activitiesData.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load trip data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  // Add a new stop (city)
  const addStop = async (stopData) => {
    const city = cities.find(c => c._id === stopData.cityId);
    const newStop = {
      cityId: stopData.cityId,
      city: city?.name,
      country: city?.country,
      cityData: city,
      startDate: stopData.startDate,
      endDate: stopData.endDate,
      notes: stopData.notes || '',
      order: tripData.cities.length + 1,
      activities: [],
    };

    const updatedCities = [...tripData.cities, newStop];
    setTripData(prev => ({ ...prev, cities: updatedCities }));
    setShowAddStop(false);
    showToast(`Added ${city?.name || 'city'} to your itinerary`);
  };

  // Remove a stop
  const removeStop = (cityId) => {
    if (window.confirm('Remove this stop from your itinerary?')) {
      setTripData(prev => ({
        ...prev,
        cities: prev.cities.filter(c => c.cityId !== cityId).map((c, i) => ({ ...c, order: i + 1 })),
      }));
      showToast('Stop removed');
    }
  };

  // Move stop up/down
  const moveStop = (index, direction) => {
    const newCities = [...tripData.cities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCities.length) return;

    [newCities[index], newCities[targetIndex]] = [newCities[targetIndex], newCities[index]];
    newCities.forEach((c, i) => c.order = i + 1);

    setTripData(prev => ({ ...prev, cities: newCities }));
  };

  const updateStopField = (cityId, field, value) => {
    setTripData(prev => ({
      ...prev,
      cities: prev.cities.map(c => {
        if ((c.cityId || c._id) === cityId) {
          return { ...c, [field]: value };
        }
        return c;
      }),
    }));
  };

  // Add activity to a stop
  const addActivityToStop = (cityId, activity) => {
    const newActivity = {
      activityId: activity._id,
      activity,
      cityId,
      date: '',
      time: '10:00',
      notes: '',
    };
    setTripData(prev => ({
      ...prev,
      cities: prev.cities.map(c => {
        if (c.cityId === cityId) {
          return { ...c, activities: [...c.activities, newActivity] };
        }
        return c;
      }),
    }));
    setShowActivityPicker(null);
    showToast(`Added ${activity.title || activity.name}`);
  };

  // Remove activity from stop
  const removeActivity = (cityId, activityIndex) => {
    setTripData(prev => ({
      ...prev,
      cities: prev.cities.map(c => {
        if (c.cityId === cityId) {
          return { ...c, activities: c.activities.filter((_, i) => i !== activityIndex) };
        }
        return c;
      }),
    }));
  };

  // Update activity details
  const updateActivity = (cityId, activityIndex, field, value) => {
    setTripData(prev => ({
      ...prev,
      cities: prev.cities.map(c => {
        if (c.cityId === cityId) {
          const newActivities = [...c.activities];
          newActivities[activityIndex] = { ...newActivities[activityIndex], [field]: value };
          return { ...c, activities: newActivities };
        }
        return c;
      }),
    }));
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      // Map frontend cities back to backend stops
      const stops = tripData.cities.map(city => ({
        city: city.cityId || city.city?._id,
        cityName: city.city || city.cityName || '',
        country: city.country || '',
        arrivalDate: city.startDate || '',
        departureDate: city.endDate || '',
        notes: city.notes || '',
        order: city.order || 0,
        activities: (city.activities || []).map(act => ({
          activity: act.activityId || act.activity?._id,
          title: act.activity?.title || act.title || '',
          category: act.activity?.category || act.category || '',
          time: act.time || '10:00',
          duration: act.activity?.duration || act.duration || 1,
          cost: act.activity?.cost || act.cost || 0
        }))
      }));

      await tripService.update(tripId, {
        name: tripData.title,
        stops: stops
      });
      showToast('Changes saved successfully!');
    } catch (err) {
      console.error('Error saving trip:', err);
      showToast('Failed to save changes. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Calculate totals
  const stops = tripData?.cities || [];
  const totalStops = stops.length;
  const totalActivities = stops.reduce((sum, c) => sum + (c.activities?.length || 0), 0);
  const estimatedCost = stops.reduce((sum, c) => {
    return sum + (c.activities?.reduce((a, act) => a + (act.activity?.cost || act.cost || 0), 0) || 0);
  }, 0) || 0;

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/trips')} className="btn-primary">
          Back to Trips
        </button>
      </div>
    );
  }

  if (!tripData) return null;

  return (
    <>
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-[100] animate-slide-in ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          <div className="text-white px-6 py-3 rounded-xl shadow-lg">
            {toast.message}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to={`/trips/${tripId}/itinerary`} className="btn-ghost -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-dark">Itinerary Builder</h1>
              <p className="text-dark-lighter/60">{tripData.title}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-4">
          {stops.length > 0 ? (
            stops.map((stop, index) => (
              <SectionCard
                key={stop.cityId || stop._id || index}
                sectionNumber={index + 1}
                stop={stop}
                index={index}
                total={stops.length}
                onMove={moveStop}
                onRemove={() => removeStop(stop.cityId || stop._id)}
                onAddActivity={() => setShowActivityPicker(stop.cityId || stop._id)}
                onRemoveActivity={(actIndex) => removeActivity(stop.cityId || stop._id, actIndex)}
                onUpdateActivity={(actIndex, field, value) => updateActivity(stop.cityId || stop._id, actIndex, field, value)}
                onUpdateStop={(field, value) => updateStopField(stop.cityId || stop._id, field, value)}
              />
            ))
          ) : (
            <div className="card p-12 text-center">
              <MapPin className="w-12 h-12 text-dark-lighter/30 mx-auto mb-3" />
              <p className="text-dark-lighter/60 mb-4">No sections added yet</p>
              <button
                onClick={() => setShowAddStop(true)}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4" />
                Add Your First Section
              </button>
            </div>
          )}

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowAddStop(true)}
              className="btn-secondary"
            >
              <Plus className="w-5 h-5" />
              Add another Section
            </button>
          </div>
        </div>
      </div>

      {/* Add Stop Modal */}
      {showAddStop && (
        <AddStopModal
          cities={cities}
          existingStops={stops}
          onAdd={addStop}
          onClose={() => setShowAddStop(false)}
        />
      )}

      {/* Activity Picker Modal */}
      {showActivityPicker && (
        <ActivityPickerModal
          activities={activities}
          onSelect={(activity) => addActivityToStop(showActivityPicker, activity)}
          onClose={() => setShowActivityPicker(null)}
        />
      )}
    </>
  );
};

const SectionCard = ({ sectionNumber, stop, index, total, onMove, onRemove, onAddActivity, onRemoveActivity, onUpdateActivity, onUpdateStop }) => {
  const [expanded, setExpanded] = useState(false);

  const stopCity = stop.cityData || stop.city || {};
  const stopName = typeof stopCity === 'object' ? (stopCity.name || stop.cityName || 'Unknown City') : (stop.city || 'Unknown City');
  const stopCountry = typeof stopCity === 'object' ? (stopCity.country || stop.country || '') : (stop.country || '');
  const stopCost = (stop.activities || []).reduce((sum, a) => sum + (a.activity?.cost || a.cost || 0), 0);

  const startLabel = stop.startDate ? new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'xxx';
  const endLabel = stop.endDate ? new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'yyy';
  const budgetLabel = stop.budget ? `$${stop.budget}` : stopCost ? `$${stopCost}` : 'Not set';

  return (
    <div className="card p-5">
      {/* Section header row */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-display font-semibold text-dark text-base">
          Section {sectionNumber}:
          {(stopName && stopName !== 'Unknown City') && (
            <span className="ml-2 text-sm font-normal text-dark-lighter/60">
              {stopName}{stopCountry ? `, ${stopCountry}` : ''}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
            className="p-1 rounded hover:bg-dark-lighter/10 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronUp className="w-4 h-4 text-dark-lighter/60" />
          </button>
          <button
            onClick={() => onMove(index, 'down')}
            disabled={index === total - 1}
            className="p-1 rounded hover:bg-dark-lighter/10 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronDown className="w-4 h-4 text-dark-lighter/60" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded-lg hover:bg-red-50 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-dark-lighter/60 mb-4">
        All the necessary information about this section.<br />
        This can be anything like travel section, hotel or any other activity
      </p>

      {/* Date Range & Budget — two side-by-side boxes */}
      <div className="grid grid-cols-2 gap-3">
        {/* Date Range box */}
        <button
          type="button"
          onClick={() => setExpanded(prev => prev === 'dates' ? false : 'dates')}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dark-lighter/20 bg-transparent hover:border-primary/50 transition-colors text-left"
        >
          <Calendar className="w-4 h-4 text-dark-lighter/50 shrink-0" />
          <span className="text-sm text-dark">
            Date Range: &nbsp;<span className="text-dark-lighter/60">{startLabel} to {endLabel}</span>
          </span>
        </button>

        {/* Budget box */}
        <button
          type="button"
          onClick={() => setExpanded(prev => prev === 'budget' ? false : 'budget')}
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-dark-lighter/20 bg-transparent hover:border-primary/50 transition-colors text-left"
        >
          <span className="text-sm text-dark">Budget of this section</span>
          <span className="text-sm font-medium text-dark-lighter/60 ml-2">{budgetLabel}</span>
        </button>
      </div>

      {/* Expandable: Date inputs */}
      {expanded === 'dates' && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <DateInput
            label="Start Date"
            value={stop.startDate || ''}
            onChange={(e) => onUpdateStop('startDate', e.target.value)}
          />
          <DateInput
            label="End Date"
            value={stop.endDate || ''}
            onChange={(e) => onUpdateStop('endDate', e.target.value)}
          />
        </div>
      )}

      {/* Expandable: Budget input */}
      {expanded === 'budget' && (
        <div className="mt-3">
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
            <input
              type="number"
              value={stop.budget || ''}
              onChange={(e) => onUpdateStop('budget', e.target.value)}
              placeholder={`${stopCost || 0}`}
              className="input-field pl-12"
            />
          </div>
          <p className="text-xs text-dark-lighter/50 mt-1">Estimated activities cost: ${stopCost}</p>
        </div>
      )}

      {/* Notes */}
      <div className="mt-3">
        <textarea
          value={stop.notes || ''}
          onChange={(e) => onUpdateStop('notes', e.target.value)}
          placeholder="Additional notes about this section..."
          className="input-field resize-none text-sm"
          rows={2}
        />
      </div>

      {/* Activities section */}
      <div className="mt-3 pt-3 border-t border-dark-lighter/10">
        <button
          onClick={() => setExpanded(prev => prev === 'activities' ? false : 'activities')}
          className="text-sm text-dark-lighter/60 hover:text-primary transition-colors flex items-center gap-1"
        >
          <Activity className="w-4 h-4" />
          {(stop.activities || []).length} activit{(stop.activities || []).length === 1 ? 'y' : 'ies'}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded === 'activities' ? 'rotate-180' : ''}`} />
        </button>

        {expanded === 'activities' && (
          <div className="mt-3 space-y-2">
            {(stop.activities || []).map((act, actIndex) => {
              const actData = act.activity || act;
              return (
                <div key={actIndex} className="flex items-center gap-3 p-3 bg-surface-alt rounded-xl">
                  <img
                    src={actData.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200'}
                    alt={actData.title || actData.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark text-sm truncate">{actData.title || actData.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="date"
                        value={act.date}
                        onChange={(e) => onUpdateActivity(actIndex, 'date', e.target.value)}
                        className="text-xs bg-white border border-dark-lighter/20 rounded px-2 py-1"
                      />
                      <input
                        type="time"
                        value={act.time}
                        onChange={(e) => onUpdateActivity(actIndex, 'time', e.target.value)}
                        className="text-xs bg-white border border-dark-lighter/20 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-dark">${actData.cost || 0}</p>
                  <button
                    onClick={() => onRemoveActivity(actIndex)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            <button
              onClick={onAddActivity}
              className="w-full py-2 border-2 border-dashed border-dark-lighter/20 rounded-xl text-dark-lighter/60 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add Stop Modal
const AddStopModal = ({ cities, existingStops, onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    cityId: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const existingIds = existingStops.map(s => s.cityId || s._id);
  const availableCities = cities.filter(c => !existingIds.includes(c._id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cityId) {
      setError('Please select a city');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError('Please select arrival and departure dates');
      return;
    }
    if (formData.endDate < formData.startDate) {
      setError('Departure date must be after arrival date');
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-dark-lighter/10 flex items-center justify-between">
          <h3 className="font-display font-semibold text-dark">Add Stop</h3>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Select City</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableCities.map(city => (
                <button
                  key={city._id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cityId: city._id }))}
                  className={`p-2 rounded-xl text-left transition-all ${
                    formData.cityId === city._id
                      ? 'bg-primary/10 border-primary border-2'
                      : 'bg-surface-alt hover:bg-dark-lighter/10'
                  }`}
                >
                  <img src={city.image} alt={city.name} className="w-full h-16 rounded-lg object-cover mb-2" />
                  <p className="text-sm font-medium text-dark truncate">{city.name}</p>
                  <p className="text-xs text-dark-lighter/60">{city.country}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DateInput
              label="Arrival Date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <DateInput
              label="Departure Date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any notes about this stop..."
              className="input-field resize-none"
              rows={2}
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Add Stop
          </button>
        </form>
      </div>
    </div>
  );
};

// Activity Picker Modal
const ActivityPickerModal = ({ activities, onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const filteredActivities = activities.filter(act => {
    const matchesSearch = (act.title || act.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (act.city?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === 'all' || act.city?._id === selectedCity;
    return matchesSearch && matchesCity;
  });

  const uniqueCities = [...new Set(activities.map(a => a.city).filter(Boolean))];

  return (
    <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-dark-lighter/10 flex items-center justify-between">
          <h3 className="font-display font-semibold text-dark">Add Activity</h3>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-dark-lighter/10 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activities..."
              className="input-field pl-12"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="input-field"
          >
            <option value="all">All Cities</option>
            {uniqueCities.map(city => (
              <option key={city._id} value={city._id}>{city.name}</option>
            ))}
          </select>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            {filteredActivities.map(act => (
              <button
                key={act._id}
                onClick={() => onSelect(act)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors text-left"
              >
                <img src={act.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200'} alt={act.title || act.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark text-sm truncate">{act.title || act.name}</p>
                  <p className="text-xs text-dark-lighter/60">{act.city?.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-dark-lighter/50">{act.duration || 1}h</span>
                    <span className="text-xs font-medium text-green-600">${act.cost || 0}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;