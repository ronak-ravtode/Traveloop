import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, Share2, Edit, ArrowLeft, Clock } from 'lucide-react';
import { getTripById } from '../data/mockTrips';
import { mockTrips } from '../data/mockTrips';

const ItineraryView = () => {
  const { tripId } = useParams();
  const trip = mockTrips.find(t => t.id === tripId) || getTripById('1');

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/trips" className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">{trip.title}</h1>
          <p className="text-dark-lighter/60">{trip.description}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/trips/${tripId}/edit`} className="btn-secondary">
            <Edit className="w-5 h-5" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <button className="btn-primary">
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Duration</p>
              <p className="font-semibold text-dark">
                {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Cities</p>
              <p className="font-semibold text-dark">{trip.cities.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Budget</p>
              <p className="font-semibold text-dark">${trip.budget.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Activities</p>
              <p className="font-semibold text-dark">{trip.activities.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-dark-lighter/10">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-dark">Cities & Dates</h2>
            <div className="flex gap-2">
              <Link to={`/trips/${tripId}/budget`} className="btn-ghost text-xs py-1.5">Budget</Link>
              <Link to={`/trips/${tripId}/packing`} className="btn-ghost text-xs py-1.5">Packing</Link>
              <Link to={`/trips/${tripId}/notes`} className="btn-ghost text-xs py-1.5">Notes</Link>
            </div>
          </div>
        </div>
        <div className="divide-y divide-dark-lighter/5">
          {trip.cities.map((cityStop, index) => (
            <div key={cityStop.cityId} className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center">
                {index + 1}
              </div>
              <img src={cityStop.city.image} alt={cityStop.city.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-dark">{cityStop.city.name}, {cityStop.city.country}</p>
                <p className="text-sm text-dark-lighter/60">
                  {formatDate(cityStop.startDate)} - {formatDate(cityStop.endDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-dark-lighter/10">
          <h2 className="font-display font-semibold text-dark">Daily Itinerary</h2>
        </div>
        <div className="divide-y divide-dark-lighter/5">
          {trip.activities.map((act, index) => (
            <div key={index} className="p-4 flex items-start gap-4">
              <div className="w-16 text-center">
                <p className="text-xs text-dark-lighter/60">{act.time}</p>
              </div>
              <img src={act.activity.image} alt={act.activity.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium text-dark">{act.activity.name}</p>
                <p className="text-sm text-dark-lighter/60">{act.activity.city} • {act.activity.duration}h</p>
                {act.notes && <p className="text-sm text-primary mt-1">Note: {act.notes}</p>}
              </div>
              <span className="badge bg-surface-alt text-xs">${act.activity.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
