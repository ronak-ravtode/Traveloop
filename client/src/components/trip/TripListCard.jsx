import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Users, Calendar, DollarSign, Eye, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { Badge } from '../ui';

const TripListCard = ({ trip, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

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

  // Fixed: Include start day in duration calculation
  const getDuration = () => {
    if (!trip.startDate || !trip.endDate) return '1 day';
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : '1 day';
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
      onDelete(tripId);
    }
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden group">
      {/* Cover Image - Click to view itinerary */}
      <div className="relative h-44 overflow-hidden">
        <Link to={`/trips/${tripId}/itinerary`} className="block absolute inset-0">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        </Link>
        <div className="absolute top-3 left-3">
          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>

        {/* Mobile: Action buttons visible */}
        <div className="absolute top-3 right-3 md:hidden flex gap-2">
          <Link
            to={`/trips/${tripId}/edit`}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-rose-500 hover:bg-white transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop: Menu button */}
        <div className="absolute top-3 right-3 hidden md:block" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 animate-fade-in">
              <Link
                to={`/trips/${tripId}/edit`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowMenu(false)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 w-full"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-lg text-white leading-tight line-clamp-1">{trip.title || 'Untitled Trip'}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-500 line-clamp-2">{trip.description || 'No description'}</p>

        {/* Trip Info */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{getDuration()}</span>
          </div>
        </div>

        {/* Cities and Budget */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {stops.slice(0, 3).map((stop, i) => (
                <img
                  key={i}
                  src={stop.image || stop.city?.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100'}
                  alt={stop.city || stop.name || 'City'}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
              ))}
              {stops.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500">
                  +{stops.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">{stops.length} {stops.length === 1 ? 'city' : 'cities'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-gray-900">{trip.budgetLimit?.toLocaleString() || trip.budget?.total?.toLocaleString() || '0'}</span>
          </div>
        </div>

        {/* Public Badge */}
        {trip.isPublic && (
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Public trip</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripListCard;