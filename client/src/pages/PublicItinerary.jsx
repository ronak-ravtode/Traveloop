import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Clock, Users, ArrowLeft, Share2 } from 'lucide-react';
import { getTripByShareCode } from '../data/mockTrips';

const PublicItinerary = () => {
  const { shareCode } = useParams();
  const trip = getTripByShareCode(shareCode);

  if (!trip) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center p-6">
        <div className="card p-8 text-center max-w-md">
          <h2 className="text-xl font-display font-bold text-dark mb-2">Itinerary Not Found</h2>
          <p className="text-dark-lighter/60 mb-6">This shared itinerary doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="font-display font-bold">Traveloop</span>
            </div>
            <Link to="/login" className="px-4 py-2 bg-white/20 rounded-xl text-sm hover:bg-white/30 transition-colors">
              Plan Your Own Trip
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{trip.title}</h1>
          <p className="text-white/80 mb-4">{trip.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {trip.cities.length} cities
            </span>
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              ${trip.budget.total.toLocaleString()} budget
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-dark-lighter/10">
            <h2 className="font-display font-semibold text-dark">Cities</h2>
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
                  <p className="text-sm text-dark-lighter/60">{formatDate(cityStop.startDate)} - {formatDate(cityStop.endDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-4 border-b border-dark-lighter/10">
            <h2 className="font-display font-semibold text-dark">Activities</h2>
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
                </div>
                <span className="badge bg-surface-alt text-xs">${act.activity.cost}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 text-center">
          <h3 className="font-display font-semibold text-dark mb-2">Want to plan your own trip?</h3>
          <p className="text-sm text-dark-lighter/60 mb-4">Join Traveloop and start creating your perfect itinerary</p>
          <Link to="/signup" className="btn-primary">Get Started Free</Link>
        </div>
      </div>
    </div>
  );
};

export default PublicItinerary;
