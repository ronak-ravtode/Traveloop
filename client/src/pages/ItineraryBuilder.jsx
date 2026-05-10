import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Plus, Calendar, Clock, MapPin, Trash2, ArrowLeft, Save,
  ChevronUp, ChevronDown, X, Search, DollarSign, Activity, Flag
} from 'lucide-react';
import { tripService } from '../data/mockTripService';
import { mockCities } from '../data/mockCities';
import { mockActivities } from '../data/mockActivities';
import { DateInput } from '../components/forms';

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showActivityPicker, setShowActivityPicker] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Load trip data
  useEffect(() => {
    const trip = tripService.getById(tripId);
    if (trip) {
      setTripData({ ...trip });
    } else {
      navigate('/trips');
    }
  }, [tripId, navigate]);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  // Add a new stop (city)
  const addStop = (stopData) => {
    const city = mockCities.find(c => c.id === stopData.cityId);
    const newStop = {
      cityId: stopData.cityId,
      city,
      startDate: stopData.startDate,
      endDate: stopData.endDate,
      notes: stopData.notes || '',
      order: tripData.cities.length + 1,
      activities: [],
    };
    setTripData(prev => ({
      ...prev,
      cities: [...prev.cities, newStop],
    }));
    setShowAddStop(false);
    showToast(`Added ${city.name} to your itinerary`);
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

  // Add activity to a stop
  const addActivityToStop = (cityId, activity) => {
    const newActivity = {
      activityId: activity.id,
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
    showToast(`Added ${activity.name}`);
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

  // Calculate totals
  const totalStops = tripData?.cities?.length || 0;
  const totalActivities = tripData?.cities?.reduce((sum, c) => sum + (c.activities?.length || 0), 0) || 0;
  const estimatedCost = tripData?.cities?.reduce((sum, c) => {
    return sum + (c.activities?.reduce((a, act) => a + (act.activity?.cost || 0), 0) || 0);
  }, 0) || 0;

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!tripData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
            {toast.message}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
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
            onClick={() => {
              tripService.update(tripId, {
                cities: tripData.cities,
                activities: tripData.activities,
                budget: tripData.budget,
                notes: tripData.notes,
              });
              showToast('Changes saved successfully!');
            }}
            className="btn-primary"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>

        {/* Trip Dates Banner */}
        <div className="card p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-dark-lighter/60">Trip Dates:</span>
              <span className="font-medium text-dark">
                {formatDate(tripData.startDate)} - {formatDate(tripData.endDate)}
              </span>
            </div>
            {totalStops > 0 && (
              <>
                <div className="hidden md:block w-px h-6 bg-dark-lighter/20" />
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-secondary" />
                  <span className="font-medium text-dark">{totalStops} stops</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Stops */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stops List */}
            <div className="card">
              <div className="p-4 border-b border-dark-lighter/10 flex items-center justify-between">
                <h2 className="font-display font-semibold text-dark">Trip Stops</h2>
                <button
                  onClick={() => setShowAddStop(true)}
                  className="btn-primary text-sm py-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Stop
                </button>
              </div>

              <div className="p-4 space-y-4">
                {tripData.cities.length > 0 ? (
                  tripData.cities.map((stop, index) => (
                    <StopCard
                      key={stop.cityId}
                      stop={stop}
                      index={index}
                      total={tripData.cities.length}
                      onMove={moveStop}
                      onRemove={() => removeStop(stop.cityId)}
                      onAddActivity={() => setShowActivityPicker(stop.cityId)}
                      onRemoveActivity={(actIndex) => removeActivity(stop.cityId, actIndex)}
                      onUpdateActivity={updateActivity}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-dark-lighter/30 mx-auto mb-3" />
                    <p className="text-dark-lighter/60 mb-4">No stops added yet</p>
                    <button
                      onClick={() => setShowAddStop(true)}
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Stop
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Summary */}
          <div className="space-y-6">
            <div className="card p-5 sticky top-6">
              <h3 className="font-display font-semibold text-dark mb-4">Trip Summary</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Flag className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-dark-lighter/70">Total Stops</span>
                  </div>
                  <span className="font-display font-bold text-dark">{totalStops}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-dark-lighter/70">Total Activities</span>
                  </div>
                  <span className="font-display font-bold text-dark">{totalActivities}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-dark-lighter/70">Est. Activities Cost</span>
                  </div>
                  <span className="font-display font-bold text-dark">${estimatedCost}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dark-lighter/10">
                <Link
                  to={`/trips/${tripId}/itinerary`}
                  className="btn-secondary w-full justify-center"
                >
                  View Full Itinerary
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-5">
              <h4 className="font-semibold text-dark mb-3">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-dark-lighter/60">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Add stops in the order you'll visit them
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Assign dates to each stop for better planning
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Add activities to fill your daily itinerary
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add Stop Modal */}
      {showAddStop && (
        <AddStopModal
          cities={mockCities}
          existingStops={tripData.cities}
          onAdd={addStop}
          onClose={() => setShowAddStop(false)}
        />
      )}

      {/* Activity Picker Modal */}
      {showActivityPicker && (
        <ActivityPickerModal
          activities={mockActivities}
          onSelect={(activity) => addActivityToStop(showActivityPicker, activity)}
          onClose={() => setShowActivityPicker(null)}
        />
      )}
    </>
  );
};

// Stop Card Component
const StopCard = ({ stop, index, total, onMove, onRemove, onAddActivity, onRemoveActivity, onUpdateActivity }) => {
  const [expanded, setExpanded] = useState(true);

  const stopCost = stop.activities.reduce((sum, a) => sum + (a.activity?.cost || 0), 0);

  return (
    <div className="border border-dark-lighter/10 rounded-xl overflow-hidden">
      {/* Stop Header */}
      <div className="p-4 bg-surface-alt flex items-center gap-4">
        <div className="flex flex-col gap-1">
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
        </div>

        <img
          src={stop.city.image}
          alt={stop.city.name}
          className="w-14 h-14 rounded-xl object-cover"
        />

        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-dark">{stop.city.name}</h4>
          <p className="text-sm text-dark-lighter/60">{stop.city.country}</p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-dark-lighter/70">
            <Calendar className="w-4 h-4" />
            <span>{stop.startDate ? new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not set'}</span>
            <span className="text-dark-lighter/40">→</span>
            <span>{stop.endDate ? new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not set'}</span>
          </div>
          <p className="text-xs text-dark-lighter/50 mt-1">
            {stop.activities.length} {stop.activities.length === 1 ? 'activity' : 'activities'} • ${stopCost}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-ghost p-2 text-sm"
          >
            {expanded ? 'Hide' : 'Show'} activities
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg hover:bg-red-50 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Activities */}
      {expanded && (
        <div className="p-4 border-t border-dark-lighter/10">
          {stop.activities.length > 0 ? (
            <div className="space-y-3 mb-4">
              {stop.activities.map((act, actIndex) => (
                <div key={actIndex} className="flex items-center gap-3 p-3 bg-surface-alt rounded-xl">
                  <img
                    src={act.activity.image}
                    alt={act.activity.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark text-sm truncate">{act.activity.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="date"
                        value={act.date}
                        onChange={(e) => onUpdateActivity(act.activityId, actIndex, 'date', e.target.value)}
                        className="text-xs bg-white border border-dark-lighter/20 rounded px-2 py-1"
                      />
                      <input
                        type="time"
                        value={act.time}
                        onChange={(e) => onUpdateActivity(act.activityId, actIndex, 'time', e.target.value)}
                        className="text-xs bg-white border border-dark-lighter/20 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-dark">${act.activity.cost}</p>
                  </div>
                  <button
                    onClick={() => onRemoveActivity(actIndex)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-dark-lighter/50 mb-4">No activities added yet</p>
          )}

          <button
            onClick={onAddActivity}
            className="w-full py-2 border-2 border-dashed border-dark-lighter/20 rounded-xl text-dark-lighter/60 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>
      )}
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

  const availableCities = cities.filter(c => !existingStops.find(s => s.cityId === c.id));

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
                  key={city.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cityId: city.id }))}
                  className={`p-2 rounded-xl text-left transition-all ${
                    formData.cityId === city.id
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

  const filteredActivities = activities.filter(act =>
    act.name.toLowerCase().includes(search.toLowerCase()) ||
    act.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-dark-lighter/10 flex items-center justify-between">
          <h3 className="font-display font-semibold text-dark">Add Activity</h3>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-dark-lighter/10">
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
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            {filteredActivities.map(act => (
              <button
                key={act.id}
                onClick={() => onSelect(act)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors text-left"
              >
                <img src={act.image} alt={act.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark text-sm truncate">{act.name}</p>
                  <p className="text-xs text-dark-lighter/60">{act.city}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-dark-lighter/50">{act.duration}h</span>
                    <span className="text-xs font-medium text-green-600">${act.cost}</span>
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