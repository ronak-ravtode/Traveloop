import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, DollarSign, Share2, Edit, ArrowLeft, Clock,
  LayoutList, Grid3X3, Plane, Ticket, Utensils, Camera, Landmark, Sun, Sparkles, StickyNote, Loader2, AlertCircle
} from 'lucide-react';
import { tripService } from '../data/mockTripService';

const categoryIcons = {
  sightseeing: Landmark,
  cultural: Camera,
  museum: Landmark,
  outdoor: Sun,
  water: Sun,
  historical: Landmark,
  food: Utensils,
  entertainment: Ticket,
};

const ItineraryView = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tripService.getById(tripId);
        if (data) {
          // Normalize trip data
          const normalizedTrip = {
            ...data,
            title: data.name || data.title || 'Untitled Trip',
            stops: (data.stops || data.cities || []).map(stop => ({
              ...stop,
              name: stop.cityName || stop.city?.name || stop.name || stop.city || '',
              startDate: stop.arrivalDate || stop.startDate || '',
              endDate: stop.departureDate || stop.endDate || '',
            }))
          };
          setTrip(normalizedTrip);
        } else {
          navigate('/trips');
        }
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId, navigate]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatFullDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getDuration = () => {
    if (!trip?.startDate || !trip?.endDate) return 0;
    return Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleShare = () => {
    if (trip?.publicId) {
      navigator.clipboard.writeText(`${window.location.origin}/shared/${trip.publicId}`);
      alert('Share link copied to clipboard!');
    } else if (trip?.shareCode) {
      navigator.clipboard.writeText(`${window.location.origin}/shared/${trip.shareCode}`);
      alert('Share link copied to clipboard!');
    } else {
      alert('This trip is not public. Make it public to share.');
    }
  };

  // Get all activities organized by day
  const getTimelineData = () => {
    if (!trip) return [];
    
    // Flatten activities from all stops
    const stops = trip.stops || [];
    const allActivities = [];
    
    stops.forEach(stop => {
      (stop.activities || []).forEach(act => {
        allActivities.push({
          ...act,
          // Use stop dates if activity date is missing
          date: act.date || stop.startDate || stop.arrivalDate,
          city: stop
        });
      });
    });

    const days = {};
    allActivities.forEach(act => {
      if (!act.date) return;
      if (!days[act.date]) {
        days[act.date] = { date: act.date, city: act.city, activities: [] };
      }
      days[act.date].activities.push(act);
    });
    
    return Object.entries(days).sort(([a], [b]) => new Date(a) - new Date(b)).map(([date, data]) => ({
      dayNum: trip.startDate ? Math.ceil((new Date(date) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1 : 1,
      ...data,
    }));
  };

  // Get activities grouped by city
  const getCityGroupData = () => {
    if (!trip) return [];
    const stops = trip.stops || [];
    return stops.map(cityStop => {
      return {
        city: cityStop,
        cityName: cityStop.name || cityStop.cityName || cityStop.city?.name || 'Unknown City',
        cityCountry: cityStop.country,
        dates: `${formatDate(cityStop.startDate)} - ${formatDate(cityStop.endDate)}`,
        activities: cityStop.activities || [],
      };
    });
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

  if (!trip) return null;

  const stops = trip.stops || trip.cities || [];
  const activities = trip.activities || [];
  const timelineData = getTimelineData();
  const cityGroupData = getCityGroupData();
  const totalActivityCost = activities.reduce((sum, a) => sum + (a.activity?.cost || a.cost || 0), 0);
  const tripIdValue = trip._id || trip.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Link to="/trips" className="btn-ghost -ml-2 mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge ${trip.status === 'upcoming' ? 'bg-primary/10 text-primary' : trip.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>
                {trip.status}
              </span>
              {trip.isPublic && <span className="badge bg-green-50 text-green-600"><Share2 className="w-3 h-3 mr-1" />Public</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">{trip.title}</h1>
            <p className="text-dark-lighter/60 mt-1">{trip.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/trips/${tripIdValue}/edit`} className="btn-secondary">
            <Edit className="w-4 h-4" />
            Edit Itinerary
          </Link>
          <Link to={`/trips/${tripIdValue}/budget`} className="btn-secondary">
            <DollarSign className="w-4 h-4" />
            View Budget
          </Link>
          <Link to={`/trips/${tripIdValue}/notes`} className="btn-secondary">
            <StickyNote className="w-4 h-4" />
            Notes
          </Link>
          <button onClick={handleShare} className="btn-primary">
            <Share2 className="w-4 h-4" />
            Share Trip
          </button>
        </div>
      </div>

      {/* Trip Cover & Stats */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden">
        <img src={trip.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200'} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              <span>{getDuration()} days</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{stops.length} {stops.length === 1 ? 'city' : 'cities'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              <span>{activities.length} activities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Duration</p>
              <p className="text-xl font-display font-bold text-dark">{getDuration()} days</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-orange-500 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Destinations</p>
              <p className="text-xl font-display font-bold text-dark">{stops.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Activities</p>
              <p className="text-xl font-display font-bold text-dark">{activities.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Total Budget</p>
              <p className="text-xl font-display font-bold text-dark">${(trip.budget?.total || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-dark">Itinerary</h2>
        <div className="flex bg-surface-alt rounded-xl p-1">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'timeline' ? 'bg-white text-dark shadow-sm' : 'text-dark-lighter/60'}`}
          >
            <LayoutList className="w-4 h-4" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode('city')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'city' ? 'bg-white text-dark shadow-sm' : 'text-dark-lighter/60'}`}
          >
            <Grid3X3 className="w-4 h-4" />
            By City
          </button>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {timelineData.length > 0 ? (
            timelineData.map((day, dayIndex) => (
              <div key={day.date} className="relative">
                {dayIndex < timelineData.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-dark-lighter/10 -z-10" />
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-primary/20">
                    <span className="text-xs font-medium opacity-80">Day</span>
                    <span className="text-2xl font-display font-bold">{day.dayNum}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-display font-semibold text-dark">{formatFullDate(day.date)}</p>
                    {day.city && (
                      <div className="flex items-center gap-1.5 text-sm text-dark-lighter/60 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{day.city.city || day.city.name}, {day.city.country}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-20 space-y-3">
                  {day.activities.sort((a, b) => (a.time || '').localeCompare(b.time || '')).map((act, actIndex) => {
                    const activityData = act.activity || act;
                    const CategoryIcon = categoryIcons[activityData.category] || Ticket;
                    return (
                      <div key={actIndex} className="card p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-alt flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <CategoryIcon className="w-6 h-6 text-dark-lighter/50 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-dark">{activityData.name || activityData.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-sm text-dark-lighter/60">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {act.time || 'Anytime'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {activityData.duration || 1}h
                                  </span>
                                  <span className="capitalize">{activityData.category || 'activity'}</span>
                                </div>
                              </div>
                              <span className="text-lg font-semibold text-green-600">${activityData.cost || 0}</span>
                            </div>
                            {act.notes && (
                              <p className="mt-2 text-sm text-primary bg-primary/5 rounded-lg px-3 py-2">
                                <span className="font-medium">Note:</span> {act.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center">
              <Ticket className="w-12 h-12 text-dark-lighter/30 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-dark mb-2">No activities planned yet</h3>
              <p className="text-dark-lighter/60 mb-4">Add activities to build your itinerary</p>
              <Link to={`/trips/${tripIdValue}/edit`} className="btn-primary">
                <Edit className="w-4 h-4" />
                Add Activities
              </Link>
            </div>
          )}
        </div>
      )}

      {/* City Group View */}
      {viewMode === 'city' && (
        <div className="space-y-6">
          {cityGroupData.map((group, index) => (
            <div key={group.city._id || index} className="card overflow-hidden">
              <div className="relative h-32">
                <img src={group.city.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'} alt={group.cityName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-display font-bold text-white">{group.cityName}</h3>
                  </div>
                  <span className="text-white/80 text-sm">{group.dates}</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {group.activities.length > 0 ? (
                  group.activities.map((act, actIndex) => {
                    const activityData = act.activity || act;
                    const CategoryIcon = categoryIcons[activityData.category] || Ticket;
                    return (
                      <div key={actIndex} className="flex items-center gap-4 p-3 bg-surface-alt rounded-xl hover:bg-dark-lighter/5 transition-colors">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={activityData.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200'} alt={activityData.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-dark truncate">{activityData.name || activityData.title}</p>
                          <div className="flex items-center gap-3 text-sm text-dark-lighter/60">
                            <span>{act.time || 'Anytime'}</span>
                            <span>•</span>
                            <span>{activityData.duration || 1}h</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-dark">${activityData.cost || 0}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-dark-lighter/60 py-4">No activities in this city</p>
                )}
              </div>

              <div className="p-4 border-t border-dark-lighter/10 bg-surface-alt/50 flex items-center justify-between">
                <span className="text-sm text-dark-lighter/60">
                  {group.activities.length} {group.activities.length === 1 ? 'activity' : 'activities'}
                </span>
                <span className="font-semibold text-dark">
                  Total: ${group.activities.reduce((sum, a) => sum + (a.activity?.cost || a.cost || 0), 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trip Notes */}
      {trip.notes?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-display font-bold text-dark mb-4">Trip Notes</h3>
          <div className="space-y-3">
            {trip.notes.map(note => (
              <div key={note._id || note.id} className="p-3 bg-surface-alt rounded-xl">
                <div className="flex items-center gap-2 text-sm text-dark-lighter/60 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(note.date)}</span>
                  {note.city && (
                    <>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{note.city}</span>
                    </>
                  )}
                </div>
                <p className="text-dark">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryView;