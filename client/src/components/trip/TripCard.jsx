import { MapPin, Clock, Star, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => {
  const statusColors = {
    planning: 'bg-amber-100 text-amber-700',
    upcoming: 'bg-primary/10 text-primary',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="card group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
        <span className={`absolute top-3 right-3 ${statusColors[trip.status]} badge`}>
          {trip.status}
        </span>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-lg text-white leading-tight line-clamp-1">{trip.title}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-dark-lighter/70 line-clamp-2">{trip.description}</p>

        <div className="flex items-center gap-4 text-xs text-dark-lighter/60">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{trip.cities.length} cities</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-dark-lighter/10">
          <div className="flex -space-x-2">
            {trip.cities.slice(0, 3).map((c, i) => (
              <img
                key={i}
                src={c.city.image}
                alt={c.city.name}
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          {trip.isPublic && (
            <span className="badge-primary text-[10px]">
              <Users className="w-3 h-3" />
              Public
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
