import { Clock, Star, DollarSign, Tag, MapPin } from 'lucide-react';

const ActivityCard = ({ activity, onAdd }) => {
  return (
    <div className="card group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-32 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 text-dark text-[10px]">{activity.category}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge bg-accent/90 text-white">
            <Star className="w-3 h-3 mr-1" />
            {activity.rating}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-dark leading-tight">{activity.name}</h4>
        <p className="text-xs text-dark-lighter/60 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {activity.city}
        </p>

        <div className="flex items-center gap-3 text-xs text-dark-lighter/60">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {activity.duration}h
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {activity.cost === 0 ? 'Free' : `$${activity.cost}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {activity.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="badge bg-surface-alt text-[10px]">{tag}</span>
          ))}
        </div>

        <button onClick={() => onAdd?.(activity)} className="btn-primary w-full text-sm py-2 mt-2">
          Add to Itinerary
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
