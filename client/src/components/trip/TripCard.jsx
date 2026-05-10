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
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link
      to={`/trips/${trip.id}/itinerary`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-lg text-white leading-tight line-clamp-1">{trip.title}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-500 line-clamp-2">{trip.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{trip.cities.length} cities</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex -space-x-2">
            {trip.cities.slice(0, 3).map((c, i) => (
              <img
                key={i}
                src={c.city.image}
                alt={c.city.name}
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
            ))}
            {trip.cities.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500">
                +{trip.cities.length - 3}
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