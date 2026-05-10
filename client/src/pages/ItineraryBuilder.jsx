import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Search, GripVertical, Trash2, ArrowLeft, Save } from 'lucide-react';
import { mockTrips, getTripById } from '../data/mockTrips';
import { mockActivities } from '../data/mockActivities';

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const trip = mockTrips.find(t => t.id === tripId) || getTripById('1');
  const [tripData, setTripData] = useState(trip);
  const [showActivityPicker, setShowActivityPicker] = useState(false);

  const addActivity = (activity) => {
    setTripData(prev => ({
      ...prev,
      activities: [...prev.activities, {
        activityId: activity.id,
        activity,
        cityId: '2',
        date: prev.startDate || new Date().toISOString().split('T')[0],
        time: '10:00',
        notes: '',
      }],
    }));
    setShowActivityPicker(false);
  };

  const removeActivity = (index) => {
    setTripData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/trips/${tripId}`} className="btn-ghost -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-dark">Edit Itinerary</h1>
            <p className="text-dark-lighter/60">{trip.title}</p>
          </div>
        </div>
        <button className="btn-primary">
          <Save className="w-5 h-5" /> Save Changes
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="p-4 border-b border-dark-lighter/10 flex items-center justify-between">
              <h2 className="font-display font-semibold text-dark">Activities</h2>
              <button onClick={() => setShowActivityPicker(true)} className="btn-secondary text-sm py-2">
                <Plus className="w-4 h-4" /> Add Activity
              </button>
            </div>
            <div className="p-4 space-y-3">
              {tripData.activities.map((act, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-surface-alt rounded-xl group">
                  <GripVertical className="w-5 h-5 text-dark-lighter/30 cursor-grab" />
                  <div className="flex items-center gap-3 flex-1">
                    <img src={act.activity.image} alt={act.activity.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark truncate">{act.activity.name}</p>
                      <p className="text-xs text-dark-lighter/60">{act.date} at {act.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeActivity(index)}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {tripData.activities.length === 0 && (
                <div className="text-center py-8 text-dark-lighter/60">
                  <p>No activities yet. Add some from the suggestions below.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="font-semibold text-dark mb-4">Quick Add Activities</h3>
            <div className="space-y-3">
              {mockActivities.slice(0, 4).map(act => (
                <button
                  key={act.id}
                  onClick={() => addActivity(act)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface-alt transition-colors text-left"
                >
                  <img src={act.image} alt={act.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{act.name}</p>
                    <p className="text-xs text-dark-lighter/60">{act.city}</p>
                  </div>
                  <Plus className="w-4 h-4 text-dark-lighter/40" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showActivityPicker && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-dark-lighter/10 flex items-center justify-between">
              <h3 className="font-display font-semibold text-dark">Select Activity</h3>
              <button onClick={() => setShowActivityPicker(false)} className="btn-ghost p-2">
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {mockActivities.map(act => (
                  <button
                    key={act.id}
                    onClick={() => addActivity(act)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors text-left"
                  >
                    <img src={act.image} alt={act.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-dark">{act.name}</p>
                      <p className="text-xs text-dark-lighter/60">{act.city} • {act.duration}h • ${act.cost}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;
