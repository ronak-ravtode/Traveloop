import { MapPin, Clock, DollarSign } from 'lucide-react';

const CityCard = ({ city, onSelect }) => {
  return (
    <div className="card group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-36 overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <h3 className="font-display font-bold text-lg text-white">{city.name}</h3>
          <p className="text-xs text-white/80">{city.country}</p>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-4 text-xs text-dark-lighter/60">
          <span className="badge bg-surface-alt">{city.continent}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {city.timezone}
          </span>
        </div>
        <p className="text-xs text-dark-lighter/60">{city.language} • {city.population} residents</p>
        <button
          onClick={() => onSelect?.(city)}
          className="btn-secondary w-full text-sm py-2 mt-2"
        >
          Add to Trip
        </button>
      </div>
    </div>
  );
};

export default CityCard;
