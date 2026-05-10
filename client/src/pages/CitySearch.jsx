import { useState } from 'react';
import { Search, MapPin, Globe, Filter, X } from 'lucide-react';
import CityCard from '../components/trip/CityCard';
import { mockCities, searchCities } from '../data/mockCities';

const CitySearch = () => {
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');

  const continents = ['all', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];

  const filteredCities = mockCities.filter(city => {
    const matchesContinent = selectedContinent === 'all' || city.continent === selectedContinent;
    const matchesSearch = search === '' ||
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">City Search</h1>
        <p className="text-dark-lighter/60 mt-1">Discover destinations around the world</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cities or countries..."
            className="input-field pl-12"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {continents.map(c => (
          <button
            key={c}
            onClick={() => setSelectedContinent(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedContinent === c
                ? 'bg-primary text-white'
                : 'bg-white text-dark-lighter hover:bg-surface-alt'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            {c === 'all' ? 'All Continents' : c}
          </button>
        ))}
      </div>

      {filteredCities.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map(city => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <MapPin className="w-12 h-12 text-dark-lighter/30 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-dark mb-2">No cities found</h3>
          <p className="text-sm text-dark-lighter/60">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default CitySearch;
