import { MapPin, Clock, Star, DollarSign } from 'lucide-react';

const CityCard = ({ city, onSelect }) => {
  const costLabels = { 1: 'Budget', 2: 'Mid-Range', 3: 'Luxury' };
  const costColors = {
    1: 'bg-green-100 text-green-700',
    2: 'bg-yellow-100 text-yellow-700',
    3: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="card group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative h-40 overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div>
            <h3 className="font-display font-bold text-lg text-white">{city.name}</h3>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {city.country}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-white">{city.popularity}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-sm text-dark-lighter/70 line-clamp-2 mb-3">{city.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {city.tags.slice(0, 3).map(tag => (
            <span key={tag} className="badge bg-surface-alt text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-dark-lighter/60 mb-3">
          <span className="badge bg-surface-alt flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {city.region}
          </span>
          <span className={`badge ${costColors[city.costIndex]} flex items-center gap-1`}>
            <DollarSign className="w-3 h-3" />
            {costLabels[city.costIndex]}
          </span>
        </div>

        <button
          onClick={() => onSelect?.(city)}
          className="btn-primary w-full text-sm py-2 mt-auto"
        >
          Add to Trip
        </button>
      </div>
    </div>
  );
};

export default CityCard;