import { Clock, Star, DollarSign, MapPin } from 'lucide-react';

const ActivityCard = ({ activity, onAdd, onView }) => {
  const categoryIcons = {
    sightseeing: '🏛️',
    cultural: '🎭',
    museum: '🎨',
    outdoor: '🌳',
    historical: '🏺',
    water: '🌊',
    food: '🍽️',
    adventure: '🎢'
  };

  return (
    <div className="card group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative h-36 overflow-hidden cursor-pointer" onClick={() => onView?.(activity)}>
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 backdrop-blur-sm text-dark text-xs font-medium">
            {categoryIcons[activity.category] || '📍'} {activity.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge bg-accent text-white flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            {activity.rating}
          </span>
        </div>
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            Quick View
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-display font-semibold text-dark leading-tight mb-1 line-clamp-2">{activity.name}</h4>
        <p className="text-xs text-dark-lighter/60 flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3" />
          {activity.city}
        </p>

        <div className="flex items-center justify-between text-sm text-dark-lighter/70 mb-3">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            {activity.duration}h
          </span>
          <span className={`font-semibold ${activity.cost === 0 ? 'text-green-600' : 'text-dark'}`}>
            {activity.cost === 0 ? 'Free' : `$${activity.cost}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {activity.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="badge bg-surface-alt text-[10px]">{tag}</span>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onView?.(activity)}
            className="btn-secondary flex-1 text-sm py-2"
          >
            View
          </button>
          <button
            onClick={() => onAdd?.(activity)}
            className="btn-primary flex-1 text-sm py-2"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;