import { MapPin, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui';

const TripCard = ({ trip }) => {
  const statusConfig = {
    planning: { variant: 'secondary', label: 'Planning' },
    upcoming: { variant: 'primary', label: 'Upcoming' },
    ongoing: { variant: 'success', label: 'Ongoing' },
    completed: { variant: 'neutral', label: 'Completed' },
  };

  const status = statusConfig[trip.status] || statusConfig.planning;
  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Handle both old format (id, cities) and new format (_id, stops)
  const tripId = trip._id || trip.id;
  const stops = trip.stops || trip.cities || [];
  const cityCount = stops.length;

  return (
    <Link
      to={`/trips/${tripId}/itinerary`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-lg text-white leading-tight line-clamp-1">{trip.name || trip.title || 'Untitled Trip'}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-500 line-clamp-2">{trip.description || 'No description'}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{cityCount} {cityCount === 1 ? 'city' : 'cities'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex -space-x-2">
            {stops.slice(0, 3).map((stop, i) => (
              <img
                key={i}
                src={stop.image || stop.city?.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100'}
                alt={stop.city || stop.name || 'City'}
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
            ))}
            {cityCount > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500">
                +{cityCount - 3}
              </div>
            )}
          </div>
          {trip.isPublic && (
            <Badge variant="primary" size="sm" dot>
              Public
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TripCard;